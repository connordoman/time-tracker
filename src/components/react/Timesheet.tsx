import React, { useState } from "react";
import {
    type TimesheetSettings,
    type PunchCardData,
    defaultSettings,
} from "../../lib/time";
import PunchCard from "./PunchCard";
import TimeTracker from "../../lib/timetracker";
import defaultTimeTracker from "../../lib/client/defaultTimetracker.json";

interface TimesheetProps {
    settings?: TimesheetSettings;
    punchCards?: PunchCardData[];
}

export default function Timesheet({
    settings = defaultSettings,
    punchCards = [],
}: TimesheetProps) {
    // const timeTracker = new TimeTracker(defaultTimeTracker.settings);
    // timeTracker.loadPunchCards(defaultTimeTracker.punchCards);

    const [timeTracker, setTimeTracker] = useState(
        TimeTracker.demoTimeTracker(),
    );

    return (
        <div
            id="timesheet"
            className="flex flex-col gap-2 w-11/12 max-w-terminal"
        >
            <header>
                <h2 className="text-3xl font-bold text-center">Timesheet</h2>
            </header>
            <main className="flex flex-col gap-4">
                {timeTracker.getPunchCards().map((card) => {
                    return (
                        <PunchCard
                            key={card.uuid}
                            settings={timeTracker.getSettings()}
                            punchCard={card}
                            onMemoUpdate={(v: string) =>
                                timeTracker.updatePunchCard(card.uuid, {
                                    memo: v,
                                })
                            }
                            onNotesUpdate={(v: string) =>
                                timeTracker.updatePunchCard(card.uuid, {
                                    notes: v,
                                })
                            }
                            onStart={() => timeTracker.punchIn(card.uuid)}
                            onStop={() => timeTracker.punchOut(card.uuid)}
                            onDelete={(id: number) =>
                                timeTracker.deleteIntervalAt(card.uuid, id)
                            }
                        />
                    );
                })}
            </main>
            <footer></footer>
        </div>
    );
}
