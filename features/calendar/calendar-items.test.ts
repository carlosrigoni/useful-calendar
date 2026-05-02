import { describe, expect, it } from "vitest";

import {
  buildMonthCalendarItems,
  type BirthdayRecord,
  type CalendarItem,
  type HolidayRecord,
} from "@/features/calendar/calendar-items";

describe("buildMonthCalendarItems", () => {
  it("combines birthday, holiday, and financial items into a sorted month list", () => {
    const birthdays: BirthdayRecord[] = [
      {
        id: "birthday-1",
        name: "Ana",
        date: new Date(Date.UTC(1992, 4, 20)),
        notes: "Levar presente",
      },
    ];
    const holidays: HolidayRecord[] = [
      {
        id: "holiday-1",
        name: "Dia do Trabalho",
        date: new Date(Date.UTC(2020, 4, 1)),
        kind: "national",
        isRecurringYear: true,
        notes: null,
      },
      {
        id: "holiday-2",
        name: "Evento especial",
        date: new Date(Date.UTC(2026, 4, 12)),
        kind: "municipal",
        isRecurringYear: false,
        notes: "Cidade fechada",
      },
    ];
    const financeItems: CalendarItem[] = [
      {
        id: "recurringTransaction:recurring-1:2026-05-05",
        sourceId: "recurring-1",
        sourceType: "recurringTransaction",
        type: "salary",
        date: new Date(Date.UTC(2026, 4, 5)),
        dateKey: "2026-05-05",
        title: "Salario",
        description: null,
        amount: "5000.00",
        category: null,
        isRecurring: true,
      },
      {
        id: "recurringTransaction:recurring-2:2026-05-10",
        sourceId: "recurring-2",
        sourceType: "recurringTransaction",
        type: "bill",
        date: new Date(Date.UTC(2026, 4, 10)),
        dateKey: "2026-05-10",
        title: "Aluguel",
        description: "Pagar via pix",
        amount: "1500.00",
        category: {
          id: "category-1",
          name: "Moradia",
          color: "#334455",
        },
        isRecurring: true,
      },
      {
        id: "recurringTransaction:recurring-3:2026-05-08",
        sourceId: "recurring-3",
        sourceType: "recurringTransaction",
        type: "bill",
        date: new Date(Date.UTC(2026, 4, 8)),
        dateKey: "2026-05-08",
        title: "IPVA",
        description: null,
        amount: "900.00",
        category: null,
        isRecurring: true,
      },
      {
        id: "transaction:transaction-1:2026-05-03",
        sourceId: "transaction-1",
        sourceType: "transaction",
        type: "expense",
        date: new Date(Date.UTC(2026, 4, 3)),
        dateKey: "2026-05-03",
        title: "Mercado",
        description: "Compra do mes",
        amount: "220.45",
        category: {
          id: "category-2",
          name: "Alimentacao",
          color: "#55aa66",
        },
        isRecurring: false,
      },
      {
        id: "transaction:transaction-2:2026-05-18",
        sourceId: "transaction-2",
        sourceType: "transaction",
        type: "income",
        date: new Date(Date.UTC(2026, 4, 18)),
        dateKey: "2026-05-18",
        title: "Freela",
        description: null,
        amount: "800.00",
        category: null,
        isRecurring: false,
      },
    ];

    const items = buildMonthCalendarItems({
      year: 2026,
      month: 5,
      birthdays,
      holidays,
      financeItems,
    });

    expect(items.map((item) => [item.dateKey, item.type, item.title])).toEqual([
      ["2026-05-01", "holiday", "Dia do Trabalho"],
      ["2026-05-03", "expense", "Mercado"],
      ["2026-05-05", "salary", "Salario"],
      ["2026-05-08", "bill", "IPVA"],
      ["2026-05-10", "bill", "Aluguel"],
      ["2026-05-12", "holiday", "Evento especial"],
      ["2026-05-18", "income", "Freela"],
      ["2026-05-20", "birthday", "Ana"],
    ]);

    expect(items[0]).toMatchObject({
      sourceType: "holiday",
      holidayKind: "national",
      isRecurring: true,
      amount: null,
    });
    expect(items[5]).toMatchObject({
      sourceType: "holiday",
      holidayKind: "municipal",
    });
    expect(items[3]).toMatchObject({
      sourceType: "recurringTransaction",
      amount: "900.00",
    });
    expect(items[4]?.category).toEqual({
      id: "category-1",
      name: "Moradia",
      color: "#334455",
    });
  });

  it("keeps only items that belong to the selected month", () => {
    const items = buildMonthCalendarItems({
      year: 2026,
      month: 5,
      birthdays: [
        {
          id: "birthday-1",
          name: "Carlos",
          date: new Date(Date.UTC(1995, 3, 1)),
          notes: null,
        },
      ],
      holidays: [
        {
          id: "holiday-1",
          name: "Feriado de junho",
          date: new Date(Date.UTC(2020, 5, 1)),
          kind: "national",
          isRecurringYear: true,
          notes: null,
        },
      ],
      financeItems: [
        {
          id: "transaction:transaction-1:2026-04-30",
          sourceId: "transaction-1",
          sourceType: "transaction",
          type: "expense",
          date: new Date(Date.UTC(2026, 3, 30)),
          dateKey: "2026-04-30",
          title: "Abril",
          description: null,
          amount: "99.00",
          category: null,
          isRecurring: false,
        },
      ],
    });

    expect(items).toEqual([]);
  });

  it("clamps birthday occurrences to the last day of shorter months", () => {
    const items = buildMonthCalendarItems({
      year: 2026,
      month: 2,
      birthdays: [
        {
          id: "birthday-1",
          name: "Pessoa bissexta",
          date: new Date(Date.UTC(1992, 1, 29)),
          notes: null,
        },
      ],
      holidays: [],
      financeItems: [],
    });

    expect(items.map((item) => item.dateKey)).toEqual(["2026-02-28"]);
  });

  it("rejects invalid month input", () => {
    expect(() =>
      buildMonthCalendarItems({
        year: 2026,
        month: 13,
        birthdays: [],
        holidays: [],
        financeItems: [],
      }),
    ).toThrowError(/month must be an integer between 1 and 12/i);
  });
});
