import type {
  CalendarHolidayKind,
  CalendarItem,
  CalendarItemType,
} from "@/features/calendar/calendar-items";
import type { CalendarGridDay } from "@/features/calendar/month-grid";

export type CalendarFilterKey =
  | "birthdays"
  | "holidays"
  | "bills"
  | "salary"
  | "expenses";

export type CalendarIndicatorType =
  | "birthday"
  | "holidayNational"
  | "holidayOptional"
  | "holidayMunicipal"
  | "bill"
  | "salary"
  | "expense";

export type CalendarFilters = Record<CalendarFilterKey, boolean>;

export type CalendarClientGridDay = {
  dateKey: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export type CalendarClientItem = Pick<
  CalendarItem,
  "id" | "dateKey" | "type" | "holidayKind"
>;

export type CalendarDayCell = CalendarClientGridDay & {
  indicators: CalendarIndicatorType[];
  itemCount: number;
};

export const defaultCalendarFilters: CalendarFilters = {
  birthdays: true,
  holidays: true,
  bills: true,
  salary: true,
  expenses: true,
};

export function serializeCalendarGridDays(
  days: CalendarGridDay[],
): CalendarClientGridDay[] {
  return days.map((day) => ({
    dateKey: toDateKey(day.date),
    dayOfMonth: day.dayOfMonth,
    isCurrentMonth: day.isCurrentMonth,
    isToday: day.isToday,
  }));
}

export function serializeCalendarItems(
  items: CalendarItem[],
): CalendarClientItem[] {
  return items.map((item) => ({
    id: item.id,
    dateKey: item.dateKey,
    type: item.type,
    holidayKind: item.holidayKind ?? null,
  }));
}

export function buildCalendarItemIndex(
  items: CalendarClientItem[],
): Record<string, CalendarClientItem[]> {
  return items.reduce<Record<string, CalendarClientItem[]>>((index, item) => {
    const currentItems = index[item.dateKey];

    if (currentItems) {
      currentItems.push(item);
    } else {
      index[item.dateKey] = [item];
    }

    return index;
  }, {});
}

export function applyCalendarFilters(
  items: CalendarClientItem[],
  filters: CalendarFilters,
): CalendarClientItem[] {
  return items.filter((item) => {
    const filterKey = itemTypeToFilterKey(item.type);

    if (!filterKey) {
      return false;
    }

    return filters[filterKey];
  });
}

export function buildCalendarDayCells({
  days,
  items,
  filters,
}: {
  days: CalendarClientGridDay[];
  items: CalendarClientItem[];
  filters: CalendarFilters;
}): CalendarDayCell[] {
  const indexedItems = buildCalendarItemIndex(items);

  return days.map((day) => {
    const dayItems = indexedItems[day.dateKey] ?? [];
    const visibleItems = applyCalendarFilters(dayItems, filters);

    return {
      ...day,
      indicators: summarizeIndicatorTypes(visibleItems),
      itemCount: visibleItems.length,
    };
  });
}

function summarizeIndicatorTypes(
  items: CalendarClientItem[],
): CalendarIndicatorType[] {
  const indicators = new Set<CalendarIndicatorType>();

  for (const item of items) {
    const indicatorType = itemToIndicatorType(item);

    if (indicatorType) {
      indicators.add(indicatorType);
    }
  }

  return [...indicators];
}

function itemToIndicatorType(
  item: CalendarClientItem,
): CalendarIndicatorType | null {
  if (item.type === "income") {
    return null;
  }

  if (item.type !== "holiday") {
    return item.type;
  }

  return holidayKindToIndicatorType(item.holidayKind ?? "national");
}

function itemTypeToFilterKey(type: CalendarItemType): CalendarFilterKey | null {
  switch (type) {
    case "birthday":
      return "birthdays";
    case "holiday":
      return "holidays";
    case "bill":
      return "bills";
    case "salary":
      return "salary";
    case "expense":
      return "expenses";
    case "income":
      return null;
  }
}

function holidayKindToIndicatorType(
  kind: CalendarHolidayKind,
): CalendarIndicatorType {
  switch (kind) {
    case "national":
      return "holidayNational";
    case "optional":
      return "holidayOptional";
    case "municipal":
      return "holidayMunicipal";
  }
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
