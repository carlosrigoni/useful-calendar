import Link from "next/link";
import { notFound } from "next/navigation";

import { getCalendarItemLabel } from "@/app/day/[date]/labels";
import type { CalendarItem } from "@/features/calendar";
import { getDayCalendarData } from "@/features/calendar/get-day-calendar-data";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "full",
  timeZone: "UTC",
});

export default async function DayPage({ params }: PageProps<"/day/[date]">) {
  const { date } = await params;

  let dayData;

  try {
    dayData = await getDayCalendarData(date);
  } catch {
    notFound();
  }

  const hasItems =
    dayData.birthdays.length > 0 ||
    dayData.holidays.length > 0 ||
    dayData.finances.length > 0;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-3">
        <Link
          href={`/?year=${dayData.date.getUTCFullYear()}&month=${dayData.date.getUTCMonth() + 1}`}
          className="text-sm text-neutral-500 underline underline-offset-4"
        >
          Voltar para o mes
        </Link>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">
            Detalhe do dia
          </p>
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            {dateFormatter.format(dayData.date)}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {dayData.dateKey}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Section
          title="Aniversarios"
          items={dayData.birthdays}
          emptyMessage="Nenhum aniversario neste dia."
        />
        <Section
          title="Feriados"
          items={dayData.holidays}
          emptyMessage="Nenhum feriado neste dia."
        />
        <Section
          title="Financas"
          items={dayData.finances}
          emptyMessage="Nenhuma movimentacao financeira neste dia."
          showAmounts
        />
      </div>

      {!hasItems ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 px-5 py-6 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
          Nenhum item encontrado para esta data.
        </div>
      ) : null}
    </main>
  );
}

function Section({
  title,
  items,
  emptyMessage,
  showAmounts = false,
}: {
  title: string;
  items: CalendarItem[];
  emptyMessage: string;
  showAmounts?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white/70 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/40">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </h2>
        <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {emptyMessage}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-neutral-200 px-4 py-3 dark:border-neutral-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {item.title}
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                    {getCalendarItemLabel(item)}
                  </p>
                  {item.description ? (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  ) : null}
                  {item.category ? (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Categoria: {item.category.name}
                    </p>
                  ) : null}
                </div>
                {showAmounts && item.amount ? (
                  <p className="whitespace-nowrap text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {formatAmount(item.amount)}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatAmount(amount: string): string {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return amount;
  }

  return currencyFormatter.format(numericAmount);
}
