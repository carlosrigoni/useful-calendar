<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Project overview

This is a Next.js app using App Router, TypeScript, Tailwind CSS and pnpm.

## Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Run tests: `pnpm test`
- Run e2e tests: `pnpm test:e2e`

## Code style

- Use TypeScript everywhere.
- Prefer server components by default.
- Use client components only when interactivity, browser APIs or hooks are required.
- Keep components small and focused.
- Use named exports except for Next.js route/page/layout files.
- Avoid `any`; use explicit types or `unknown` with narrowing.
- Use absolute imports with `@/`.

## Architecture

- `/app`: routes, layouts, pages, route handlers.
- `/components`: reusable UI components.
- `/features`: feature-specific components, hooks, services and schemas.
- `/lib`: shared utilities and infrastructure.
- `/server`: server-only logic.
- `/types`: shared TypeScript types.
- `/docs`: documentation

## Rules for agents

- Before changing code, inspect the relevant files.
- Do not rewrite unrelated code.
- Preserve existing public APIs unless explicitly asked.
- After changes, run typecheck, lint and relevant tests.
- If a command fails, explain the failure and fix it when possible.
- Prefer small, reviewable commits/PRs.

## Database

This project uses PostgreSQL locally through Docker Compose and Prisma ORM for database access.

### Local database

The local database runs in Docker Compose.

Commands:

- Start database: `pnpm db:up`
- Stop database: `pnpm db:down`
- View database logs: `pnpm db:logs`
- Reset database volume: `pnpm db:reset`

Environment:

- Local database URL: `DATABASE_URL`
- `DATABASE_URL` must only be used server-side.
- Do not expose `DATABASE_URL` to the client.
- Never prefix database secrets with `NEXT_PUBLIC_`.
- Keep `.env` and `.env.local` out of Git.
- Keep `.env.example` updated whenever a new required environment variable is added.

Before running migrations, seeds, Prisma Studio, or database tests, make sure the database is running.

### Prisma

Prisma is the ORM used by this project.

Important files:

- Prisma schema: `prisma/schema.prisma`
- Prisma migrations: `prisma/migrations`
- Prisma client singleton: `src/lib/prisma.ts`

Common commands:

- Generate Prisma Client: `pnpm prisma generate`
- Create and apply a development migration: `pnpm prisma migrate dev --name <migration_name>`
- Apply existing migrations: `pnpm prisma migrate deploy`
- Open Prisma Studio: `pnpm prisma studio`
- Reset local database and reapply migrations: `pnpm prisma migrate reset`

Rules:

- Do not edit files inside `prisma/migrations` manually unless explicitly asked.
- Do not run `prisma migrate reset` unless explicitly asked, because it deletes local data.
- Prefer `prisma migrate dev` for local schema changes.
- Prefer `prisma migrate deploy` for applying existing migrations in production/CI.
- After changing `prisma/schema.prisma`, run `pnpm prisma generate`.
- When adding or changing models, create a migration with a clear name.
- Keep model names singular and PascalCase, for example `User`, `Post`, `Account`.
- Keep relation names explicit when relations become ambiguous.
- Use Prisma-generated types instead of manually duplicating database types.
- Do not access Prisma directly from client components.
- Database queries must run only in server-side code: Server Components, Server Actions, Route Handlers, or server-only services.
- Reuse the Prisma client from `src/lib/prisma.ts`; do not instantiate `PrismaClient` in multiple files.

### Prisma Client in Next.js

Use a singleton Prisma client to avoid creating multiple Prisma Client instances during development hot reload.

Expected file:

`src/lib/prisma.ts`

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```
