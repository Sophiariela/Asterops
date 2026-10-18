// Minimal timezone helpers used by the appointment availability engine.
// No tz library is a dependency of this project, so these use the
// standard "format in target zone, then correct by the discovered
// offset" technique (the same approach date-fns-tz/luxon use internally)
// instead of pulling in a new package for a handful of conversions.

function partsInTz(date: Date, timeZone: string): Record<string, string> {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  return dtf.formatToParts(date).reduce<Record<string, string>>((acc, p) => {
    if (p.type !== 'literal') acc[p.type] = p.value;
    return acc;
  }, {});
}

// The day of the week (0=Sunday..6=Saturday) that `date` falls on when
// viewed in `timeZone` — not necessarily the same as date.getUTCDay().
export function dayOfWeekInTz(date: Date, timeZone: string): number {
  const p = partsInTz(date, timeZone);
  return new Date(Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day))).getUTCDay();
}

// "HH:mm" wall-clock time that `date` displays as in `timeZone`.
export function timeOfDayInTz(date: Date, timeZone: string): string {
  const p = partsInTz(date, timeZone);
  return `${p.hour}:${p.minute}`;
}

// "YYYY-MM-DD" calendar date that `date` falls on in `timeZone`.
export function localDateStringInTz(date: Date, timeZone: string): string {
  const p = partsInTz(date, timeZone);
  return `${p.year}-${p.month}-${p.day}`;
}

function tzOffsetMs(date: Date, timeZone: string): number {
  const p = partsInTz(date, timeZone);
  const asUtc = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), Number(p.second));
  return asUtc - date.getTime();
}

// Converts a wall-clock "YYYY-MM-DD" + "HH:mm" reading in `timeZone` into
// the real UTC instant it represents. Accurate outside of the literal
// hour of a DST transition, which is a fine tradeoff for business-hours
// scheduling.
export function zonedTimeToUtc(dateStr: string, timeStr: string, timeZone: string): Date {
  const naive = new Date(`${dateStr}T${timeStr}:00.000Z`);
  const offset = tzOffsetMs(naive, timeZone);
  return new Date(naive.getTime() - offset);
}
