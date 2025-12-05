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
  monday: { start: "Closed", end: "Closed", enabled: false },
  tuesday: { start: "Closed", end: "Closed", enabled: false },
  wednesday: { start: "Closed", end: "Closed", enabled: false },
  thursday: { start: "Closed", end: "Closed", enabled: false },
  friday: { start: "Closed", end: "Closed", enabled: false },
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