export interface TimesheetSettings {
    timezone: string;
    use24HourTime: boolean;
    roundToSeconds: number;
}

export interface PunchCardInterval {
    startTimeSeconds: number;
    endTimeSeconds: number;
}

export interface PunchCard {
    memo: string;
    notes: string;
    workPeriods: PunchCardInterval[];
    createdAt: number;
}
