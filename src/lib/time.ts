export interface TimesheetSettings {
  timezone: string;
  use24HourTime: boolean;
  roundToSeconds: number;
}

export interface PunchCardInterval {
  startTimeSeconds: number;
  endTimeSeconds: number;
}

export interface PunchCardData {
  uuid: string;
  memo: string;
  notes: string;
  workPeriods: PunchCardInterval[];
  createdAt: number;
}

export const defaultSettings: TimesheetSettings = {
  timezone: "America/Los_Angeles",
  use24HourTime: true,
  roundToSeconds: 0,
};
