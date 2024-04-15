import { useRef } from "react";
import { type TimesheetSettings, type PunchCardData, defaultSettings } from "../../lib/time";
import PunchCard from "./PunchCard";
import TimeTracker from "../../lib/timetracker";
import { Link } from "@nextui-org/react";
import FloatingActionButtons from "./FloatingActionButtons";

export const prerender = false;

interface TimesheetProps {
    settings?: TimesheetSettings;
    punchCards?: PunchCardData[];
}

export default function Timesheet({ settings = defaultSettings, punchCards = [] }: TimesheetProps) {
    const { current: timeTracker } = useRef(TimeTracker.demoTimeTracker());

    return (
        <div id="timesheet" className="flex flex-col gap-2 w-11/12 max-w-terminal">
            <header className="h-16 flex flex-row items-center justify-center gap-4">
                <h2 className="text-3xl font-bold text-center">Timesheet</h2>
            </header>
            <main className="flex flex-col gap-4">
                <FloatingActionButtons />
                {timeTracker.getPunchCards().map((card) => {
                    return <PunchCard key={card.uuid} cardId={card.uuid} timeTracker={timeTracker} />;
                })}
            </main>
            <footer className="h-16 flex flex-row items-center justify-start gap-4">
                <Link href="https://connordoman.dev" showAnchorIcon isExternal>
                    My Website
                </Link>
                <Link href="https://connordoman.dev" showAnchorIcon isExternal>
                    My GitHub
                </Link>
            </footer>
        </div>
    );
}
