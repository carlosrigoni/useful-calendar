import { describe, expect, it } from "vitest";

import { parseDateInput } from "@/features/calendar/date-input";

describe("parseDateInput", () => {
  it("parses a valid YYYY-MM-DD date into a UTC date", () => {
    const date = parseDateInput("2026-05-20");

    expect(date.toISOString()).toBe("2026-05-20T00:00:00.000Z");
  });

  it("rejects invalid formats", () => {
    expect(() => parseDateInput("20-05-2026")).toThrowError(
      /yyyy-mm-dd format/i,
    );
  });

  it("rejects impossible calendar dates", () => {
    expect(() => parseDateInput("2026-02-30")).toThrowError(
      /valid calendar date/i,
    );
  });
});
