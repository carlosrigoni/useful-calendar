"use client";

import Link from "next/link";
import { useState } from "react";

import {
  buildCalendarDayCells,
  defaultCalendarFilters,
  type CalendarClientGridDay,
  type CalendarClientItem,
  type CalendarFilterKey,
  type CalendarFilters,
  type CalendarIndicatorType,
} from "@/features/calendar/month-view";

type MonthCalendarProps = {
  title: string;
  previousMonthHref: string;
  nextMonthHref: string;
  days: CalendarClientGridDay[];
  items: CalendarClientItem[];
};

const weekDayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

const filterLabels: Record<CalendarFilterKey, string> = {
  birthdays: "Aniversarios",
  holidays: "Feriados",
  bills: "Contas",
  salary: "Salario",
  expenses: "Gastos",
};

const indicatorColors: Record<CalendarIndicatorType, string> = {
  birthday: "bg-sky-500",
  holiday: "bg-amber-500",
  bill: "bg-rose-500",
  salary: "bg-emerald-500",
  expense: "bg-violet-500",
};

export function MonthCalendar({
  title,
  previousMonthHref,
  nextMonthHref,
  days,
  items,
}: MonthCalendarProps) {
  const [filters, setFilters] = useState<CalendarFilters>(defaultCalendarFilters);
  const dayCells = buildCalendarDayCells({
    days,
    items,
    filters,
  });

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white/85 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/50">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Calendario mensal
            </p>
            <h2 className="text-2xl font-semibold capitalize text-neutral-950 dark:text-neutral-50">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <MonthLink href={previousMonthHref} label="Mes anterior" />
            <MonthLink href={nextMonthHref} label="Proximo mes" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            Object.keys(filterLabels) as Array<keyof typeof filterLabels>
          ).map((filterKey) => {
            const isActive = filters[filterKey];

            return (
              <button
                key={filterKey}
                type="button"
                onClick={() =>
                  setFilters((currentFilters) => ({
                    ...currentFilters,
                    [filterKey]: !currentFilters[filterKey],
                  }))
                }
                className={`rounded-full border px-3 py-2 text-sm transition ${
                  isActive
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950"
                    : "border-neutral-300 bg-transparent text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
                }`}
                aria-pressed={isActive}
              >
                {filterLabels[filterKey]}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.18em] text-neutral-500">
          {weekDayLabels.map((label) => (
            <div key={label} className="py-2">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dayCells.map((day) => (
            <Link
              key={day.dateKey}
              href={`/day/${day.dateKey}`}
              className={`min-h-28 rounded-2xl border p-3 transition hover:border-neutral-400 hover:bg-neutral-50 dark:hover:border-neutral-600 dark:hover:bg-neutral-900 ${
                day.isCurrentMonth
                  ? "border-neutral-200 bg-white/70 dark:border-neutral-800 dark:bg-neutral-950/40"
                  : "border-neutral-200/70 bg-neutral-100/70 text-neutral-400 dark:border-neutral-800/70 dark:bg-neutral-900/40 dark:text-neutral-500"
              } ${
                day.isToday
                  ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-white dark:ring-offset-neutral-950"
                  : ""
              }`}
            >
              <div className="flex h-full flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      day.isCurrentMonth
                        ? "text-neutral-950 dark:text-neutral-50"
                        : "text-neutral-400 dark:text-neutral-500"
                    }`}
                  >
                    {day.dayOfMonth}
                  </span>
                  {day.itemCount > 0 ? (
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {day.itemCount}
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {day.indicators.map((indicator) => (
                    <span
                      key={`${day.dateKey}-${indicator}`}
                      className={`h-2.5 w-2.5 rounded-full ${indicatorColors[indicator]}`}
                    />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function MonthLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:text-neutral-50"
    >
      {label}
    </Link>
  );
}
