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
