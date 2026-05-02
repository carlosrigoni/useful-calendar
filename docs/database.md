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
- Prisma client singleton: `lib/prisma.ts`

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
- Reuse the Prisma client from `lib/prisma.ts`; do not instantiate `PrismaClient` in multiple files.

### Prisma Client in Next.js

Use a singleton Prisma client to avoid creating multiple Prisma Client instances during development hot reload.

Expected file:

`lib/prisma.ts`

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

### Data access conventions

- Keep database access out of UI components when logic becomes non-trivial.
- Prefer feature-level server files for database operations, for example:
  - `features/users/server/queries.ts`
  - `features/users/server/mutations.ts`
  - `features/users/schemas.ts`
- Validate external input before writing to the database.
- Use transactions with `prisma.$transaction` when multiple writes must succeed or fail together.
- Never trust client-provided user IDs, roles, prices, ownership, or permissions without server-side validation.
- Do not return sensitive fields to the client, such as password hashes, tokens, secrets, or internal metadata.
- Files that import Prisma should be server-only.
- If useful, import `"server-only"` in modules that access the database.
- Never import `lib/prisma.ts` from files marked with `"use client"`.

### When working on database tasks

Before making changes:

1. Inspect `prisma/schema.prisma`.
2. Inspect existing migrations when relevant.
3. Inspect existing feature/server data-access patterns.
4. Confirm the database is running if migration or query execution is needed.

After making changes:

1. Run `pnpm prisma generate`.
2. Run the relevant migration command if the schema changed.
3. Run `pnpm typecheck`.
4. Run `pnpm lint`.
5. Run relevant tests if they exist.
6. Explain which models, migrations, and queries changed.
