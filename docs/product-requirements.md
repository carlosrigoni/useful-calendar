# Product Requirements

## Product overview

This project is a personal-use application for organizing life around a monthly calendar with basic financial tracking.

The calendar is the main interface. Birthdays, holidays, recurring bills, salary, and one-off financial transactions should all appear as calendar items for the selected month.

The app is intentionally local-first and single-user. Data will initially be inserted manually through Prisma Studio or direct database access.

## Product goals

The MVP should help answer a few practical questions quickly:

- What happens this month?
- What is happening on a specific day?
- Which bills, income, and expenses fall on the calendar?
- How much was spent this month, and in which categories?

## MVP scope

The MVP should include:

- A monthly calendar on `/`
- Month selection through query params such as `/?year=2026&month=5`
- Visual highlight for the current day
- Navigation to previous and next months
- Clickable days that open `/day/YYYY-MM-DD`
- Calendar markers for birthdays
- Calendar markers for holidays
- Calendar markers for recurring fixed bills
- Calendar markers for recurring salary
- Calendar markers for manually inserted one-off transactions
- Filters by item type:
  - birthdays
  - holidays
  - bills
  - salary
  - expenses
- Basic monthly financial summaries
- Two small charts for the selected month:
  - expenses by category
  - income vs expenses, or fixed vs variable

## Out of scope for now

The following are explicitly out of scope unless requested later:

- Authentication, login, sign-up, or account management
- Multi-user support
- Teams, organizations, or permissions
- CRUD forms for entering data
- Public APIs or admin APIs
- Notifications or reminders
- External calendar integrations
- Import/export flows
- Budgeting workflows beyond simple monthly summaries
- Advanced reporting dashboards
- Mobile app work

## Main entities

The system is expected to work with these core concepts:

- `Birthday`
  - Stores birthdays for friends and family.
- `Holiday`
  - Stores holidays that should appear on the calendar.
- `Category`
  - Classifies financial transactions, especially expenses.
- `RecurringTransaction`
  - Represents repeating money events such as fixed bills and salary.
- `Transaction`
  - Represents one-off expenses or one-off income entries.
- `CalendarItem`
  - A normalized view model derived from the entities above for UI consumption.

## CalendarItem mental model

`CalendarItem` is not a primary persisted entity in the MVP. It is a derived representation built from birthdays, holidays, recurring transactions, and transactions.

The calendar UI should consume normalized `CalendarItem` objects instead of raw Prisma models so that all event types can be rendered consistently.

At minimum, each `CalendarItem` should carry:

- a stable identifier
- a date
- a type
- a title
- optional subtitle or description
- optional amount
- optional category metadata
- enough information to link back to its source entity

## Planned routes

- `/`
  - Monthly calendar view for the current month by default.
- `/?year=2026&month=5`
  - Monthly calendar view for a selected month.
- `/day/YYYY-MM-DD`
  - Detail page for a single day showing all normalized calendar items for that date.

## Financial behavior in the calendar

Financial data is part of the calendar experience, not a separate subsystem with its own primary UI.

Expected behavior:

- Fixed bills appear on their scheduled day each month.
- Salary appears on its recurring pay date.
- One-off expenses appear on the actual transaction date.
- One-off income may also appear on the actual transaction date.
- Monthly summaries are calculated from items that belong to the selected month.
- Category totals are derived from transactions associated with expense categories.

This means the selected month drives both:

- the calendar grid
- the list of normalized calendar items
- the monthly finance summaries and charts

## Implementation rules

- Keep the MVP simple and avoid overengineering.
- Prefer server-side data loading for the initial month and day pages.
- Use Client Components only for interaction-heavy behavior such as filters, month navigation state, and day-click UI handling.
- Do not import Prisma into Client Components.
- Keep database access in server-only modules.
- Do not create CRUD forms in this phase.
- Do not add authentication or multi-user concepts.
- Do not create a primary database table for `CalendarItem`.

## Recommended next steps

1. Define the Prisma schema for `Birthday`, `Holiday`, `Category`, `RecurringTransaction`, and `Transaction`.
2. Document the normalized `CalendarItem` TypeScript shape in the calendar feature.
3. Implement server-side month aggregation logic that builds calendar items from database records.
4. Implement the monthly calendar page and the day detail page.
5. Add month-level financial summary calculations and small charts.
