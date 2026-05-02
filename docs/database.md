# Database and Prisma conventions

## Database overview

This project uses PostgreSQL through Docker Compose and Prisma ORM.

Important files:

- Prisma schema: `prisma/schema.prisma`
- Prisma client singleton: `lib/prisma.ts`
- Prisma migrations: `prisma/migrations`

## Commands

- Start database: `pnpm db:up`
- Stop database: `pnpm db:down`
- View database logs: `pnpm db:logs`
- Generate Prisma Client: `pnpm prisma generate`
- Create and apply a development migration: `pnpm prisma migrate dev --name <migration_name>`
- Apply existing migrations: `pnpm prisma migrate deploy`
- Open Prisma Studio: `pnpm prisma studio`
- Reset local database: `pnpm prisma migrate reset`

## Safety rules

- Never expose `DATABASE_URL` to the client.
- Never prefix database secrets with `NEXT_PUBLIC_`.
- Keep `.env` and `.env.local` out of Git.
- Keep `.env.example` updated whenever a new required environment variable is added.
- Do not run `pnpm prisma migrate reset` unless explicitly requested.
- Do not edit files inside `prisma/migrations` manually unless explicitly requested.

## Prisma rules

- Use Prisma-generated types instead of manually duplicating database types.
- Reuse the Prisma singleton from `lib/prisma.ts`.
- Do not instantiate `PrismaClient` in multiple files.
- Do not access Prisma from Client Components.
- Files that import Prisma must be server-only.
- Prefer importing `"server-only"` in modules that access the database.
- After changing `prisma/schema.prisma`, run `pnpm prisma generate`.
- When adding or changing models, create a migration with a clear name.

## Money and dates

Use `Decimal` for money in Prisma.

Use date-only fields for calendar dates, preferably:

```prisma
DateTime @db.Date
```
