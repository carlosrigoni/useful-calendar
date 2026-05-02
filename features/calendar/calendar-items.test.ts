import { describe, expect, it } from "vitest";

import {
  buildMonthCalendarItems,
  type BirthdayRecord,
  type HolidayRecord,
  type RecurringTransactionRecord,
  type TransactionRecord,
} from "./calendar-items";

function money(value: string): { toString(): string } {
  return {
    toString: () => value,
  };
}

describe("buildMonthCalendarItems", () => {
  it("normalizes birthdays, holidays, recurring transactions, and one-off transactions", () => {
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
        isRecurringYear: true,
        notes: null,
      },
      {
        id: "holiday-2",
        name: "Evento especial",
        date: new Date(Date.UTC(2026, 4, 12)),
        isRecurringYear: false,
        notes: "Cidade fechada",
      },
    ];
    const recurringTransactions: RecurringTransactionRecord[] = [
      {
        id: "recurring-1",
        name: "Salario",
        type: "SALARY",
        frequency: "MONTHLY",
        amount: money("5000.00"),
        dayOfMonth: 5,
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
        dayOfMonth: 10,
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
        dayOfMonth: 8,
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

    const items = buildMonthCalendarItems({
      year: 2026,
      month: 5,
      birthdays,
      holidays,
      recurringTransactions,
      transactions,
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
      isRecurring: true,
      amount: null,
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

  it("keeps only items that belong to the selected month and active range", () => {
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
          isRecurringYear: true,
          notes: null,
        },
      ],
      recurringTransactions: [
        {
          id: "recurring-1",
          name: "Conta encerrada",
          type: "BILL",
          frequency: "MONTHLY",
          amount: money("10.00"),
          dayOfMonth: 3,
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
          dayOfMonth: 7,
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

  it("clamps recurring and yearly occurrences to the last day of shorter months", () => {
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
      recurringTransactions: [
        {
          id: "recurring-1",
          name: "Assinatura",
          type: "BILL",
          frequency: "MONTHLY",
          amount: money("39.90"),
          dayOfMonth: 31,
          monthOfYear: null,
          startDate: new Date(Date.UTC(2026, 0, 1)),
          endDate: null,
          notes: null,
          category: null,
        },
      ],
      transactions: [],
    });

    expect(items.map((item) => item.dateKey)).toEqual([
      "2026-02-28",
      "2026-02-28",
    ]);
  });

  it("rejects invalid month input", () => {
    expect(() =>
      buildMonthCalendarItems({
        year: 2026,
        month: 13,
        birthdays: [],
        holidays: [],
        recurringTransactions: [],
        transactions: [],
      }),
    ).toThrowError(/month must be an integer between 1 and 12/i);
  });
});
