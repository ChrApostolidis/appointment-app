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
  monday: { start: "9:00", end: "17:00", enabled: false },
  tuesday: { start: "9:00", end: "17:00", enabled: false },
  wednesday: { start: "9:00", end: "17:00", enabled: false },
  thursday: { start: "9:00", end: "17:00", enabled: false },
  friday: { start: "9:00", end: "15:00", enabled: false },
  saturday: { start: "Closed", end: "Closed", enabled: false },
  sunday: { start: "Closed", end: "Closed", enabled: false },
};



export const dayNames: DayNames = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const orderedDayNames = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]