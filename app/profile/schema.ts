import { z } from "zod";

const DAY_NAMES = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayName = (typeof DAY_NAMES)[number];

const CLOSED_VALUE = "Closed" as const;
const DISABLED_RANGE = { start: "00:00", end: "23:59" } as const;

const timeValueSchema = z
  .string()
  .regex(/^([01]?\d|2[0-3]):([0-5]\d)$/, "Use HH:MM in 24h format");

const timeOrClosedSchema = z.union([timeValueSchema, z.literal(CLOSED_VALUE)]);

export const DayEntrySchema = z.object({
  start: timeOrClosedSchema,
  end: timeOrClosedSchema,
  enabled: z.boolean().optional(),
});

export type DayEntry = z.infer<typeof DayEntrySchema>;

// creating the schema for the entire week dynamically
export const ClientHoursSchema = z.object(
  DAY_NAMES.reduce(
    (shape, day) => {
      shape[day] = DayEntrySchema;
      return shape;
    },
    {} as Record<DayName, typeof DayEntrySchema>
  )
);

export type ClientHours = z.infer<typeof ClientHoursSchema>;

export type NormalizedHourRow = {
  day: DayName;
  start: string;
  end: string;
  enabled: boolean;
};

// Validates input using Zod helper function
export function validateAndNormalizeHours(
  payload: unknown
): NormalizedHourRow[] {
  const safeParse = ClientHoursSchema.parse(payload);

  return DAY_NAMES.map((day) => {
    return {
      day,
      ...normalizeEntry(day, safeParse[day]),
    };
  });
}

// Handling individual day normalization to be called to validateAndNormalizeHours to become an array of NormalizedHourRow
function normalizeEntry(day: DayName, entry: DayEntry) {
  const disabled =
    entry.enabled === false ||
    entry.start === CLOSED_VALUE ||
    entry.end === CLOSED_VALUE;

  if (disabled) {
    return {
      ...DISABLED_RANGE,
      enabled: false,
    };
  }

  const start = pad(entry.start);
  const end = pad(entry.end);

  if (toMinutes(start) >= toMinutes(end)) {
    throw new Error(`Start time must be before end time for ${day}`);
  }

  return { start, end, enabled: true };
}

// Helper functions
function pad(value: string) {
  const [hours, minutes] = value.split(":");
  return `${hours.padStart(2, "0")}:${minutes}`;
}

function toMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export const updateCustomerProfileSchema = z.object({
  name: z.string().min(5, "Full name is required"),
  email: z.email("Invalid email address"),
  userId: z.string(),
});
