"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  CashflowDatum,
  ExpenseByCategoryDatum,
  MonthFinanceSummary,
} from "@/features/finance/month-finance-summary";

type MonthFinanceChartsProps = {
  summary: MonthFinanceSummary;
};

const CATEGORY_FALLBACK_COLORS = [
  "#0f766e",
  "#2563eb",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#475569",
];

const CASHFLOW_COLORS: Record<CashflowDatum["name"], string> = {
  Entradas: "#15803d",
  Saidas: "#b91c1c",
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function MonthFinanceCharts({ summary }: MonthFinanceChartsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartCard
        title="Gastos por categoria"
        subtitle="Despesas variaveis do mes"
      >
        {summary.expensesByCategory.length === 0 ? (
          <EmptyState message="Sem gastos categorizados neste mes." />
        ) : (
          <ExpensesByCategoryChart data={summary.expensesByCategory} />
        )}
      </ChartCard>

      <ChartCard title="Entradas vs saidas" subtitle="Fluxo financeiro do mes">
        {summary.totalIncome === 0 && summary.totalExpenses === 0 ? (
          <EmptyState message="Sem movimentacoes financeiras neste mes." />
        ) : (
          <CashflowChart data={summary.cashflowSummary} />
        )}
      </ChartCard>
    </div>
  );
}

function ExpensesByCategoryChart({
  data,
}: {
  data: ExpenseByCategoryDatum[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_12rem]">
      <div className="h-52 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={208}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={46}
              outerRadius={76}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`${entry.name}-${index}`}
                  fill={
                    entry.color ??
                    CATEGORY_FALLBACK_COLORS[
                      index % CATEGORY_FALLBACK_COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatTooltipValue(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="space-y-2 text-sm">
        {data.map((entry, index) => (
          <li
            key={`${entry.name}-${index}`}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor:
                    entry.color ??
                    CATEGORY_FALLBACK_COLORS[
                      index % CATEGORY_FALLBACK_COLORS.length
                    ],
                }}
              />
              <span className="truncate">{entry.name}</span>
            </span>
            <span className="whitespace-nowrap font-medium text-neutral-900 dark:text-neutral-100">
              {currencyFormatter.format(entry.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CashflowChart({ data }: { data: CashflowDatum[] }) {
  return (
    <div className="h-52 min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={208}>
        <BarChart data={data} barCategoryGap={24}>
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => currencyFormatter.format(value)}
            width={76}
          />
          <Tooltip formatter={(value) => formatTooltipValue(value)} />
          <Bar dataKey="value" radius={[10, 10, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={CASHFLOW_COLORS[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-3xl border border-neutral-200 bg-white/80 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50">
      <div className="mb-4 space-y-1">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </h2>
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
          {subtitle}
        </p>
      </div>
      {children}
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-52 items-center justify-center rounded-2xl border border-dashed border-neutral-300 px-4 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
      {message}
    </div>
  );
}

function formatTooltipValue(
  value: number | string | ReadonlyArray<number | string> | undefined,
): string {
  const numericValue = Array.isArray(value) ? value[0] : value;
  const amount =
    typeof numericValue === "number"
      ? numericValue
      : Number.parseFloat(numericValue ?? "");

  return Number.isFinite(amount) ? currencyFormatter.format(amount) : "R$ 0";
}
