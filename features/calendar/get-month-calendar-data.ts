import "server-only";

import { prisma } from "@/lib/prisma";
import { buildMonthFinanceCalendarItems } from "@/features/finance/calendar-items";

import {
  buildMonthCalendarItems,
  type CalendarItem,
  validateMonthInput,
} from "@/features/calendar";

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

  const financeItems = buildMonthFinanceCalendarItems({
    year,
    month,
    recurringTransactions,
    transactions,
  });

  return buildMonthCalendarItems({
    year,
    month,
    birthdays,
    holidays,
    financeItems,
  });
}
