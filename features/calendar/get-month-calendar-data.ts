import "server-only";

import { prisma } from "../../lib/prisma";

import {
  buildMonthCalendarItems,
  type CalendarItem,
} from "./calendar-items";

export type GetMonthCalendarDataOptions = {
  year: number;
  month: number;
};

export async function getMonthCalendarData({
  year,
  month,
}: GetMonthCalendarDataOptions): Promise<CalendarItem[]> {
  validateMonthInput({ year, month });

  const monthIndex = month - 1;
  const monthStart = new Date(Date.UTC(year, monthIndex, 1));
  const monthEnd = new Date(Date.UTC(year, month, 0));

  const [birthdays, holidays, recurringTransactions, transactions] =
    await Promise.all([
      prisma.birthday.findMany({
        select: {
          id: true,
          name: true,
          date: true,
          notes: true,
        },
        orderBy: [{ date: "asc" }, { name: "asc" }],
      }),
      prisma.holiday.findMany({
        where: {
          OR: [
            { isRecurringYear: true },
            {
              date: {
                gte: monthStart,
                lte: monthEnd,
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          date: true,
          isRecurringYear: true,
          notes: true,
        },
        orderBy: [{ date: "asc" }, { name: "asc" }],
      }),
      prisma.recurringTransaction.findMany({
        where: {
          startDate: {
            lte: monthEnd,
          },
          OR: [{ endDate: null }, { endDate: { gte: monthStart } }],
        },
        select: {
          id: true,
          name: true,
          type: true,
          frequency: true,
          amount: true,
          dayOfMonth: true,
          monthOfYear: true,
          startDate: true,
          endDate: true,
          notes: true,
          category: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: [{ startDate: "asc" }, { name: "asc" }],
      }),
      prisma.transaction.findMany({
        where: {
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        select: {
          id: true,
          name: true,
          type: true,
          date: true,
          amount: true,
          notes: true,
          category: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: [{ date: "asc" }, { name: "asc" }],
      }),
    ]);

  return buildMonthCalendarItems({
    year,
    month,
    birthdays,
    holidays,
    recurringTransactions,
    transactions,
  });
}

function validateMonthInput({
  year,
  month,
}: GetMonthCalendarDataOptions): void {
  if (!Number.isInteger(year)) {
    throw new RangeError("year must be an integer");
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError("month must be an integer between 1 and 12");
  }
}
