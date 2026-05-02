import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  getDate,
  isSameMonth,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export type CalendarGridDay = {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export type CalendarMonthGridOptions = {
  year: number;
  month: number;
  today?: Date;
};

export function generateCalendarMonthGrid({
  year,
  month,
  today = new Date(),
}: CalendarMonthGridOptions): CalendarGridDay[] {
  validateCalendarMonthInput({ year, month });

  const monthDate = new Date(year, month - 1, 1);
  const intervalStart = startOfWeek(startOfMonth(monthDate), {
    weekStartsOn: 0,
  });
  const intervalEnd = endOfWeek(endOfMonth(monthDate), {
    weekStartsOn: 0,
  });

  return eachDayOfInterval({ start: intervalStart, end: intervalEnd }).map(
    (date) => ({
      date,
      dayOfMonth: getDate(date),
      isCurrentMonth: isSameMonth(date, monthDate),
      isToday: isSameDay(date, today),
    }),
  );
}

function validateCalendarMonthInput({
  year,
  month,
}: Pick<CalendarMonthGridOptions, "year" | "month">): void {
  if (!Number.isInteger(year)) {
    throw new RangeError("year must be an integer");
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError("month must be an integer between 1 and 12");
  }
}
