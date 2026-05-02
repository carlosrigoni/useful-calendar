import type { CalendarItem } from "@/features/calendar";

export type ExpenseByCategoryDatum = {
  name: string;
  value: number;
  color: string | null;
};

export type CashflowDatum = {
  name: "Entradas" | "Saidas";
  value: number;
};

export type MonthFinanceSummary = {
  expensesByCategory: ExpenseByCategoryDatum[];
  cashflowSummary: CashflowDatum[];
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
};

const UNCATEGORIZED_LABEL = "Sem categoria";

export function buildMonthFinanceSummary(
  items: CalendarItem[],
): MonthFinanceSummary {
  const expensesByCategoryMap = new Map<
    string,
    { name: string; value: number; color: string | null }
  >();

  let totalIncome = 0;
  let totalExpenses = 0;

  for (const item of items) {
    const amount = parseAmount(item.amount);

    if (amount === null) {
      continue;
    }

    if (item.type === "income" || item.type === "salary") {
      totalIncome += amount;
    }

    if (item.type === "expense" || item.type === "bill") {
      totalExpenses += amount;

      if (item.type === "expense") {
        const categoryKey = item.category?.id ?? UNCATEGORIZED_LABEL;
        const currentCategory = expensesByCategoryMap.get(categoryKey);

        if (currentCategory) {
          currentCategory.value += amount;
          continue;
        }

        expensesByCategoryMap.set(categoryKey, {
          name: item.category?.name ?? UNCATEGORIZED_LABEL,
          value: amount,
          color: item.category?.color ?? null,
        });
      }
    }
  }

  const expensesByCategory = [...expensesByCategoryMap.values()].sort(
    (left, right) => right.value - left.value,
  );

  return {
    expensesByCategory,
    cashflowSummary: [
      { name: "Entradas", value: totalIncome },
      { name: "Saidas", value: totalExpenses },
    ],
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
  };
}

function parseAmount(amount: string | null): number | null {
  if (amount === null) {
    return null;
  }

  const numericAmount = Number(amount);

  return Number.isFinite(numericAmount) ? numericAmount : null;
}
