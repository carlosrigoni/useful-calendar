import { describe, expect, it } from "vitest";

import {
  buildMonthFinanceCalendarItems,
  type RecurringTransactionRecord,
  type TransactionRecord,
} from "@/features/finance/calendar-items";

function money(value: string): { toString(): string } {
  return {
    toString: () => value,
  };
}

describe("buildMonthFinanceCalendarItems", () => {
  it("normalizes recurring transactions and one-off transactions", () => {
    const recurringTransactions: RecurringTransactionRecord[] = [
      {
        id: "recurring-1",
        name: "Salario",
        type: "SALARY",
        frequency: "MONTHLY",
        amount: money("1000.00"),
        dayRule: "CALENDAR_DAY",
        dayOfMonth: 5,
        businessDayOfMonth: null,
        monthOfYear: null,
        startDate: new Date(Date.UTC(2026, 0, 1)),
        endDate: null,
        notes: null,
        category: null,
      },
      {
        id: "recurring-2",
        name: "Aluguel",
        type: "BILL",
        frequency: "MONTHLY",
        amount: money("1500.00"),
        dayRule: "CALENDAR_DAY",
        dayOfMonth: 10,
        businessDayOfMonth: null,
        monthOfYear: null,
        startDate: new Date(Date.UTC(2026, 0, 1)),
        endDate: null,
        notes: "Pagar via pix",
        category: {
          id: "category-1",
          name: "Moradia",
          color: "#334455",
        },
      },
      {
        id: "recurring-3",
        name: "IPVA",
        type: "BILL",
        frequency: "YEARLY",
        amount: money("900.00"),
        dayRule: "CALENDAR_DAY",
        dayOfMonth: 8,
        businessDayOfMonth: null,
        monthOfYear: 5,
        startDate: new Date(Date.UTC(2026, 0, 1)),
        endDate: null,
        notes: null,
        category: null,
      },
    ];
    const transactions: TransactionRecord[] = [
      {
        id: "transaction-1",
        name: "Mercado",
        type: "EXPENSE",
        date: new Date(Date.UTC(2026, 4, 3)),
        amount: money("220.45"),
        notes: "Compra do mes",
        category: {
          id: "category-2",
          name: "Alimentacao",
          color: "#55aa66",
        },
      },
      {
        id: "transaction-2",
        name: "Freela",
        type: "INCOME",
        date: new Date(Date.UTC(2026, 4, 18)),
        amount: money("800.00"),
        notes: null,
        category: null,
      },
    ];

    const items = buildMonthFinanceCalendarItems({
      year: 2026,
      month: 5,
      recurringTransactions,
      transactions,
    });

    expect(items.map((item) => [item.dateKey, item.type, item.title])).toEqual([
      ["2026-05-05", "salary", "Salario"],
      ["2026-05-10", "bill", "Aluguel"],
      ["2026-05-08", "bill", "IPVA"],
      ["2026-05-03", "expense", "Mercado"],
      ["2026-05-18", "income", "Freela"],
    ]);

    expect(items[0]).toMatchObject({
      sourceType: "recurringTransaction",
      amount: "1000.00",
      isRecurring: true,
    });
    expect(items[1]?.category).toEqual({
      id: "category-1",
      name: "Moradia",
      color: "#334455",
    });
  });

  it("keeps only financial items active in the selected month", () => {
    const items = buildMonthFinanceCalendarItems({
      year: 2026,
      month: 5,
      recurringTransactions: [
        {
          id: "recurring-1",
          name: "Conta encerrada",
          type: "BILL",
          frequency: "MONTHLY",
          amount: money("10.00"),
          dayRule: "CALENDAR_DAY",
          dayOfMonth: 3,
          businessDayOfMonth: null,
          monthOfYear: null,
          startDate: new Date(Date.UTC(2026, 0, 1)),
          endDate: new Date(Date.UTC(2026, 3, 30)),
          notes: null,
          category: null,
        },
        {
          id: "recurring-2",
          name: "Frequencia anual fora do mes",
          type: "BILL",
          frequency: "YEARLY",
          amount: money("20.00"),
          dayRule: "CALENDAR_DAY",
          dayOfMonth: 7,
          businessDayOfMonth: null,
          monthOfYear: 6,
          startDate: new Date(Date.UTC(2026, 0, 1)),
          endDate: null,
          notes: null,
          category: null,
        },
      ],
      transactions: [
        {
          id: "transaction-1",
          name: "Abril",
          type: "EXPENSE",
          date: new Date(Date.UTC(2026, 3, 30)),
          amount: money("99.00"),
          notes: null,
          category: null,
        },
      ],
    });

    expect(items).toEqual([]);
  });

  it("clamps recurring occurrences to the last day of shorter months", () => {
    const items = buildMonthFinanceCalendarItems({
      year: 2026,
      month: 2,
      recurringTransactions: [
        {
          id: "recurring-1",
          name: "Assinatura",
          type: "BILL",
          frequency: "MONTHLY",
          amount: money("39.90"),
          dayRule: "CALENDAR_DAY",
          dayOfMonth: 31,
          businessDayOfMonth: null,
          monthOfYear: null,
          startDate: new Date(Date.UTC(2026, 0, 1)),
          endDate: null,
          notes: null,
          category: null,
        },
      ],
      transactions: [],
    });

    expect(items.map((item) => item.dateKey)).toEqual(["2026-02-28"]);
  });

  it("supports recurring transactions scheduled on the nth business day", () => {
    const items = buildMonthFinanceCalendarItems({
      year: 2026,
      month: 5,
      recurringTransactions: [
        {
          id: "recurring-1",
          name: "Salario",
          type: "SALARY",
          frequency: "MONTHLY",
          amount: money("100.00"),
          dayRule: "BUSINESS_DAY",
          dayOfMonth: null,
          businessDayOfMonth: 5,
          monthOfYear: null,
          startDate: new Date(Date.UTC(2026, 0, 1)),
          endDate: null,
          notes: null,
          category: null,
        },
      ],
      holidayDateKeys: ["2026-05-01"],
      transactions: [],
    });

    expect(items.map((item) => [item.dateKey, item.type, item.title])).toEqual([
      ["2026-05-08", "salary", "Salario"],
    ]);
  });
});
