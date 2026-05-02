import { describe, expect, it } from "vitest";

import { generateCalendarMonthGrid } from "./month-grid";

describe("generateCalendarMonthGrid", () => {
  it("generates every visible day for a month in chronological order", () => {
    const days = generateCalendarMonthGrid({
      year: 2026,
      month: 5,
      today: new Date(2026, 4, 10),
    });

    expect(days).toHaveLength(42);
    expect(days[0]?.date).toEqual(new Date(2026, 3, 26));
    expect(days.at(-1)?.date).toEqual(new Date(2026, 5, 6));
  });

  it("includes leading and trailing days to complete weeks", () => {
    const days = generateCalendarMonthGrid({
      year: 2026,
      month: 5,
      today: new Date(2026, 4, 1),
    });

    const leadingDays = days.filter(
      (day) => !day.isCurrentMonth && day.date.getMonth() === 3,
    );
    const trailingDays = days.filter(
      (day) => !day.isCurrentMonth && day.date.getMonth() === 5,
    );

    expect(leadingDays).toHaveLength(5);
    expect(trailingDays).toHaveLength(6);
  });

  it("always starts on sunday and ends on saturday", () => {
    const days = generateCalendarMonthGrid({
      year: 2026,
      month: 5,
      today: new Date(2026, 4, 1),
    });

    expect(days[0]?.date.getDay()).toBe(0);
    expect(days.at(-1)?.date.getDay()).toBe(6);
  });

  it("returns only the necessary number of visible weeks", () => {
    const fourWeekMonth = generateCalendarMonthGrid({
      year: 2026,
      month: 2,
      today: new Date(2026, 1, 1),
    });
    const fiveWeekMonth = generateCalendarMonthGrid({
      year: 2026,
      month: 3,
      today: new Date(2026, 2, 1),
    });
    const sixWeekMonth = generateCalendarMonthGrid({
      year: 2026,
      month: 5,
      today: new Date(2026, 4, 1),
    });

    expect(fourWeekMonth).toHaveLength(28);
    expect(fiveWeekMonth).toHaveLength(35);
    expect(sixWeekMonth).toHaveLength(42);
  });

  it("marks only the provided today value as current day", () => {
    const days = generateCalendarMonthGrid({
      year: 2026,
      month: 5,
      today: new Date(2026, 4, 15),
    });

    const todayDays = days.filter((day) => day.isToday);

    expect(todayDays).toHaveLength(1);
    expect(todayDays[0]?.date).toEqual(new Date(2026, 4, 15));
  });

  it("marks days outside the selected month as not belonging to the month", () => {
    const days = generateCalendarMonthGrid({
      year: 2026,
      month: 5,
      today: new Date(2026, 4, 1),
    });

    expect(days[0]?.isCurrentMonth).toBe(false);
    expect(days[5]?.isCurrentMonth).toBe(true);
    expect(days.at(-1)?.isCurrentMonth).toBe(false);
  });

  it("rejects invalid month input", () => {
    expect(() =>
      generateCalendarMonthGrid({
        year: 2026,
        month: 0,
      }),
    ).toThrowError(/month must be an integer between 1 and 12/i);
  });
});
