# ==============================================================================
# Multi-stage Production Dockerfile for Vishwakarma Nexus Modular Fastify Backend
# ==============================================================================

FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# Stage 1: Build & Dependencies
FROM base AS builder
WORKDIR /app

# Copy root workspace configurations
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.json ./

# Copy package manifests for all monorepo modules
COPY apps/backend/package.json ./apps/backend/
COPY libs/shared/package.json ./libs/shared/
COPY libs/db/package.json ./libs/db/
COPY libs/modules/package.json ./libs/modules/

# Install dependencies deterministically
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/backend ./apps/backend
COPY libs/shared ./libs/shared
COPY libs/db ./libs/db
COPY libs/modules ./libs/modules

# Stage 2: Production Runtime
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install curl for container health check
RUN apk add --no-cache curl

# Security: Run as non-root node user
USER node

# Copy workspace from builder
COPY --chown=node:node --from=builder /app /app

EXPOSE 3000

# Health check verifies Fastify liveness
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Execute auto-migrations and launch Fastify server
CMD ["pnpm", "run", "start:prod"]
