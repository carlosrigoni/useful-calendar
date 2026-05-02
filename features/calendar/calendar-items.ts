export type CalendarItemType =
  | "birthday"
  | "holiday"
  | "bill"
  | "salary"
  | "expense"
  | "income";

export type CalendarHolidayKind = "national" | "optional" | "municipal";

export type CalendarItemSourceType =
  | "birthday"
  | "holiday"
  | "recurringTransaction"
  | "transaction";

export type CalendarItemCategory = {
  id: string;
  name: string;
  color: string | null;
};

export type CalendarItem = {
  id: string;
  sourceId: string;
  sourceType: CalendarItemSourceType;
  type: CalendarItemType;
  holidayKind?: CalendarHolidayKind | null;
  date: Date;
  dateKey: string;
  title: string;
  description: string | null;
  amount: string | null;
  category: CalendarItemCategory | null;
  isRecurring: boolean;
};

export type BirthdayRecord = {
  id: string;
  name: string;
  date: Date;
  notes: string | null;
};

export type HolidayRecord = {
  id: string;
  name: string;
  date: Date;
  kind: CalendarHolidayKind;
  isRecurringYear: boolean;
  notes: string | null;
};

export type BuildMonthCalendarItemsOptions = {
  year: number;
  month: number;
  birthdays: BirthdayRecord[];
  holidays: HolidayRecord[];
  financeItems: CalendarItem[];
};

const calendarItemTypeOrder: Record<CalendarItemType, number> = {
  birthday: 0,
  holiday: 1,
  salary: 2,
  bill: 3,
  income: 4,
  expense: 5,
};

export function buildMonthCalendarItems({
  year,
  month,
  birthdays,
  holidays,
  financeItems,
}: BuildMonthCalendarItemsOptions): CalendarItem[] {
  validateMonthInput({ year, month });

  const monthIndex = month - 1;
  const { start: monthStart, end: monthEnd } = getUtcMonthRange(
    year,
    monthIndex,
  );

  const items = [
    ...birthdays
      .filter((birthday) => getUtcMonth(birthday.date) === monthIndex)
      .map((birthday) => {
        const occurrenceDate = createUtcDate(
          year,
          monthIndex,
          getUtcDayOfMonth(birthday.date),
        );

        return createCalendarItem({
          sourceId: birthday.id,
          sourceType: "birthday",
          type: "birthday",
          date: occurrenceDate,
          title: birthday.name,
          description: birthday.notes,
          amount: null,
          category: null,
          isRecurring: true,
        });
      }),
    ...holidays.flatMap((holiday) => {
      const occurrenceDate = getHolidayOccurrenceDate({
        holiday,
        year,
        monthIndex,
        monthStart,
        monthEnd,
      });

      if (!occurrenceDate) {
        return [];
      }

      return [
        createCalendarItem({
          sourceId: holiday.id,
          sourceType: "holiday",
          type: "holiday",
          holidayKind: holiday.kind,
          date: occurrenceDate,
          title: holiday.name,
          description: holiday.notes,
          amount: null,
          category: null,
          isRecurring: holiday.isRecurringYear,
        }),
      ];
    }),
    ...financeItems.filter((item) =>
      isWithinUtcRange(item.date, monthStart, monthEnd),
    ),
  ];

  return items.sort(compareCalendarItems);
}

function getHolidayOccurrenceDate({
  holiday,
  year,
  monthIndex,
  monthStart,
  monthEnd,
}: {
  holiday: HolidayRecord;
  year: number;
  monthIndex: number;
  monthStart: Date;
  monthEnd: Date;
}): Date | null {
  if (holiday.isRecurringYear) {
    if (getUtcMonth(holiday.date) !== monthIndex) {
      return null;
    }

    return createUtcDate(year, monthIndex, getUtcDayOfMonth(holiday.date));
  }

  const normalizedDate = normalizeUtcDate(holiday.date);

  if (!isWithinUtcRange(normalizedDate, monthStart, monthEnd)) {
    return null;
  }

  return normalizedDate;
}

export function createCalendarItem({
  sourceId,
  sourceType,
  type,
  holidayKind = null,
  date,
  title,
  description,
  amount,
  category,
  isRecurring,
}: {
  sourceId: string;
  sourceType: CalendarItemSourceType;
  type: CalendarItemType;
  holidayKind?: CalendarHolidayKind | null;
  date: Date;
  title: string;
  description: string | null;
  amount: string | null;
  category: CalendarItemCategory | null;
  isRecurring: boolean;
}): CalendarItem {
  const normalizedDate = normalizeUtcDate(date);
  const dateKey = toUtcDateKey(normalizedDate);

  return {
    id: `${sourceType}:${sourceId}:${dateKey}`,
    sourceId,
    sourceType,
    type,
    holidayKind,
    date: normalizedDate,
    dateKey,
    title,
    description,
    amount,
    category,
    isRecurring,
  };
}

export function validateMonthInput({
  year,
  month,
}: {
  year: number;
  month: number;
}): void {
  if (!Number.isInteger(year)) {
    throw new RangeError("year must be an integer");
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError("month must be an integer between 1 and 12");
  }
}

export function compareCalendarItems(
  left: CalendarItem,
  right: CalendarItem,
): number {
  const dateDifference = left.date.getTime() - right.date.getTime();

  if (dateDifference !== 0) {
    return dateDifference;
  }

  const typeDifference =
    calendarItemTypeOrder[left.type] - calendarItemTypeOrder[right.type];

  if (typeDifference !== 0) {
    return typeDifference;
  }

  return left.title.localeCompare(right.title);
}

export function getUtcMonthRange(
  year: number,
  monthIndex: number,
): {
  start: Date;
  end: Date;
} {
  return {
    start: createUtcDate(year, monthIndex, 1),
    end: createUtcDate(year, monthIndex + 1, 0),
  };
}

export function isWithinActiveDateRange({
  date,
  startDate,
  endDate,
}: {
  date: Date;
  startDate: Date;
  endDate: Date | null;
}): boolean {
  const normalizedDate = normalizeUtcDate(date);
  const normalizedStartDate = normalizeUtcDate(startDate);
  const normalizedEndDate = endDate ? normalizeUtcDate(endDate) : null;

  if (normalizedDate.getTime() < normalizedStartDate.getTime()) {
    return false;
  }

  if (
    normalizedEndDate &&
    normalizedDate.getTime() > normalizedEndDate.getTime()
  ) {
    return false;
  }

  return true;
}

export function isSameUtcMonth(
  date: Date,
  year: number,
  monthIndex: number,
): boolean {
  const normalizedDate = normalizeUtcDate(date);

  return (
    normalizedDate.getUTCFullYear() === year &&
    normalizedDate.getUTCMonth() === monthIndex
  );
}

export function isWithinUtcRange(date: Date, start: Date, end: Date): boolean {
  const timestamp = normalizeUtcDate(date).getTime();

  return (
    timestamp >= normalizeUtcDate(start).getTime() &&
    timestamp <= normalizeUtcDate(end).getTime()
  );
}

export function normalizeUtcDate(date: Date): Date {
  return createUtcDate(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
}

export function createUtcDate(
  year: number,
  monthIndex: number,
  day: number,
): Date {
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const safeDay = Math.min(day, daysInMonth);

  return new Date(Date.UTC(year, monthIndex, safeDay));
}

function getUtcMonth(date: Date): number {
  return normalizeUtcDate(date).getUTCMonth();
}

function getUtcDayOfMonth(date: Date): number {
  return normalizeUtcDate(date).getUTCDate();
}

function toUtcDateKey(date: Date): string {
  return normalizeUtcDate(date).toISOString().slice(0, 10);
}
