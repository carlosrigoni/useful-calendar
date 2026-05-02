import {
  RecurrenceFrequency,
  RecurringDayRule,
  RecurringTransactionType,
  TransactionType,
} from "@/app/generated/prisma/enums";
import {
  createCalendarItem,
  createUtcDate,
  getUtcMonthRange,
  isSameUtcMonth,
  isWithinActiveDateRange,
  isWithinUtcRange,
  normalizeUtcDate,
  type CalendarItem,
  type CalendarItemCategory,
} from "@/features/calendar";

type MoneyValue = {
  toString(): string;
};

export type RecurringTransactionRecord = {
  id: string;
  name: string;
  type: RecurringTransactionType;
  frequency: RecurrenceFrequency;
  amount: MoneyValue;
  dayRule: RecurringDayRule;
  dayOfMonth: number | null;
  businessDayOfMonth: number | null;
  monthOfYear: number | null;
  startDate: Date;
  endDate: Date | null;
  notes: string | null;
  category: CalendarItemCategory | null;
};

export type TransactionRecord = {
  id: string;
  name: string;
  type: TransactionType;
  date: Date;
  amount: MoneyValue;
  notes: string | null;
  category: CalendarItemCategory | null;
};

export type BuildMonthFinanceCalendarItemsOptions = {
  year: number;
  month: number;
  recurringTransactions: RecurringTransactionRecord[];
  transactions: TransactionRecord[];
};

export function buildMonthFinanceCalendarItems({
  year,
  month,
  recurringTransactions,
  transactions,
}: BuildMonthFinanceCalendarItemsOptions): CalendarItem[] {
  const monthIndex = month - 1;
  const { start: monthStart, end: monthEnd } = getUtcMonthRange(year, monthIndex);

  return [
    ...recurringTransactions.flatMap((transaction) => {
      const occurrenceDate = getRecurringTransactionOccurrenceDate({
        transaction,
        year,
        month,
      });

      if (!occurrenceDate) {
        return [];
      }

      if (!isWithinUtcRange(occurrenceDate, monthStart, monthEnd)) {
        return [];
      }

      if (
        !isWithinActiveDateRange({
          date: occurrenceDate,
          startDate: transaction.startDate,
          endDate: transaction.endDate,
        })
      ) {
        return [];
      }

      return [
        createCalendarItem({
          sourceId: transaction.id,
          sourceType: "recurringTransaction",
          type:
            transaction.type === RecurringTransactionType.SALARY
              ? "salary"
              : "bill",
          date: occurrenceDate,
          title: transaction.name,
          description: transaction.notes,
          amount: transaction.amount.toString(),
          category: transaction.category,
          isRecurring: true,
        }),
      ];
    }),
    ...transactions
      .filter((transaction) => isSameUtcMonth(transaction.date, year, monthIndex))
      .map((transaction) =>
        createCalendarItem({
          sourceId: transaction.id,
          sourceType: "transaction",
          type:
            transaction.type === TransactionType.INCOME ? "income" : "expense",
          date: normalizeUtcDate(transaction.date),
          title: transaction.name,
          description: transaction.notes,
          amount: transaction.amount.toString(),
          category: transaction.category,
          isRecurring: false,
        }),
      ),
  ];
}

function getRecurringTransactionOccurrenceDate({
  transaction,
  year,
  month,
}: {
  transaction: RecurringTransactionRecord;
  year: number;
  month: number;
}): Date | null {
  const monthIndex = month - 1;
  const scheduledDay = getScheduledDayOfMonth({
    transaction,
    year,
    monthIndex,
  });

  if (scheduledDay === null) {
    return null;
  }

  if (transaction.frequency === RecurrenceFrequency.MONTHLY) {
    return createUtcDate(year, monthIndex, scheduledDay);
  }

  if (
    transaction.frequency === RecurrenceFrequency.YEARLY &&
    transaction.monthOfYear === month
  ) {
    return createUtcDate(year, monthIndex, scheduledDay);
  }

  return null;
}

function getScheduledDayOfMonth({
  transaction,
  year,
  monthIndex,
}: {
  transaction: RecurringTransactionRecord;
  year: number;
  monthIndex: number;
}): number | null {
  if (transaction.dayRule === RecurringDayRule.BUSINESS_DAY) {
    if (transaction.businessDayOfMonth === null) {
      return null;
    }

    return getBusinessDayOfMonth(year, monthIndex, transaction.businessDayOfMonth);
  }

  return transaction.dayOfMonth;
}

function getBusinessDayOfMonth(
  year: number,
  monthIndex: number,
  ordinal: number,
): number {
  let businessDayCount = 0;
  const lastDayOfMonth = createUtcDate(year, monthIndex + 1, 0).getUTCDate();

  for (let day = 1; day <= lastDayOfMonth; day += 1) {
    const date = createUtcDate(year, monthIndex, day);
    const weekDay = date.getUTCDay();

    if (weekDay === 0 || weekDay === 6) {
      continue;
    }

    businessDayCount += 1;

    if (businessDayCount === ordinal) {
      return day;
    }
  }

  return lastDayOfMonth;
}
