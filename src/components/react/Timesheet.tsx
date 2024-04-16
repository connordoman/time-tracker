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
    const [currentTotal, setCurrentTotal] = useState(currentTimeTracker.totalSeconds);
    const [isLoading, setLoading] = useState(true);
    const [isUnsaved, setUnsaved] = useState(false);

    useEffect(() => {
        const savedTimeTracker = readFromLocalStorage();
        trackerRef.current = savedTimeTracker;
        setCurrentTimeTracker(savedTimeTracker);
        setLoading(false);
    }, []);

    useEffect(() => {
        setCurrentTotal(currentTimeTracker.totalSeconds);
    }, [currentTimeTracker, currentTimeTracker.punchCards]);

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
        setCurrentTotal(currentTimeTracker.totalSeconds);
    };

    return (
        <>
            <TimesheetNavbar totalSeconds={currentTotal} />
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
                        setUnsaved(false);
                    }}
                    onDownload={() => {
                        console.log(currentTimeTracker.toJSON(true));
                        console.log("TOTAL: " + currentTotal);
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
            <footer className="w-full px-8 py-4 h-48 flex flex-row items-start justify-start gap-4">
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
