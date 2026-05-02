import "server-only";

import type { CalendarItem } from "@/features/calendar";
import { parseDateInput } from "@/features/calendar/date-input";
import { getMonthCalendarData } from "@/features/calendar/get-month-calendar-data";

export type DayCalendarData = {
  date: Date;
  dateKey: string;
  birthdays: CalendarItem[];
  holidays: CalendarItem[];
  finances: CalendarItem[];
};

export async function getDayCalendarData(dateInput: string): Promise<DayCalendarData> {
  const date = parseDateInput(dateInput);
  const dateKey = toDateKey(date);
  const monthItems = await getMonthCalendarData({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
  });

  const dayItems = monthItems.filter((item) => item.dateKey === dateKey);

  return {
    date,
    dateKey,
    birthdays: dayItems.filter((item) => item.type === "birthday"),
    holidays: dayItems.filter((item) => item.type === "holiday"),
    finances: dayItems.filter(
      (item) =>
        item.type === "salary" ||
        item.type === "bill" ||
        item.type === "income" ||
        item.type === "expense",
    ),
  };
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
