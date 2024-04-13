import { v4 as uuidv4 } from "uuid";
import type { PunchCard, TimesheetSettings } from "./time";
import { defaultSettings } from "./time";

export default class TimeTracker {
    private settings: TimesheetSettings;
    private punchCards: PunchCard[] = [];

    constructor(settings: TimesheetSettings = defaultSettings) {
        this.settings = settings;
    }

    addPunchCard() {
        const id: string = uuidv4();
        this.punchCards.push({
            uuid: id,
            memo: "",
            notes: "",
            workPeriods: [],
            createdAt: this.nowRounded(),
        });
        return id;
    }

    deletePunchCard(id: string) {
        this.punchCards = this.punchCards.filter((card) => card.uuid !== id);
    }

    updatePunchCard(id: string, data: Partial<PunchCard>) {
        const card = this.punchCards.find((card) => card.uuid === id);
        if (card) {
            Object.assign(card, data);
        }
    }

    punchIn(id: string) {
        const card = this.punchCards.find((card) => card.uuid === id);
        if (!card) {
            return false;
        }

        const lastWorkPeriod = this.getLastWorkPeriod(card);
        if (lastWorkPeriod && !lastWorkPeriod.endTimeSeconds) {
            return false;
        }

        card.workPeriods.push({
            startTimeSeconds: this.nowRounded(),
            endTimeSeconds: 0,
        });
        return true;
    }

    punchOut(id: string) {
        const card = this.punchCards.find((card) => card.uuid === id);
        if (!card) {
            return false;
        }

        const lastWorkPeriod = this.getLastWorkPeriod(card);
        if (!lastWorkPeriod || lastWorkPeriod.endTimeSeconds) {
            return false;
        }

        lastWorkPeriod.endTimeSeconds = this.nowRounded();
        return true;
    }

    getLastWorkPeriod(card: PunchCard | undefined) {
        if (card) {
            return card.workPeriods[card.workPeriods.length - 1];
        }
        return undefined;
    }

    longestCard() {
        return this.punchCards.reduce((longest, card) => {
            return card.workPeriods.length > longest.workPeriods.length ? card : longest;
        })
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
                settings: this.settings,
                punchCards: this.punchCards,
            },
            undefined,
            pretty ? 2 : undefined
        );
    }

    private nowRounded() {
        return this.roundTime(Date.now() / 1000);
    }
    
    private roundTime(seconds: number) {
        return Math.round(seconds / this.settings.roundToSeconds) * this.settings.roundToSeconds;
    }
}
