import type {
  CalendarHolidayKind,
  CalendarItem,
  CalendarItemType,
} from "@/features/calendar";

const calendarTypeLabels: Record<CalendarItemType, string> = {
  birthday: "Aniversario",
  holiday: "Feriado",
  salary: "Salario",
  bill: "Conta",
  income: "Entrada",
  expense: "Gasto",
};

export function getCalendarItemLabel(item: CalendarItem): string {
  if (item.type !== "holiday") {
    return calendarTypeLabels[item.type];
  }

  return getHolidayKindLabel(item.holidayKind ?? "national");
}

export function getHolidayKindLabel(kind: CalendarHolidayKind): string {
  switch (kind) {
    case "national":
      return "Feriado nacional";
    case "optional":
      return "Ponto facultativo";
    case "municipal":
      return "Feriado municipal";
  }
}
