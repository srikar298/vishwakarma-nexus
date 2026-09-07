import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import { defaultIdempotencyEngine, IdempotencyEngine } from "../idempotency/idempotency-engine";
import { errorResponse } from "../../contracts/api-response.dto";
import { logger } from "../../logger";

/**
 * Enterprise Fastify Idempotency Plugin
 * Enforces RFC standard idempotent semantics, SHA-256 payload integrity, and response replays.
 */
const idempotencyPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const engine = defaultIdempotencyEngine;

  fastify.addHook("preHandler", async (request: FastifyRequest, reply: FastifyReply) => {
    // Only apply to routes that opted in
    if (!request.routeOptions.config.idempotency) return;

    const idempotencyKey = request.headers["idempotency-key"] as string;

    if (!idempotencyKey) {
      return reply.code(400).send(
        errorResponse("Idempotency-Key header is required for this operation.")
      );
    }

    const userId = (request as any).user?.id || "anonymous";
    const fingerprint = engine.computeFingerprint(
      request.method,
      request.url,
      request.body
    );

    const check = await engine.checkAndAcquire(userId, idempotencyKey, fingerprint);

    // 1. Payload Mismatch: Same key used with different payload
    if (check.state === "FINGERPRINT_MISMATCH") {
      return reply.code(422).send(
        errorResponse("Idempotency-Key payload conflict. This key was already used with a different request payload.")
      );
    }

    // 2. In-Progress: Another concurrent request with the same key is active
    if (check.state === "IN_PROGRESS") {
      reply.header("Retry-After", check.retryAfterSeconds);
      return reply.code(409).send(
        errorResponse("A request with this Idempotency-Key is currently being processed. Please retry shortly.")
      );
    }

    // 3. Replay Ready: Previous request succeeded; replay the cached response exactly
    if (check.state === "REPLAY_READY") {
      const record = check.record;
      logger.info({ idempotencyKey, userId }, "Idempotency: Replaying cached response");

      reply.header("Idempotent-Replayed", "true");
      reply.header("X-Idempotency-Cache", "HIT");

      if (record.responseHeaders) {
        for (const [k, v] of Object.entries(record.responseHeaders)) {
          if (k.toLowerCase() !== "content-length") {
            reply.header(k, v);
          }
        }
      }

      return reply.code(record.responseStatus || 200).send(record.responseBody);
    }

    // 4. New Acquired: Attach state to request for onSend hook
    (request as any)._idempotency = {
      userId,
      idempotencyKey,
      fingerprint,
    };
  });

  fastify.addHook("onSend", async (request: FastifyRequest, reply: FastifyReply, payload: any) => {
    const idemp = (request as any)._idempotency;
    if (!idemp) return payload;

    const statusCode = reply.statusCode;

    // Cache successful and client-side deterministic error responses (2xx, 3xx, 4xx)
    // Server errors (5xx) are skipped to allow natural retry
    if (statusCode >= 200 && statusCode < 500) {
      try {
        let parsedBody = payload;
        if (typeof payload === "string") {
          try {
            parsedBody = JSON.parse(payload);
          } catch {
            parsedBody = payload;
          }
        }

        const headers: Record<string, string> = {};
        const contentType = reply.getHeader("content-type");
        if (contentType) headers["content-type"] = String(contentType);

        await engine.saveCompleted(
          idemp.userId,
          idemp.idempotencyKey,
          idemp.fingerprint,
          statusCode,
          parsedBody,
          headers
        );
      } catch (err) {
        logger.error({ err, key: idemp.idempotencyKey }, "Idempotency: Failed to save completed response");
        await engine.releaseLock(idemp.userId, idemp.idempotencyKey);
      }
    } else {
      // 5xx Server Error: Release in-progress lock
      await engine.releaseLock(idemp.userId, idemp.idempotencyKey);
    }

    return payload;
  });

  fastify.addHook("onError", async (request: FastifyRequest, _reply, error) => {
    const idemp = (request as any)._idempotency;
    if (!idemp) return;

    logger.error({ error, key: idemp.idempotencyKey }, "Idempotency: Releasing lock due to handler error");
    await engine.releaseLock(idemp.userId, idemp.idempotencyKey);
  });
};

export default fp(idempotencyPlugin, {
  name: "fastify-idempotency",
  fastify: "5.x",
});
