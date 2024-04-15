import React, { memo, useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Input,
    ButtonGroup,
    Divider,
    Accordion,
    AccordionItem,
    Snippet,
    useDisclosure,
    Tooltip,
} from "@nextui-org/react";
import { type TimesheetSettings, type PunchCardData } from "../../lib/time";
import TimeTracker, { hhMMSS, sumWorkPeriods } from "../../lib/timetracker";
import { RiPlayFill, RiStopFill } from "react-icons/ri";
import { useTimer } from "src/hooks/time";
import PunchCardNotesModal from "./PunchCardNotesModal";
import Blockquote from "./Blockquote";
import PunchCardTimetable from "./PunchCardTimetable";

export const prerender = false;

interface PunchCardProps {
    timeTracker: TimeTracker;
    cardId: string;
}

export default function PunchCard({ timeTracker, cardId }: PunchCardProps) {
    const [punchCard, setPunchCard] = useState(timeTracker.getPunchCard(cardId));
    const [workPeriods, setWorkPeriods] = useState(punchCard?.workPeriods ?? []);
    const [memo, setMemo] = useState(punchCard?.memo ?? "");
    const [notes, setNotes] = useState(punchCard?.notes ?? "");

    const [currentTotal, setCurrentTotal] = useState(sumWorkPeriods(workPeriods));

    const { seconds, isLoading, isPlaying, setPlaying, resetTime } = useTimer({ startTimeSeconds: 0, use24Hour: true });

    useEffect(() => {
        if (!isPlaying) {
            setCurrentTotal(sumWorkPeriods(workPeriods));
        }
    }, [isPlaying, workPeriods]);

    const handleMemoUpdate = (memo: string) => {
        timeTracker.updatePunchCard(cardId, { memo });
    };

    const handleNotesUpdate = (notes: string) => {
        timeTracker.updatePunchCard(cardId, { notes });
    };

    const handleStart = () => {
        setPlaying(true);

        timeTracker.punchIn(cardId);
    };

    const handleStop = () => {
        setPlaying(false);
        resetTime();
        setCurrentTotal(sumWorkPeriods(workPeriods));

        timeTracker.punchOut(cardId);

        setWorkPeriods(timeTracker.getWorkPeriods(cardId));
    };

    const handleDelete = (id: number) => {
        const newWorkPeriods = workPeriods.toSpliced(id, 1);
        timeTracker.updatePunchCard(cardId, { workPeriods: newWorkPeriods });

        setWorkPeriods(newWorkPeriods);
    };

    return (
        <Card className="w-full">
            <CardHeader className="gap-2 flex-col">
                <Input label="Memo" placeholder={memo} value={memo} onValueChange={handleMemoUpdate} />
                <div className="w-full flex flex-row gap-2">
                    <Accordion variant="light" className="border-1 border-zinc-200 rounded-xl" isCompact>
                        <AccordionItem
                            key={`notes-${cardId}`}
                            aria-label={`Eidt notes for ${memo}`}
                            title={notes ? "View notes:" : "No notes added."}
                            className="px-0"
                            isDisabled={!notes}>
                            <Blockquote>{notes}</Blockquote>
                        </AccordionItem>
                    </Accordion>
                    <PunchCardNotesModal memo={memo} onNotesChange={handleNotesUpdate} notes={notes} />
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <PunchCardTimetable
                    uuid={cardId}
                    memo={memo}
                    punchCardCreatedAt={timeTracker.getPunchCreationDate(cardId)}
                    timeTracker={timeTracker}
                    isPlaying={isPlaying}
                    seconds={seconds}
                    handleDelete={(i) => {
                        console.log("Handling delete for " + i);
                        handleDelete(i);
                    }}
                />
            </CardBody>
            <Divider />
            <CardFooter className="gap-2 justify-between">
                <ButtonGroup>
                    <Tooltip content="Start recording time" delay={500}>
                        <Button
                            variant="flat"
                            color="success"
                            size="sm"
                            isDisabled={isPlaying}
                            disabled={isPlaying}
                            onPress={handleStart}>
                            <RiPlayFill />
                        </Button>
                    </Tooltip>
                    <Tooltip content="Stop recording time" delay={500}>
                        <Button
                            variant="flat"
                            color="primary"
                            size="sm"
                            isDisabled={!isPlaying}
                            disabled={!isPlaying}
                            onPress={handleStop}>
                            <RiStopFill />
                        </Button>
                    </Tooltip>
                </ButtonGroup>
                <span className="flex flex-row gap-2 items-center">
                    Total:
                    <Snippet
                        variant="flat"
                        color="primary"
                        size="sm"
                        tooltipProps={{ content: "Copy total time" }}
                        className="pl-3 py-0 font-normal rounded-full"
                        hideSymbol>
                        {hhMMSS(currentTotal)}
                    </Snippet>
                </span>
            </CardFooter>
        </Card>
    );
}
