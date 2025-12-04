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