<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Product overview

This is a personal life organization app centered around a monthly calendar.

The app supports:

- Birthdays
- Holidays
- Recurring financial transactions, such as fixed bills and salary
- One-off financial transactions, such as variable expenses
- Categories
- Calendar items derived from the data above

This is a personal-use app. Do not add authentication, users, teams, organizations, sign-up, login, account management, public APIs, notifications, external calendar integrations, CRUD forms, admin panels, or registration APIs unless explicitly requested.

Data will initially be inserted manually through the database or Prisma Studio.

## MVP scope

Focus on:

- Monthly calendar view
- Current day highlight
- Previous/next month navigation
- Day detail page at `/day/YYYY-MM-DD`
- Filters for birthdays, holidays, bills, salary, and expenses
- Normalized calendar item generation
- Basic monthly financial summaries
- Initial charts: expenses by category and income vs expenses

Build the MVP first. Avoid overengineering.

## Calendar rules

- The home page should show the selected month.
- Clicking a day should navigate to `/day/YYYY-MM-DD`.
- Calendar UI must consume normalized `CalendarItem` objects, not raw Prisma models.
- `CalendarItem` is a derived view model. Do not create a primary database table for calendar items unless explicitly requested.

## Financial rules

- Use `Decimal` for money in Prisma.
- Use date-only fields for calendar dates, preferably `DateTime @db.Date` with PostgreSQL.
- Model fixed bills and salary as recurring transactions.
- Model variable expenses as transactions.

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
- Prefer Server Components by default.
- Use Client Components only when interactivity, browser APIs, or hooks are required.
- Keep components small and focused.
- Use named exports except for Next.js route, page, and layout files.
- Avoid `any`; use explicit types or `unknown` with narrowing.
- Use absolute imports with `@/`.

## Architecture

- `/app`: routes, layouts, pages, route handlers.
- `/components`: reusable UI components.
- `/features`: feature-specific components, hooks, services and schemas.
- `/lib`: shared utilities and infrastructure.
- `/server`: server-only logic.
- `/types`: shared TypeScript types.
- `/docs`: documentation.

## Server and database rules

- Do not import Prisma into Client Components.
- Keep database access in server-only files.
- Prefer server-side data loading and pass normalized data to Client Components.
- Never expose `DATABASE_URL` to the client.
- Never prefix secrets with `NEXT_PUBLIC_`.
- Database queries must run only in server-side code.
- Reuse the Prisma singleton from `lib/prisma.ts`.

## Database

This project uses PostgreSQL through Docker Compose and Prisma ORM.

Important files:

- Prisma schema: `prisma/schema.prisma`
- Prisma client singleton: `lib/prisma.ts`
- Prisma migrations: `prisma/migrations`

Commands:

- Start database: `pnpm db:up`
- Stop database: `pnpm db:down`
- Generate Prisma Client: `pnpm prisma generate`
- Create migration: `pnpm prisma migrate dev --name <migration_name>`
- Apply migrations: `pnpm prisma migrate deploy`
- Open Prisma Studio: `pnpm prisma studio`

Rules:

- Do not edit `prisma/migrations` manually unless explicitly asked.
- Do not run `prisma migrate reset` unless explicitly asked.
- For detailed database conventions, read `docs/database.md`.

## Rules for agents

- Before changing code, inspect the relevant files.
- Do not rewrite unrelated code.
- Preserve existing public APIs unless explicitly asked.
- After changes, run typecheck, lint, and relevant tests.
- If a command fails, explain the failure and fix it when possible.
- Prefer small, reviewable commits/PRs.

For product requirements, read `docs/product.md`.
For database and Prisma conventions, read `docs/database.md`.
