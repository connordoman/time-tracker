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
} from "@nextui-org/react";
import { type TimesheetSettings, type PunchCardData } from "../../lib/time";
import TimeTracker from "../../lib/timetracker";
import { RiEditBoxLine, RiPlayFill, RiStopFill } from "react-icons/ri";
import { PiTrashLight } from "react-icons/pi";
import { useTimer } from "src/hooks/time";

interface PunchCardProps {
    settings: TimesheetSettings;
    punchCard: PunchCardData;
    onMemoUpdate?: (memo: string) => void;
    onNotesUpdate?: (notes: string) => void;
    onStart?: () => void;
    onStop?: () => void;
    onDelete?: (id: number) => void;
}

export default function PunchCard({
    settings,
    punchCard,
    onMemoUpdate,
    onNotesUpdate,
    onStart,
    onStop,
    onDelete,
}: PunchCardProps) {
    const [currentMemo, setCurrentMemo] = useState("");
    const [currentNotes, setCurrentNotes] = useState(punchCard.notes);

    const timeTracker = new TimeTracker(settings);

    const { seconds, isLoading, isPlaying, setPlaying, resetTime } = useTimer({ startTimeSeconds: 0, use24Hour: true });

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
        if (onDelete) {
            onDelete(id);
        }
    };

    const handleNotesUpdate = (notes: string) => {
        if (onNotesUpdate) {
            onNotesUpdate(notes);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="gap-2 flex-col">
                <Input label="Memo" placeholder={punchCard.memo} value={currentMemo} onValueChange={handleMemoUpdate} />
                <div className="w-full flex flex-row gap-2">
                    <Accordion className="m-0 px-0" variant="splitted" isCompact>
                        <AccordionItem
                            key={`notes-${punchCard.uuid}`}
                            aria-label={`Eidt notes for ${punchCard.memo}`}
                            title={currentNotes ? "View notes" : "No notes added"}
                            className="px-0"
                            isDisabled={!currentNotes}>
                            {currentNotes}
                        </AccordionItem>
                    </Accordion>
                    <Button color="primary" variant="flat">
                        <RiEditBoxLine />
                    </Button>
                </div>
            </CardHeader>
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
                        {punchCard.workPeriods.map((period, index) => {
                            console.log("period", period);

                            console.log("duration", TimeTracker.duration(period));

                            const last: boolean = index === punchCard.workPeriods.length - 1;

                            return (
                                <TableRow key={`${index}_${period.startTimeSeconds}`}>
                                    <TableCell className="text-center text-xs">
                                        {TimeTracker.timeInTimezone(period.startTimeSeconds, settings)}
                                    </TableCell>
                                    <TableCell className="text-center text-xs">
                                        {isPlaying && last ? (
                                            <span className="mx-auto">
                                                &ndash;&ndash;:&ndash;&ndash;:&ndash;&ndash;
                                            </span>
                                        ) : (
                                            TimeTracker.timeInTimezone(period.endTimeSeconds, settings)
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center text-xs">&mdash;</TableCell>
                                    <TableCell className="text-center text-xs">
                                        <Chip
                                            variant="flat"
                                            color={isPlaying && last ? "success" : "default"}
                                            className="text-xs">
                                            {TimeTracker.hhMMSS(
                                                isPlaying && last ? seconds : TimeTracker.duration(period)
                                            )}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="text-center w-min text-xs">
                                        <Chip
                                            as={Button}
                                            color="danger"
                                            variant="flat"
                                            radius="full"
                                            className="p-0 w-4 text-xs"
                                            onClick={() => {
                                                console.log("clicked delete for", index);
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
            <CardFooter className="gap-2">
                <ButtonGroup>
                    <Button
                        variant="flat"
                        color="success"
                        isDisabled={isPlaying}
                        disabled={isPlaying}
                        onClick={handleStart}>
                        <RiPlayFill />
                    </Button>
                    <Button
                        variant="flat"
                        color="primary"
                        isDisabled={!isPlaying}
                        disabled={!isPlaying}
                        onClick={handleStop}>
                        <RiStopFill />
                    </Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
    );
}
