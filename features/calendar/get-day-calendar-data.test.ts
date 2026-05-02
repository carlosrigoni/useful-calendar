import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDayCalendarData } from "@/features/calendar/get-day-calendar-data";
import { getMonthCalendarData } from "@/features/calendar/get-month-calendar-data";

vi.mock("@/features/calendar/get-month-calendar-data", () => ({
  getMonthCalendarData: vi.fn(),
}));

const getMonthCalendarDataMock = vi.mocked(getMonthCalendarData);

describe("getDayCalendarData", () => {
  beforeEach(() => {
    getMonthCalendarDataMock.mockReset();
  });

  it("groups normalized items for the requested date", async () => {
    getMonthCalendarDataMock.mockResolvedValue([
      {
        id: "birthday:birthday-1:2026-05-20",
        sourceId: "birthday-1",
        sourceType: "birthday",
        type: "birthday",
        date: new Date(Date.UTC(2026, 4, 20)),
        dateKey: "2026-05-20",
        title: "Ana",
        description: null,
        amount: null,
        category: null,
        isRecurring: true,
      },
      {
        id: "holiday:holiday-1:2026-05-20",
        sourceId: "holiday-1",
        sourceType: "holiday",
        type: "holiday",
        date: new Date(Date.UTC(2026, 4, 20)),
        dateKey: "2026-05-20",
        title: "Feriado local",
        description: null,
        amount: null,
        category: null,
        isRecurring: false,
      },
      {
        id: "transaction:transaction-1:2026-05-20",
        sourceId: "transaction-1",
        sourceType: "transaction",
        type: "expense",
        date: new Date(Date.UTC(2026, 4, 20)),
        dateKey: "2026-05-20",
        title: "Mercado",
        description: null,
        amount: "120.00",
        category: null,
        isRecurring: false,
      },
      {
        id: "transaction:transaction-2:2026-05-21",
        sourceId: "transaction-2",
        sourceType: "transaction",
        type: "income",
        date: new Date(Date.UTC(2026, 4, 21)),
        dateKey: "2026-05-21",
        title: "Freela",
        description: null,
        amount: "300.00",
        category: null,
        isRecurring: false,
      },
    ]);

    const dayData = await getDayCalendarData("2026-05-20");

    expect(getMonthCalendarDataMock).toHaveBeenCalledWith({
      year: 2026,
      month: 5,
    });
    expect(dayData.dateKey).toBe("2026-05-20");
    expect(dayData.birthdays.map((item) => item.title)).toEqual(["Ana"]);
    expect(dayData.holidays.map((item) => item.title)).toEqual(["Feriado local"]);
    expect(dayData.finances.map((item) => item.title)).toEqual(["Mercado"]);
  });

  it("rejects invalid date input", async () => {
    await expect(getDayCalendarData("2026-02-30")).rejects.toThrowError(
      /valid calendar date/i,
    );
  });
});
