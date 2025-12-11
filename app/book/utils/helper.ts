export function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy; // return a new date object with added days as the number of days
}

export function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function addMinutes(date: Date, minutes: number) {
  const copy = new Date(date);
  copy.setMinutes(copy.getMinutes() + minutes);
  return copy;
}

export function buildDayWindow(
  day: Date,
  entry: { start: string; end: string }
) {
  const [startHour, startMinute] = entry.start.split(":").map(Number);
  const [endHour, endMinute] = entry.end.split(":").map(Number);

  const start = new Date(day);
  start.setHours(startHour, startMinute, 0, 0);

  const end = new Date(day);
  end.setHours(endHour, endMinute, 0, 0);

  return { start, end };
}

export function overlaps(
  slotStart: Date,
  slotEnd: Date,
  booking: { startAt: Date; endAt: Date }
) {
  return slotStart < booking.endAt && slotEnd > booking.startAt;
}

export const formatTime = (iso: Date) =>
  new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const WEEKDAY_MAP: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export function weekdayIndex(day: string) {
  return WEEKDAY_MAP[day.toLowerCase()];
}
