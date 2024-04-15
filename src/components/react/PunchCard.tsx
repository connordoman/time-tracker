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
import TimeTracker, { hhMMSS, sumWorkPeriods } from "../../lib/timetracker";
import { RiPlayFill, RiStopFill } from "react-icons/ri";
import { useTimer } from "src/hooks/time";
import PunchCardNotesModal from "./PunchCardNotesModal";
import Blockquote from "./Blockquote";
import PunchCardTimetable from "./PunchCardTimetable";

export const prerender = false;

const itemClasses = {
    base: "py-0 data-[hover=true]:bg-default-100 w-full",
    title: "font-normal text-medium",
    trigger: "px-2 h-10 data-[hover=true]:bg-default-100 rounded-lg flex items-center",
    indicator: "text-medium",
    content: "text-small px-2 pt-3",
};

interface PunchCardProps {
    timeTracker: TimeTracker;
    cardId: string;
}

export default function PunchCard({ timeTracker, cardId }: PunchCardProps) {
    const [punchCard, setPunchCard] = useState(timeTracker.getPunchCard(cardId));
    const [workPeriods, setWorkPeriods] = useState(punchCard?.workPeriods ?? []);
    const [currentMemo, setMemo] = useState(punchCard?.memo ?? "");
    const [currentNotes, setNotes] = useState(punchCard?.notes ?? "");

    const [currentTotal, setCurrentTotal] = useState(sumWorkPeriods(workPeriods));

    const { seconds, isLoading, isPlaying, setPlaying, resetTime } = useTimer({
        startTimeSeconds: 0,
        use24Hour: true,
    });

    useEffect(() => {
        if (!isPlaying) {
            setCurrentTotal(sumWorkPeriods(workPeriods));
        }
    }, [isPlaying, workPeriods]);

    const handleMemoUpdate = (memo: string) => {
        timeTracker.updatePunchCard(cardId, { memo });
        setMemo(memo);
    };

    const handleNotesUpdate = (notes: string) => {
        timeTracker.updatePunchCard(cardId, { notes });
        setNotes(notes);
    };

    const handleStart = () => {
        setPlaying(true);

        timeTracker.punchIn(cardId);
        setWorkPeriods(timeTracker.getWorkPeriods(cardId));
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

    const truncatedNotes = currentNotes.slice(0, 32);
    const hasShortNotes = currentNotes.length <= 32;
    const abbreviatedNotes = currentNotes ? truncatedNotes + (hasShortNotes ? "" : "...") : "No notes added.";

    return (
        <Card className="w-full">
            <CardHeader className="gap-2 flex-col">
                <Input
                    aria-label="Memo"
                    placeholder={currentMemo}
                    labelPlacement="outside"
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">Memo:</span>
                        </div>
                    }
                    value={currentMemo}
                    onValueChange={handleMemoUpdate}
                />
                <div className="w-full flex flex-row gap-2">
                    <Accordion
                        variant="shadow"
                        className="border-none rounded-xl p-0 flex flex-col gap-1 w-full"
                        itemClasses={itemClasses}
                        isCompact>
                        <AccordionItem
                            key={`notes-${cardId}`}
                            aria-label={`Edit notes for ${currentMemo}`}
                            // title={}
                            className="px-0"
                            startContent={
                                <div className="pointer-events-none flex items-center gap-2 text-sm">
                                    <span className="text-default-400 text-small">Notes:</span>
                                    {abbreviatedNotes}
                                </div>
                            }
                            isDisabled={!currentNotes}>
                            <Blockquote>{currentNotes}</Blockquote>
                        </AccordionItem>
                    </Accordion>
                    <PunchCardNotesModal memo={currentMemo} onNotesChange={handleNotesUpdate} notes={currentNotes} />
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <PunchCardTimetable
                    uuid={cardId}
                    memo={currentMemo}
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
                        size="md"
                        tooltipProps={{ content: "Copy total time" }}
                        className="pl-3 py-0 font-normal rounded-full"
                        classNames={{
                            pre: "font-sans",
                        }}
                        hideSymbol>
                        {hhMMSS(currentTotal)}
                    </Snippet>
                </span>
            </CardFooter>
        </Card>
    );
}
