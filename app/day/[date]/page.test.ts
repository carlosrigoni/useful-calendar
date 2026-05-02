import { describe, expect, it } from "vitest";

import {
  getCalendarItemLabel,
  getHolidayKindLabel,
} from "@/app/day/[date]/labels";
import type { CalendarItem } from "@/features/calendar";

describe("day page labels", () => {
  it("returns holiday subtype labels", () => {
    expect(getHolidayKindLabel("national")).toBe("Feriado nacional");
    expect(getHolidayKindLabel("optional")).toBe("Ponto facultativo");
    expect(getHolidayKindLabel("municipal")).toBe("Feriado municipal");
  });

  it("uses the holiday subtype when labeling a calendar item", () => {
    const item: CalendarItem = {
      id: "holiday:1:2026-12-24",
      sourceId: "1",
      sourceType: "holiday",
      type: "holiday",
      holidayKind: "optional",
      date: new Date(Date.UTC(2026, 11, 24)),
      dateKey: "2026-12-24",
      title: "Vespera de Natal",
      description: null,
      amount: null,
      category: null,
      isRecurring: false,
    };

    expect(getCalendarItemLabel(item)).toBe("Ponto facultativo");
  });
});
