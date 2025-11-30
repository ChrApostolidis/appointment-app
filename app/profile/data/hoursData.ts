export type WorkingHours = {
  [key: string]: {
    start: string;
    end: string;
    enabled: boolean;
  };
};

type DayNames = {
  [key: string]: string;
};

export const workingHoursData: WorkingHours = {
  Monday: { start: "9:00", end: "17:00", enabled: false },
  Tuesday: { start: "9:00", end: "17:00", enabled: false },
  Wednesday: { start: "9:00", end: "17:00", enabled: false },
  Thursday: { start: "9:00", end: "17:00", enabled: false },
  Friday: { start: "9:00", end: "15:00", enabled: false },
  Saturday: { start: "Closed", end: "Closed", enabled: false },
  Sunday: { start: "Closed", end: "Closed", enabled: false },
};

export const dayNames: DayNames = {
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday",
};