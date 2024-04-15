import React, { useRef, useState } from "react";
import { type TimesheetSettings, type PunchCardData, defaultSettings } from "../../lib/time";
import PunchCard from "./PunchCard";
import TimeTracker from "../../lib/timetracker";
import defaultTimeTracker from "../../lib/client/defaultTimetracker.json";
import { NextUIProvider } from "@nextui-org/react";

export const prerender = false;

interface TimesheetProps {
    settings?: TimesheetSettings;
    punchCards?: PunchCardData[];
}

export default function Timesheet({ settings = defaultSettings, punchCards = [] }: TimesheetProps) {
    const { current: timeTracker } = useRef(TimeTracker.demoTimeTracker());

    return (
        <div id="timesheet" className="flex flex-col gap-2 w-11/12 max-w-terminal">
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
                            timeTracker={timeTracker}
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
                            onDelete={(id: number) => {
                                console.log(timeTracker.numWorkPeriods(card.uuid));
                                timeTracker.deleteIntervalAt(card.uuid, id);
                                console.log(timeTracker.numWorkPeriods(card.uuid));
                            }}
                        />
                    );
                })}
            </main>
            <footer></footer>
        </div>
    );
}
