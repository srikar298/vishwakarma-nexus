# Project Instructions: Vishwakarma Nexus
> **Powered by Vishwakarma Knowledge Centre (VKC)**

## Current Architecture
- **Framework**: Fastify (Backend), Next.js (Web Hub - apps/next-web-hub), Flutter (Mobile).
- **ORM**: Drizzle ORM.
- **Database**: PostgreSQL with granular modular schemas.
- **Development Strategy**: Iterative, high-granularity modular monolith.
- **Target Modules**:
    - `IAM`: Auth & Sessions.
    - `Members`: Digital ID & Core Profiles.
    - `Matrimony`: High-growth matchmaking hub.
    - `Finance`: Payments, Ledgers, and Transactions.
    - `Professionals`: Artisan & Professional directory.
    - `Community`: Events & Engagement.
    - `Heritage`: Divine CMS.

## Development Standards
- **Onboarding Flow**: Integrated with `Finance` for paid verification.
- **Module Isolation**: Strict boundaries; cross-module communication via services or event bus.
- **Monorepo**: Managed by Nx.

## Verification Commands
- `pnpm typecheck`: Parallel cached type checking.
- `pnpm typecheck:full`: Root-level absolute truth using `tsc --noEmit`.
