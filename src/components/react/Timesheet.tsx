import React from "react";
import { type TimesheetSettings, type PunchCardData, defaultSettings } from "../../lib/time";
import PunchCard from "./PunchCard";
import TimeTracker from "../../lib/timetracker";
import defaultTimeTracker from "../../lib/client/defaultTimetracker.json";

interface TimesheetProps {
    settings?: TimesheetSettings;
    punchCards?: PunchCardData[];
}

export default function Timesheet({settings = defaultSettings, punchCards = []}: TimesheetProps) {
    // const timeTracker = TimeTracker.demoTimeTracker();
    const timeTracker = new TimeTracker(defaultTimeTracker.settings);
    timeTracker.loadPunchCards(defaultTimeTracker.punchCards);
    return <div id="timesheet" className="flex flex-col gap-2 w-11/12 max-w-terminal">
        <header>
            <h2 className="text-3xl font-bold text-center">Timesheet</h2>
        </header>
        <main className="flex flex-col gap-4">
            {timeTracker.getPunchCards().map((card) => {
                return <PunchCard key={card.uuid} punchCard={card}/>;
            })}
        </main>
        <footer>

        </footer>
    </div>
}