# Product requirements

## Product overview

This is a personal life organization app centered around a monthly calendar.

The app is for personal use only. Do not add authentication, users, teams, organizations, sign-up, login, account management, public APIs, notifications, external calendar integrations, CRUD forms, admin panels, or registration APIs unless explicitly requested.

Data will initially be inserted manually through the database or Prisma Studio.

## Main concepts

The app should support:

- Birthdays
- Holidays
- Recurring financial transactions, such as fixed bills and salary
- One-off financial transactions, such as variable expenses
- Categories
- Calendar items derived from the data above

## MVP scope

The MVP should focus on:

- Monthly calendar view
- Current day highlight
- Previous/next month navigation
- Day detail page at `/day/YYYY-MM-DD`
- Filters for birthdays, holidays, bills, salary, and expenses
- Normalized calendar item generation
- Basic monthly financial summaries
- Initial charts:
  - Expenses by category
  - Income vs expenses, or fixed vs variable expenses

Build the MVP first. Avoid overengineering.

## Main calendar experience

The month calendar is the main interface.

The home page should show the selected month.

The calendar should:

- Show the current day with clear visual highlighting.
- Allow navigating to the previous month.
- Allow navigating to the next month.
- Allow clicking a day to navigate to `/day/YYYY-MM-DD`.
- Support filters for:
  - Birthdays
  - Holidays
  - Fixed bills
  - Salary
  - Variable expenses

## Day detail page

The route `/day/YYYY-MM-DD` should show the selected day in detail.

The day page should show all normalized calendar items for that date, grouped or ordered in a way that is easy to scan.

Suggested grouping:

- Birthdays
- Holidays
- Income
- Fixed bills
- Variable expenses

Do not create edit forms for the day page unless explicitly requested.

## Financial behavior

The monthly view should show small financial summaries and charts.

At minimum, the app should be able to calculate:

- Total monthly income
- Total monthly expenses
- Fixed expenses
- Variable expenses
- Expenses by category
- Net balance for the selected month

## Out of scope unless explicitly requested

Do not add:

- Authentication
- User accounts
- Team or organization support
- Sign-up or login
- Public APIs
- External calendar integrations
- Notifications
- CRUD screens
- Admin panels
- Import/export flows
- Multi-user permissions
- Payment integrations

## Product decision rule

When a request is ambiguous, prefer the simpler personal-use MVP interpretation.

Do not introduce SaaS, multi-tenant, enterprise, or collaboration concepts unless explicitly requested.
