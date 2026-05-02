import { describe, expect, it } from "vitest";

import {
  applyCalendarFilters,
  buildCalendarDayCells,
  buildCalendarItemIndex,
  defaultCalendarFilters,
  type CalendarClientGridDay,
  type CalendarClientItem,
} from "@/features/calendar/month-view";

describe("calendar month view helpers", () => {
  it("indexes items by date key", () => {
    const index = buildCalendarItemIndex([
      { id: "1", dateKey: "2026-05-01", type: "birthday" },
      {
        id: "2",
        dateKey: "2026-05-01",
        type: "holiday",
        holidayKind: "national",
      },
      { id: "3", dateKey: "2026-05-02", type: "expense" },
    ]);

    expect(index["2026-05-01"]).toHaveLength(2);
    expect(index["2026-05-02"]).toHaveLength(1);
    expect(index["2026-05-03"]).toBeUndefined();
  });

  it("applies client-side filters to supported calendar types", () => {
    const items: CalendarClientItem[] = [
      { id: "1", dateKey: "2026-05-01", type: "birthday" },
      {
        id: "2",
        dateKey: "2026-05-01",
        type: "holiday",
        holidayKind: "optional",
      },
      { id: "3", dateKey: "2026-05-01", type: "bill" },
      { id: "4", dateKey: "2026-05-01", type: "salary" },
      { id: "5", dateKey: "2026-05-01", type: "expense" },
      { id: "6", dateKey: "2026-05-01", type: "income" },
    ];

    const visibleItems = applyCalendarFilters(items, {
      ...defaultCalendarFilters,
      holidays: false,
      salary: false,
    });

    expect(visibleItems.map((item) => item.type)).toEqual([
      "birthday",
      "bill",
      "expense",
    ]);
  });

  it("summarizes visible indicators for each calendar day", () => {
    const days: CalendarClientGridDay[] = [
      {
        dateKey: "2026-05-01",
        dayOfMonth: 1,
        isCurrentMonth: true,
        isToday: false,
      },
      {
        dateKey: "2026-05-02",
        dayOfMonth: 2,
        isCurrentMonth: true,
        isToday: false,
      },
      {
        dateKey: "2026-05-03",
        dayOfMonth: 3,
        isCurrentMonth: true,
        isToday: false,
      },
    ];

    const dayCells = buildCalendarDayCells({
      days,
      items: [
        { id: "1", dateKey: "2026-05-01", type: "birthday" },
        { id: "2", dateKey: "2026-05-01", type: "expense" },
        { id: "3", dateKey: "2026-05-01", type: "expense" },
        { id: "4", dateKey: "2026-05-01", type: "income" },
        {
          id: "5",
          dateKey: "2026-05-02",
          type: "holiday",
          holidayKind: "optional",
        },
        {
          id: "6",
          dateKey: "2026-05-03",
          type: "holiday",
          holidayKind: "municipal",
        },
      ],
      filters: defaultCalendarFilters,
    });

    expect(dayCells[0]).toMatchObject({
      indicators: ["birthday", "expense"],
      itemCount: 3,
    });
    expect(dayCells[1]).toMatchObject({
      indicators: ["holidayOptional"],
      itemCount: 1,
    });
    expect(dayCells[2]).toMatchObject({
      indicators: ["holidayMunicipal"],
      itemCount: 1,
    });
  });

  it("defaults holiday indicators to national when kind is absent", () => {
    const dayCells = buildCalendarDayCells({
      days: [
        {
          dateKey: "2026-05-01",
          dayOfMonth: 1,
          isCurrentMonth: true,
          isToday: false,
        },
      ],
      items: [{ id: "1", dateKey: "2026-05-01", type: "holiday" }],
      filters: defaultCalendarFilters,
    });

    expect(dayCells[0]).toMatchObject({
      indicators: ["holidayNational"],
      itemCount: 1,
    });
  });

  it("returns empty indicators for days without visible items", () => {
    const dayCells = buildCalendarDayCells({
      days: [
        {
          dateKey: "2026-05-01",
          dayOfMonth: 1,
          isCurrentMonth: true,
          isToday: true,
        },
      ],
      items: [
        {
          id: "1",
          dateKey: "2026-05-01",
          type: "holiday",
          holidayKind: "national",
        },
      ],
      filters: {
        ...defaultCalendarFilters,
        holidays: false,
      },
    });

    expect(dayCells[0]).toMatchObject({
      indicators: [],
      itemCount: 0,
    });
  });
});
