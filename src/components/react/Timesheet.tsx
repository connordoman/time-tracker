import { useEffect, useRef, useState } from "react";
import { type TimesheetSettings, type PunchCardData, defaultSettings, type Timesheet } from "../../lib/time";
import PunchCard from "./PunchCard";
import TimeTracker, {
    getTimeTrackerFromLocalStorage,
    readFromLocalStorage,
    saveTimeTrackerToLocalStorage,
} from "../../lib/timetracker";
import { CircularProgress, Link } from "@nextui-org/react";
import TimesheetActionButtons from "./TimesheetActionButtons";

export const prerender = false;

interface TimesheetProps {}

export default function Timesheet({}: TimesheetProps) {
    const trackerRef = useRef<TimeTracker>(new TimeTracker());
    const { current: timeTracker } = trackerRef;

    const [currentTimeTracker, setCurrentTimeTracker] = useState<TimeTracker>(timeTracker);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const savedTimeTracker = readFromLocalStorage();
        setCurrentTimeTracker(savedTimeTracker);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (currentTimeTracker) trackerRef.current = currentTimeTracker;
    }, [currentTimeTracker]);

    return (
        <div id="timesheet" className="flex flex-col gap-2 w-11/12 max-w-terminal">
            <header className="h-16 flex flex-row items-center justify-center gap-4">
                <h2 className="text-3xl font-bold text-center">Timesheet</h2>
            </header>
            <main className="flex flex-col gap-4">
                <TimesheetActionButtons
                    onAdd={() => {
                        setCurrentTimeTracker((prev) => {
                            const newTimeTracker = new TimeTracker(prev.settings);
                            newTimeTracker.loadPunchCards(prev.punchCards);
                            newTimeTracker.addPunchCard("");
                            return newTimeTracker;
                        });
                    }}
                    onShare={() => {}}
                    onSave={() => {
                        saveTimeTrackerToLocalStorage(currentTimeTracker);
                    }}
                    onDownload={() => {
                        console.log(currentTimeTracker.toJSON(true));
                    }}
                />
                {isLoading ? (
                    <CircularProgress className="mx-auto" aria-label="Loading..." />
                ) : (
                    currentTimeTracker.getPunchCards().map((card, index) => {
                        return (
                            <PunchCard
                                key={card.uuid}
                                cardIndex={index}
                                cardId={card.uuid}
                                timeTracker={currentTimeTracker}
                                onPunchDelete={(cardId) => {
                                    setCurrentTimeTracker((prev) => {
                                        const timeTracker = new TimeTracker(prev.settings);
                                        timeTracker.loadPunchCards(prev.punchCards);
                                        timeTracker.deletePunchCard(cardId);
                                        return timeTracker;
                                    });
                                }}
                            />
                        );
                    })
                )}
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
