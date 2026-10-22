/**
 * Calendar dates as ISO `YYYY-MM-DD` strings, the same format as a native date input's value. They
 * carry no time or time zone, so a date never shifts by a day, and they sort and compare as plain
 * strings. The math runs on UTC midnights, which have no daylight-saving gaps.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function toUTC(date: string) {
  const [year, month, day] = date.split("-").map(Number) as [number, number, number];
  const utc = new Date(0);
  // setUTCFullYear, unlike Date.UTC, doesn't map years 0–99 onto the 1900s.
  utc.setUTCFullYear(year, month - 1, day);
  return utc;
}

function fromUTC(utc: Date) {
  const year = String(utc.getUTCFullYear()).padStart(4, "0");
  const month = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utc.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Whether a string is a real calendar date in `YYYY-MM-DD` form (so not `2026-02-30`). */
export function isCalendarDate(value: string) {
  return ISO_DATE.test(value) && fromUTC(toUTC(value)) === value;
}

/** Today's date in the user's time zone. */
export function today() {
  const now = new Date();
  return fromUTC(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
}

export function addDays(date: string, days: number) {
  const utc = toUTC(date);
  utc.setUTCDate(utc.getUTCDate() + days);
  return fromUTC(utc);
}

/** Moves by whole months, keeping the day of the month where it exists: Jan 31 plus a month is Feb 28 (or 29). */
export function addMonths(date: string, months: number) {
  const utc = toUTC(date);
  const day = utc.getUTCDate();
  utc.setUTCDate(1);
  utc.setUTCMonth(utc.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth() + 1, 0)).getUTCDate();
  utc.setUTCDate(Math.min(day, lastDay));
  return fromUTC(utc);
}

/** The first day of a date's month. */
export function startOfMonth(date: string) {
  return `${date.slice(0, 7)}-01`;
}

/** Whether two dates fall in the same month of the same year. */
export function isSameMonth(a: string, b: string) {
  return a.slice(0, 7) === b.slice(0, 7);
}

/** The day of the week, from 0 (Sunday) to 6 (Saturday). */
export function dayOfWeek(date: string) {
  return toUTC(date).getUTCDay();
}

/** Keeps a date within `min` and `max`, either of which may be left out. */
export function clampDate(date: string, min?: string, max?: string) {
  if (min && date < min) return min;
  if (max && date > max) return max;
  return date;
}

/**
 * How far a range anchored on `anchor` can reach each way without taking in a date `isUnavailable`
 * rules out: the dates either side of the nearest unavailable ones, within `min` and `max`. Each
 * way stops looking after `limit` days (ten years) and reaches as far as `min` or `max` allows.
 */
export function getReachableSpan(
  anchor: string,
  isUnavailable: (date: string) => boolean,
  min: string | undefined,
  max: string | undefined,
  limit = 3660,
) {
  function reach(step: 1 | -1, bound: string | undefined) {
    let date = anchor;
    for (let days = 0; days < limit; days++) {
      if (date === bound) return bound;
      const next = addDays(date, step);
      if (isUnavailable(next)) return date;
      date = next;
    }
    return bound;
  }
  return { min: reach(-1, min), max: reach(1, max) };
}

/**
 * The month containing `date` as six weeks of seven days, each week starting on `weekStartsOn`
 * (0 for Sunday). Days outside the month are null. Always six weeks, so the grid keeps its height
 * from month to month.
 */
export function getMonthWeeks(date: string, weekStartsOn: number) {
  const first = startOfMonth(date);
  const lead = (dayOfWeek(first) - weekStartsOn + 7) % 7;
  const start = addDays(first, -lead);
  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => {
      const day = addDays(start, week * 7 + weekday);
      return isSameMonth(day, first) ? day : null;
    }),
  );
}

/** Formats a date in a locale, as written on that day everywhere: the formatter runs in UTC, as the math does. */
export function formatDate(date: string, locale: string | undefined, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).format(toUTC(date));
}

/** Formats a range in a locale, sharing what the two ends have in common: "Mar 14 – 20, 2026". */
export function formatDateRange(start: string, end: string, locale: string | undefined, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).formatRange(toUTC(start), toUTC(end));
}

// The numeric form a text field shows and reads. Latin digits, so what's shown can be typed back.
const FIELD_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  numberingSystem: "latn",
  timeZone: "UTC",
};

type DatePart = "year" | "month" | "day";

function fieldParts(locale: string | undefined) {
  return new Intl.DateTimeFormat(locale, FIELD_FORMAT).formatToParts(toUTC("2026-11-23"));
}

/** A date as a text field shows it: the locale's numeric form, like 03/14/2026 or 14.03.2026. */
export function formatDateField(date: string, locale: string | undefined) {
  return new Intl.DateTimeFormat(locale, FIELD_FORMAT).format(toUTC(date));
}

/** The locale's numeric form spelled out, like mm/dd/yyyy or dd.mm.yyyy, for a text field's placeholder. */
export function getDateFieldPattern(locale: string | undefined) {
  const letters: Record<string, string> = { year: "yyyy", month: "mm", day: "dd" };
  return fieldParts(locale)
    .map((part) => letters[part.type] ?? part.value)
    .join("");
}

/**
 * Reads a typed date: an ISO `YYYY-MM-DD` date, or three numbers in the locale's order with
 * anything between them, so 3/14/2026, 03-14-2026 and 03.14.26 all read in en-US. Two-digit years
 * are in the 2000s. Returns null for anything that isn't a real date.
 */
export function parseDateField(text: string, locale: string | undefined) {
  const trimmed = text.trim();
  if (isCalendarDate(trimmed)) return trimmed;
  const numbers = trimmed.match(/\d+/g);
  if (numbers?.length !== 3) return null;
  const order = fieldParts(locale)
    .map((part) => part.type)
    .filter((type): type is DatePart => type === "year" || type === "month" || type === "day");
  const parts: Partial<Record<DatePart, string>> = {};
  order.forEach((type, index) => (parts[type] = numbers[index]));
  const { year = "", month = "", day = "" } = parts;
  if (month.length > 2 || day.length > 2 || (year.length !== 2 && year.length !== 4)) return null;
  const date = `${year.length === 2 ? `20${year}` : year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return isCalendarDate(date) ? date : null;
}

// Intl.Locale's week info isn't in TypeScript's lib yet, and is a getter in older browsers.
interface LocaleWithWeekInfo extends Intl.Locale {
  getWeekInfo?: () => { firstDay: number };
  weekInfo?: { firstDay: number };
}

/** The day a locale's weeks start on, from 0 (Sunday) to 6 (Saturday). Sunday where the browser can't say. */
export function getWeekStart(locale: string | undefined) {
  try {
    const resolved = new Intl.DateTimeFormat(locale).resolvedOptions().locale;
    const info = new Intl.Locale(resolved) as LocaleWithWeekInfo;
    const firstDay = (info.getWeekInfo?.() ?? info.weekInfo)?.firstDay;
    // Intl numbers the days from 1 (Monday) to 7 (Sunday).
    if (firstDay !== undefined) return firstDay % 7;
  } catch {
    // An invalid locale falls through to the default, as Intl.DateTimeFormat would.
  }
  return 0;
}
