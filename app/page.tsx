import { MonthFinanceCharts } from "@/components/month-finance-charts";
import { getMonthCalendarData } from "@/features/calendar/get-month-calendar-data";
import { buildMonthFinanceSummary } from "@/features/finance/month-finance-summary";

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const today = new Date();
  const fallbackYear = today.getUTCFullYear();
  const fallbackMonth = today.getUTCMonth() + 1;
  const year = parseNumericParam(params.year, fallbackYear, {
    min: 1900,
    max: 2100,
  });
  const month = parseNumericParam(params.month, fallbackMonth, {
    min: 1,
    max: 12,
  });
  const monthItems = await getMonthCalendarData({ year, month });
  const financeSummary = buildMonthFinanceSummary(monthItems);
  const monthDate = new Date(Date.UTC(year, month - 1, 1));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
      <section className="rounded-[2rem] border border-neutral-200 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.12),_transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,244,245,0.92))] p-6 shadow-sm dark:border-neutral-800 dark:bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.14),_transparent_38%),linear-gradient(180deg,rgba(10,10,10,0.96),rgba(23,23,23,0.92))]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Resumo financeiro
            </p>
            <h1 className="text-3xl font-semibold capitalize text-neutral-950 dark:text-neutral-50">
              {monthFormatter.format(monthDate)}
            </h1>
            <p className="max-w-2xl text-sm text-neutral-600 dark:text-neutral-300">
              Dois recortes rapidos do mes selecionado: distribuicao dos gastos
              por categoria e comparacao direta entre entradas e saidas.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryCard
              label="Entradas"
              value={currencyFormatter.format(financeSummary.totalIncome)}
              tone="positive"
            />
            <SummaryCard
              label="Saidas"
              value={currencyFormatter.format(financeSummary.totalExpenses)}
              tone="negative"
            />
            <SummaryCard
              label="Saldo"
              value={currencyFormatter.format(financeSummary.netBalance)}
              tone={financeSummary.netBalance >= 0 ? "positive" : "negative"}
            />
          </div>
        </div>
      </section>

      <MonthFinanceCharts summary={financeSummary} />
    </main>
  );
}

function parseNumericParam(
  value: string | string[] | undefined,
  fallback: number,
  range?: { min: number; max: number },
): number {
  if (typeof value !== "string") {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedValue)) {
    return fallback;
  }

  if (range && (parsedValue < range.min || parsedValue > range.max)) {
    return fallback;
  }

  return parsedValue;
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "positive" | "negative";
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/70">
      <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </p>
      <p
        className={`mt-2 text-lg font-semibold ${
          tone === "positive"
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-rose-700 dark:text-rose-400"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
