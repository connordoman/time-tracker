import { v4 as uuidv4 } from "uuid";
import type { PunchCardData, PunchCardInterval, TimesheetSettings } from "./time";
import { defaultSettings } from "./time";

export default class TimeTracker {
    private settings: TimesheetSettings;
    private punchCards: PunchCardData[] = [];

    constructor(settings: TimesheetSettings = defaultSettings) {
        this.settings = settings;
    }

    loadPunchCards(punchCards: PunchCardData[]) {
        this.punchCards = punchCards;
    }

    addPunchCard(memo: string = "", notes: string = "") {
        const id: string = uuidv4();
        this.punchCards.push({
            uuid: id,
            memo,
            notes,
            workPeriods: [],
            createdAt: this.nowRounded(),
        });
        return id;
    }

    deletePunchCard(id: string) {
        this.punchCards = this.punchCards.filter((card) => card.uuid !== id);
    }

    updatePunchCard(id: string, data: Partial<PunchCardData>) {
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

        const nextWorkPeriod: PunchCardInterval = {
            startTimeSeconds: this.nowRounded(),
            endTimeSeconds: 0,
        };
        
        card.workPeriods.push(nextWorkPeriod);
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

    getLastWorkPeriod(card: PunchCardData | undefined) {
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

    getPunchCards() {
        return this.punchCards;
    }



    private nowRounded() {
        return this.roundTime(Date.now() / 1000);
    }
    
    private roundTime(seconds: number) {
        return Math.round(seconds / this.settings.roundToSeconds) * this.settings.roundToSeconds;
    }

    public static demoTimeTracker() {
        const timeTracker = new TimeTracker();
        const id1 = timeTracker.addPunchCard("Sample one", "This is a sample card.");
        const id2 = timeTracker.addPunchCard("Sample two", "This is another sample card.");

        timeTracker.punchIn(id1);

        for (let i = 0; i < 4; i++) {
            timeTracker.punchIn(id2);
            timeTracker.punchOut(id2);
        }
        for (let i = 0; i < 5; i++) {
            timeTracker.punchIn(id1);
            timeTracker.punchOut(id1);
        }

        return timeTracker;
    }
}
