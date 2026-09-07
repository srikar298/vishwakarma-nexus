import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTPayload } from '@vishwakarma-k-c/shared';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorize: (slug: string) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user?: JWTPayload;
  }
}
