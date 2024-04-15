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
import TimesheetNavbar from "./TimesheetNavbar";

export const prerender = false;

interface TimesheetProps {}

export default function Timesheet({}: TimesheetProps) {
    const trackerRef = useRef<TimeTracker>(new TimeTracker());

    const [currentTimeTracker, setCurrentTimeTracker] = useState<TimeTracker>(trackerRef.current);
    const [isLoading, setLoading] = useState(true);
    const [isUnsaved, setUnsaved] = useState(false);

    useEffect(() => {
        const savedTimeTracker = readFromLocalStorage();
        trackerRef.current = savedTimeTracker;
        setCurrentTimeTracker(savedTimeTracker);
        setLoading(false);
    }, []);

    const checkUnsaved = () => {
        if (currentTimeTracker && trackerRef.current) {
            if (currentTimeTracker.toJSON() !== trackerRef.current.toJSON()) {
                return true;
            }
        }
        return false;
    };

    const handleChange = () => {
        setUnsaved(checkUnsaved());
    };

    return (
        <>
            <TimesheetNavbar totalSeconds={currentTimeTracker.totalSeconds} />
            <main className="flex flex-col gap-4 w-11/12 max-w-terminal py-4">
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
                        trackerRef.current = currentTimeTracker;
                    }}
                    onDownload={() => {
                        console.log(currentTimeTracker.toJSON(true));
                    }}
                    unsaved={isUnsaved}
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
                                onChange={handleChange}
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
        </>
    );
}
