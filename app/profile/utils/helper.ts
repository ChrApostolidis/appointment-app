import { StoredWeeklyHours } from "@/drizzle/schema";
import { NormalizedHourRow } from "../schema";

export function rowsToWeeklyHours(rows: NormalizedHourRow[]): StoredWeeklyHours {
  return rows.reduce<StoredWeeklyHours>((acc, row) => {
    acc[row.day] = {
      start: row.start,
      end: row.end,
      enabled: row.enabled,
    };
    return acc;
  }, {} as StoredWeeklyHours);
}

export const timeOptions = Array.from({ length: 16 }, (_, i) => {
    const hour = (i + 6).toString().padStart(2, "0");
    return `${hour}:00`;
  });