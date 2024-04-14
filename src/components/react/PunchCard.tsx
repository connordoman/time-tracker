import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Input,
    ButtonGroup,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Divider,
    Chip,
    Link,
    Accordion,
    AccordionItem,
    Textarea,
    Snippet,
    useDisclosure,
} from "@nextui-org/react";
import { type TimesheetSettings, type PunchCardData } from "../../lib/time";
import TimeTracker, { duration, hhMMSS, sumWorkPeriods, timeInTimezone } from "../../lib/timetracker";
import { RiEditBoxLine, RiPlayFill, RiStopFill, RiTimer2Line } from "react-icons/ri";
import { PiTrashLight } from "react-icons/pi";
import { useTimer } from "src/hooks/time";
import PunchCardNotesModal from "./PunchCardNotesModal";
import Blockquote from "./Blockquote";

interface PunchCardProps {
    settings: TimesheetSettings;
    punchCard: PunchCardData;
    timeTracker: TimeTracker;
    onMemoUpdate?: (memo: string) => void;
    onNotesUpdate?: (notes: string) => void;
    onStart?: () => void;
    onStop?: () => void;
    onDelete?: (id: number) => void;
}

export default function PunchCard({
    settings,
    punchCard,
    timeTracker,
    onMemoUpdate,
    onNotesUpdate,
    onStart,
    onStop,
    onDelete,
}: PunchCardProps) {
    const [currentMemo, setCurrentMemo] = useState("");
    const [currentNotes, setCurrentNotes] = useState(punchCard.notes);
    const [currentWorkPeriods, setCurrentWorkPeriods] = useState(punchCard.workPeriods);
    const [currentTotal, setCurrentTotal] = useState(sumWorkPeriods(currentWorkPeriods));

    // const timeTracker = new TimeTracker(settings);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { seconds, isLoading, isPlaying, setPlaying, resetTime } = useTimer({ startTimeSeconds: 0, use24Hour: true });

    useEffect(() => {
        if (!isPlaying) {
            setCurrentTotal(sumWorkPeriods(currentWorkPeriods));
        }
    }, [isPlaying]);

    const handleMemoUpdate = (memo: string) => {
        setCurrentMemo(memo);

        if (onMemoUpdate) {
            onMemoUpdate(memo);
        }
    };

    const handleStart = () => {
        setPlaying(true);

        if (onStart) {
            onStart();
        }
    };

    const handleStop = () => {
        setPlaying(false);
        resetTime();

        if (onStop) {
            onStop();
        }
    };

    const handleDelete = (id: number) => {
        setCurrentWorkPeriods(currentWorkPeriods.toSpliced(id, 1));

        if (onDelete) {
            onDelete(id);
        }
    };

    const handleNotesUpdate = (notes: string) => {
        setCurrentNotes(notes);

        if (onNotesUpdate) {
            onNotesUpdate(notes);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="gap-2 flex-col">
                <Input label="Memo" placeholder={punchCard.memo} value={currentMemo} onValueChange={handleMemoUpdate} />
                <div className="w-full flex flex-row gap-2">
                    <Accordion variant="light" className="border-1 border-zinc-200 rounded-xl" isCompact>
                        <AccordionItem
                            key={`notes-${punchCard.uuid}`}
                            aria-label={`Eidt notes for ${punchCard.memo}`}
                            title={currentNotes ? "View notes:" : "No notes added."}
                            className="px-0"
                            isDisabled={!currentNotes}>
                            <Blockquote>{currentNotes}</Blockquote>
                        </AccordionItem>
                    </Accordion>
                    <PunchCardNotesModal memo={punchCard.memo} onNotesChange={handleNotesUpdate} notes={currentNotes} />
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <Table
                    aria-label={`Work period table for ${punchCard.memo} from ${timeTracker.getCreatedDate(punchCard)}`}
                    removeWrapper
                    isCompact>
                    <TableHeader>
                        <TableColumn className="text-center text-xs">Start Time</TableColumn>
                        <TableColumn className="text-center">End Time</TableColumn>
                        <TableColumn className="text-center">
                            <span className="w-6 inline-block">&nbsp;</span>
                        </TableColumn>
                        <TableColumn className="text-center">Duration</TableColumn>
                        <TableColumn className="text-center">
                            <span className="mx-auto inline-flex">
                                <PiTrashLight />
                            </span>
                        </TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No work periods recorded.">
                        {currentWorkPeriods.map((period, index) => {
                            const last: boolean = index === currentWorkPeriods.length - 1;

                            return (
                                <TableRow key={`${index}_${period.startTimeSeconds}`}>
                                    <TableCell className="text-center text-xs">
                                        {timeInTimezone(period.startTimeSeconds, settings)}
                                    </TableCell>
                                    <TableCell className="text-center text-xs">
                                        {isPlaying && last ? (
                                            <span className="mx-auto">
                                                &ndash;&ndash;:&ndash;&ndash;:&ndash;&ndash;
                                            </span>
                                        ) : (
                                            timeInTimezone(period.endTimeSeconds, settings)
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center text-xs">&mdash;</TableCell>
                                    <TableCell className="text-center text-xs">
                                        <Chip
                                            variant="flat"
                                            color={isPlaying && last ? "success" : "default"}
                                            className="text-xs">
                                            {hhMMSS(isPlaying && last ? seconds : duration(period))}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="text-center w-min text-xs">
                                        <Chip
                                            as={Button}
                                            color="danger"
                                            variant="flat"
                                            radius="full"
                                            className="p-0 w-4 text-xs"
                                            onPress={() => {
                                                handleDelete(index);
                                            }}>
                                            <PiTrashLight />
                                        </Chip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardBody>
            <Divider />
            <CardFooter className="gap-2 justify-between">
                <ButtonGroup>
                    <Button
                        variant="flat"
                        color="success"
                        size="sm"
                        isDisabled={isPlaying}
                        disabled={isPlaying}
                        onPress={handleStart}>
                        <RiPlayFill />
                    </Button>
                    <Button
                        variant="flat"
                        color="primary"
                        size="sm"
                        isDisabled={!isPlaying}
                        disabled={!isPlaying}
                        onPress={handleStop}>
                        <RiStopFill />
                    </Button>
                </ButtonGroup>
                <span className="flex flex-row gap-2 items-center">
                    Total:
                    <Snippet
                        variant="flat"
                        color="primary"
                        size="sm"
                        tooltipProps={{ content: "Copy total time" }}
                        className="pl-3 font-normal"
                        hideSymbol>
                        {hhMMSS(currentTotal)}
                    </Snippet>
                </span>
            </CardFooter>
        </Card>
    );
}
