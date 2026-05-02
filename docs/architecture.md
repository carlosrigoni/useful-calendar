# Architecture

## Overview

This project is a Next.js App Router application for a personal calendar and basic finance tracker.

The architecture should stay simple:

- server-first for data loading
- feature-oriented for domain logic
- local-first for product scope
- normalized calendar items for UI rendering

The calendar is the center of the app. Multiple underlying data sources should be transformed into a shared `CalendarItem` view model before reaching the UI.

## Planned directory structure

The target structure for feature code is:

```text
app/
  page.tsx
  day/[date]/page.tsx
components/
docs/
lib/
src/
  features/
    calendar/
    finance/
```

Notes:

- The current repository may not fully use `src/` yet.
- This document describes the intended structure to evolve toward.
- This task does not require moving existing code.

## Architectural principles

- Prefer Server Components by default.
- Use Client Components only where interactivity is required.
- Keep Prisma and database access in server-only modules.
- Keep React UI components focused on rendering prepared data.
- Normalize data before it reaches calendar UI components.
- Avoid cross-cutting abstractions until they are clearly needed.

## Route architecture

Planned routes:

- `/`
  - Renders the monthly calendar.
  - Accepts `year` and `month` search params.
- `/day/YYYY-MM-DD`
  - Renders the detail page for a single date.

Expected behavior:

- If `year` and `month` are absent, the home page should default to the current month.
- Route-level server code should fetch and prepare the selected month or day data.
- UI components should render normalized outputs rather than raw database records.

## Feature boundaries

### `src/features/calendar`

Responsibilities:

- month selection logic
- calendar grid generation
- normalized `CalendarItem` types
- calendar item grouping and sorting
- filter state and filter definitions
- day detail shaping

This feature owns the main UI contract used by the calendar.

### `src/features/finance`

Responsibilities:

- monthly summary calculations
- category-based aggregations
- income vs expenses or fixed vs variable chart data
- finance-specific mapping from transaction records into calendar items

This feature should provide finance-oriented derived data, but the calendar feature remains the primary consumer-facing layer.

## Data flow

The intended data flow is:

1. Server route reads the selected month or day from params.
2. Server-only modules query raw persisted entities.
3. Feature services transform those records into normalized `CalendarItem` objects and finance summaries.
4. Server Components pass those normalized objects to presentation components.
5. Client Components handle filters and lightweight interaction only.

## Domain relationship between finance and calendar

Finance data should be calendar-aware by design.

- `RecurringTransaction` creates expected calendar entries for repeating events such as salary and monthly bills.
- `Transaction` creates actual dated entries for one-off expenses or income.
- `Category` is mainly used for grouping, filtering, and chart summaries.
- Monthly summaries should be derived from the same month selection that powers the calendar.

This keeps the calendar and finance views consistent because they are based on the same normalized month dataset.

## Planned server-side modules

Examples of responsibilities that should live in server-only files:

- database queries
- recurring transaction expansion for a selected month
- date range selection for month views
- normalization into `CalendarItem`
- monthly total calculations
- chart dataset preparation

These modules may live under feature folders or under a server-oriented shared layer, but they must not be imported by Client Components.

## Planned UI composition

The future UI can be split into small focused pieces such as:

- month page container
- calendar grid
- calendar day cell
- calendar item badges or markers
- filter controls
- monthly finance summary
- chart cards
- day detail list

Even if some of these are Client Components later, they should receive already prepared data whenever possible.

## Implementation rules

- Do not import Prisma into Client Components.
- Reuse the Prisma singleton from `lib/prisma.ts`.
- Keep secrets server-side only.
- Prefer date-only handling for calendar semantics.
- Use Prisma `Decimal` for money values.
- Do not create CRUD APIs in this phase.
- Do not add authentication or user models.
- Do not create a persisted `CalendarItem` table unless explicitly requested later.

## Non-goals

This architecture does not currently aim to support:

- public API consumers
- background jobs
- multi-tenant data models
- real-time sync
- collaborative workflows
- external integrations

## Recommended implementation sequence

1. Define the Prisma schema for the core entities.
2. Add TypeScript types for normalized calendar items and finance summary outputs.
3. Implement server-side month and day data loaders.
4. Build the monthly calendar route and day detail route.
5. Add filters and summary/chart presentation.
