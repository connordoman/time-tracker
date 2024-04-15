import { v4 as uuidv4 } from "uuid";
import type { PunchCardData, PunchCardInterval, Timesheet, TimesheetSettings } from "./time";
import { defaultSettings } from "./time";

export default class TimeTracker implements Timesheet {
    public static SECOND_INTERVAL: number = 1; // seconds

    private _settings: TimesheetSettings;
    private _punchCards: PunchCardData[];

    constructor(settings: TimesheetSettings = defaultSettings) {
        this._settings = settings;
        this._punchCards = [];
    }

    loadPunchCards(punchCards: PunchCardData[]) {
        this._punchCards = punchCards;
    }

    addPunchCard(memo: string = "", notes: string = "") {
        const id: string = uuidv4();
        this._punchCards.push({
            uuid: id,
            memo,
            notes,
            workPeriods: [],
            createdAt: this.nowRounded(),
        });
        return id;
    }

    deletePunchCard(id: string) {
        this._punchCards = this._punchCards.filter((card) => card.uuid !== id);
    }

    updatePunchCard(id: string, data: Partial<PunchCardData>) {
        const card = this._punchCards.find((card) => card.uuid === id);
        if (card) {
            Object.assign(card, data);
        }
    }

    deleteIntervalAt(uuid: string, index: number) {
        console.log("Deleting interval ", index, " at:", uuid);
        const card = this.getPunchCards().find((card) => (card.uuid = uuid));
        if (card) {
            if (card.workPeriods.length - 1 < index) {
                console.log("No work periods");
                return;
            }
            const newWorkPeriods = card.workPeriods.toSpliced(index, 1);
            console.log({ oldWorkPeriods: card.workPeriods, newWorkPeriods });
            card.workPeriods = newWorkPeriods;
            return;
        }
        console.log("Did not find card");
    }

    punchIn(id: string) {
        const card = this.getPunchCard(id);
        if (!card) {
            console.log("No card with id: ", id);
            return false;
        }

        const lastWorkPeriod = this.getLastWorkPeriod(card);
        if (lastWorkPeriod && !lastWorkPeriod.endTimeSeconds) {
            console.log("Unable to punch in: ", lastWorkPeriod);
            return false;
        }

        const nextWorkPeriod: PunchCardInterval = {
            startTimeSeconds: this.nowRounded(),
            endTimeSeconds: 0,
        };

        const newWorkPeriods = [...card.workPeriods, nextWorkPeriod];

        this.updatePunchCard(id, { workPeriods: newWorkPeriods });

        return true;
    }

    punchOut(id: string) {
        const card = this.getPunchCard(id);
        if (!card) {
            console.log("No card with id: ", id);
            return false;
        }

        const lastWorkPeriod = this.getLastWorkPeriod(card);
        if (!lastWorkPeriod || lastWorkPeriod.endTimeSeconds) {
            console.log("Unable to punch out: ", lastWorkPeriod);
            return false;
        }

        const newWorkPeriods = card.workPeriods;
        newWorkPeriods[newWorkPeriods.length - 1].endTimeSeconds = this.nowRounded();

        this.updatePunchCard(id, { workPeriods: newWorkPeriods });

        return true;
    }

    getLastWorkPeriod(card: PunchCardData | undefined) {
        if (card) {
            return card.workPeriods[card.workPeriods.length - 1];
        }
        return undefined;
    }

    longestCard() {
        return this._punchCards.reduce((longest, card) => {
            return card.workPeriods.length > longest.workPeriods.length ? card : longest;
        });
    }

    longestCardLength() {
        return this.longestCard().workPeriods.length;
    }

    longestCardTotal() {
        return this.longestCard().workPeriods.reduce((total, period) => {
            return total + (period.endTimeSeconds - period.startTimeSeconds);
        }, 0);
    }

    toJSON(pretty?: boolean) {
        return JSON.stringify(
            {
                settings: this._settings,
                punchCards: this._punchCards,
            },
            undefined,
            pretty ? 2 : undefined
        );
    }

    numWorkPeriods(uuid: string): number {
        return this.getPunchCard(uuid)?.workPeriods.length ?? 0;
    }

    getPunchCards() {
        return this._punchCards;
    }

    getPunchCard(uuid: string) {
        return this._punchCards.find((p) => p.uuid === uuid);
    }

    getSettings() {
        return this._settings;
    }

    getTimeInTimezone(seconds: number) {
        return timeInTimezone(seconds, this._settings);
    }

    getCreatedDate(punchCard: PunchCardData) {
        return this.getTimeInTimezone(punchCard.createdAt);
    }

    getPunchCreationDate(uuid: string) {
        return this.getTimeInTimezone(this.getPunchCard(uuid)?.createdAt ?? 0);
    }

    getIntervalString(interval: PunchCardInterval) {
        const start = this.getTimeInTimezone(interval.startTimeSeconds);
        const end = interval.endTimeSeconds ? this.getTimeInTimezone(interval.endTimeSeconds) : "In Progress";
        return `${start} - ${end}`;
    }

    getWorkPeriods(uuid: string): PunchCardInterval[] {
        return this.getPunchCard(uuid)?.workPeriods ?? [];
    }

    get settings() {
        return this._settings;
    }

    get punchCards() {
        return this._punchCards;
    }

    private nowRounded() {
        return this.roundTime(Date.now() / 1000);
    }

    private roundTime(seconds: number) {
        if (this._settings.roundToSeconds === 0) return Math.round(seconds);

        return Math.round(seconds / this._settings.roundToSeconds) * this._settings.roundToSeconds;
    }

    public static demoTimeTracker() {
        const timeTracker = new TimeTracker();

        const id1 = timeTracker.addPunchCard("Sample one", "This is a sample card.");
        const id2 = timeTracker.addPunchCard("Sample two", "This is another sample card.");
        const id3 = timeTracker.addPunchCard("Sample three", "This is a third sample card.");

        for (let i = 0; i < 5; i++) {
            timeTracker.punchIn(id1);
            timeTracker.punchOut(id1);
        }
        for (let i = 0; i < 4; i++) {
            timeTracker.punchIn(id2);
            timeTracker.punchOut(id2);
        }

        if (timeTracker.punchIn(id3)) {
            console.log("Punching out...");
            timeTracker.punchOut(id3);
        }

        return timeTracker;
    }
}

export function timeInTimezone(seconds: number, settings: TimesheetSettings = defaultSettings) {
    return new Date(seconds * 1000).toLocaleTimeString("en-US", {
        timeZone: settings.timezone,
        hour12: !settings.use24HourTime,
    });
}

export function now(settings: TimesheetSettings = defaultSettings) {
    const time = Date.now() / 1000;
    if (settings.roundToSeconds === 0) return Math.round(time);

    return Math.round(time / settings.roundToSeconds) * settings.roundToSeconds;
}

export function duration(interval: PunchCardInterval, settings: TimesheetSettings = defaultSettings): number {
    const diff = interval.endTimeSeconds - interval.startTimeSeconds;
    if (diff < 0) {
        return now(settings) - interval.startTimeSeconds;
    }
    return interval.endTimeSeconds - interval.startTimeSeconds;
}

export function hhMMSS(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}

export function timeSinceHHMMSS(startTime: number, settings: TimesheetSettings = defaultSettings) {
    return hhMMSS(now(settings) - startTime);
}

export function totalDuration(punchCardData: PunchCardData): number {
    return punchCardData.workPeriods
        .map((interval) => duration(interval))
        .reduce((sum, duration) => {
            return sum + duration;
        }, 0);
}

export function sumWorkPeriods(workPeriods: PunchCardInterval[]): number {
    return workPeriods
        .map((period) => duration(period))
        .reduce((sum, duration) => {
            return sum + duration;
        }, 0);
}

export function readFromLocalStorage(key: string = "time-tracker"): TimeTracker {
    if (typeof window !== undefined) {
        const timesheetJSON = window.localStorage.getItem(key);

        if (!timesheetJSON) {
            return new TimeTracker();
        }

        const timesheet: Timesheet = JSON.parse(timesheetJSON);
        const timeTracker = new TimeTracker(timesheet.settings);
        timeTracker.loadPunchCards(timesheet.punchCards);

        return timeTracker;
    } else {
        console.log("Window is not defined: skipping read from localStorage.");
    }
    return new TimeTracker();
}

export function getTimeTrackerFromLocalStorage(): TimeTracker {
    const timesheet = readFromLocalStorage();
    const tracker = new TimeTracker(timesheet.settings);
    tracker.loadPunchCards(timesheet.punchCards);
    return tracker;
}

export function saveToLocalStorage(data: string, key: string = "time-tracker"): boolean {
    if (typeof window !== undefined) {
        window.localStorage.setItem(key, data);
        return true;
    } else {
        console.log("Window is not defined: skipping write to localStorage.");
    }
    return false;
}

export function saveTimesheetToLocalStorage(timesheet: Timesheet, key: string = "time-tracker") {
    saveToLocalStorage(JSON.stringify(timesheet), key);
}

export function saveTimeTrackerToLocalStorage(timeTracker: TimeTracker, key: string = "time-tracker") {
    saveToLocalStorage(timeTracker.toJSON(), key);
}
