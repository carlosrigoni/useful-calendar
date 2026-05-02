import { describe, expect, it } from "vitest";

import type { CalendarItem } from "../calendar";
import { buildMonthFinanceSummary } from "./month-finance-summary";

function createCalendarItem(
  overrides: Partial<CalendarItem> & Pick<CalendarItem, "id" | "type" | "title">,
): CalendarItem {
  return {
    id: overrides.id,
    sourceId: overrides.sourceId ?? overrides.id,
    sourceType: overrides.sourceType ?? "transaction",
    type: overrides.type,
    date: overrides.date ?? new Date(Date.UTC(2026, 4, 1)),
    dateKey: overrides.dateKey ?? "2026-05-01",
    title: overrides.title,
    description: overrides.description ?? null,
    amount: overrides.amount ?? null,
    category: overrides.category ?? null,
    isRecurring: overrides.isRecurring ?? false,
  };
}

describe("buildMonthFinanceSummary", () => {
  it("aggregates income and expense totals across monthly item types", () => {
    const summary = buildMonthFinanceSummary([
      createCalendarItem({
        id: "salary-1",
        type: "salary",
        title: "Salario",
        amount: "5000.00",
        sourceType: "recurringTransaction",
        isRecurring: true,
      }),
      createCalendarItem({
        id: "income-1",
        type: "income",
        title: "Freela",
        amount: "850.50",
      }),
      createCalendarItem({
        id: "bill-1",
        type: "bill",
        title: "Aluguel",
        amount: "1500.00",
        sourceType: "recurringTransaction",
        isRecurring: true,
      }),
      createCalendarItem({
        id: "expense-1",
        type: "expense",
        title: "Mercado",
        amount: "230.10",
      }),
    ]);

    expect(summary.totalIncome).toBeCloseTo(5850.5);
    expect(summary.totalExpenses).toBeCloseTo(1730.1);
    expect(summary.netBalance).toBeCloseTo(4120.4);
    expect(summary.cashflowSummary).toEqual([
      { name: "Entradas", value: 5850.5 },
      { name: "Saidas", value: 1730.1 },
    ]);
  });

  it("groups expense items by category and keeps category colors", () => {
    const summary = buildMonthFinanceSummary([
      createCalendarItem({
        id: "expense-1",
        type: "expense",
        title: "Mercado",
        amount: "120.00",
        category: {
          id: "food",
          name: "Alimentacao",
          color: "#55aa66",
        },
      }),
      createCalendarItem({
        id: "expense-2",
        type: "expense",
        title: "Padaria",
        amount: "35.00",
        category: {
          id: "food",
          name: "Alimentacao",
          color: "#55aa66",
        },
      }),
      createCalendarItem({
        id: "expense-3",
        type: "expense",
        title: "Taxi",
        amount: "40.00",
        category: {
          id: "transport",
          name: "Transporte",
          color: "#3366cc",
        },
      }),
    ]);

    expect(summary.expensesByCategory).toEqual([
      { name: "Alimentacao", value: 155, color: "#55aa66" },
      { name: "Transporte", value: 40, color: "#3366cc" },
    ]);
  });

  it("groups uncategorized expenses into a dedicated bucket", () => {
    const summary = buildMonthFinanceSummary([
      createCalendarItem({
        id: "expense-1",
        type: "expense",
        title: "Cafe",
        amount: "10.50",
      }),
      createCalendarItem({
        id: "expense-2",
        type: "expense",
        title: "Livro",
        amount: "42.00",
      }),
    ]);

    expect(summary.expensesByCategory).toEqual([
      { name: "Sem categoria", value: 52.5, color: null },
    ]);
  });

  it("returns empty chart data when the month has no financial items", () => {
    const summary = buildMonthFinanceSummary([
      createCalendarItem({
        id: "birthday-1",
        type: "birthday",
        title: "Ana",
      }),
      createCalendarItem({
        id: "holiday-1",
        type: "holiday",
        title: "Feriado",
      }),
    ]);

    expect(summary.expensesByCategory).toEqual([]);
    expect(summary.totalIncome).toBe(0);
    expect(summary.totalExpenses).toBe(0);
    expect(summary.netBalance).toBe(0);
  });

  it("ignores items with missing or invalid amounts", () => {
    const summary = buildMonthFinanceSummary([
      createCalendarItem({
        id: "expense-1",
        type: "expense",
        title: "Mercado",
        amount: "not-a-number",
      }),
      createCalendarItem({
        id: "income-1",
        type: "income",
        title: "Pix",
        amount: null,
      }),
      createCalendarItem({
        id: "expense-2",
        type: "expense",
        title: "Farmacia",
        amount: "49.90",
        category: {
          id: "health",
          name: "Saude",
          color: null,
        },
      }),
    ]);

    expect(summary.expensesByCategory).toEqual([
      { name: "Saude", value: 49.9, color: null },
    ]);
    expect(summary.totalIncome).toBe(0);
    expect(summary.totalExpenses).toBe(49.9);
  });
});
