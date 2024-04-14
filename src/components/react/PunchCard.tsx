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
} from "@nextui-org/react";
import { type TimesheetSettings, type PunchCardData } from "../../lib/time";
import TimeTracker from "../../lib/timetracker";
import { RiPlayFill, RiStopFill } from "react-icons/ri";

interface PunchCardProps {
    settings: TimesheetSettings;
    punchCard: PunchCardData;
    onStart?: () => void;
    onStop?: () => void;
}

export default function PunchCard({
    settings,
    punchCard,
    onStart,
    onStop,
}: PunchCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentDuration, setCurrentDuration] = useState(0);

    const timeTracker = new TimeTracker(settings);

    useEffect(() => {
        const timeTrackerInterval = window.setInterval(() => {
            if (isPlaying) {
            setCurrentDuration(currentDuration + TimeTracker.SECOND_INTERVAL);
                
            } else if (isPlaying === false) {
                
            }
        }, 1000);
        return () => window.clearInterval(timeTrackerInterval);
    }, []);

    const handleStart = () => {
        setIsPlaying(true);

        if (onStart) {
            onStart();
        }
    };

    const handleStop = () => {
        setIsPlaying(false);

        if (onStop) {
            onStop();
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <Input label="Memo" placeholder={punchCard.memo} />
            </CardHeader>
            <CardBody>
                <Table
                    aria-label={`Work period table for ${punchCard.memo} from ${timeTracker.getCreatedDate(punchCard)}`}
                    removeWrapper
                    isCompact
                >
                    <TableHeader>
                        <TableColumn className="text-center">Start Time</TableColumn>
                        <TableColumn className="text-center">End Time</TableColumn>
                        <TableColumn className="text-center">
                            <span className="w-full inline-block">&nbsp;</span>
                        </TableColumn>
                        <TableColumn className="text-center">
                            Duration
                        </TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No work periods recorded.">
                        {punchCard.workPeriods.map((period, index) => {
                            console.log("period", period);

                            console.log("duration", TimeTracker.duration(period));

                            return (
                                <TableRow
                                    key={`${index}_${period.startTimeSeconds}`}
                                >
                                    <TableCell className="text-center">
                                        {TimeTracker.timeInTimezone(
                                            period.startTimeSeconds,
                                            settings,
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {isPlaying && index === punchCard.workPeriods.length - 1
                                            ? <span className="mx-auto">&ndash;&ndash;:&ndash;&ndash;:&ndash;&ndash;</span>
                                            : TimeTracker.timeInTimezone(
                                                  period.endTimeSeconds,
                                                  settings,
                                              )}
                                    </TableCell>
                                    <TableCell className="text-center">&mdash;</TableCell>
                                    <TableCell className="text-center">
                                        <Chip
                                            variant="flat"
                                            color={
                                                index + 1 ===
                                                    punchCard.workPeriods
                                                        .length && isPlaying
                                                    ? "success"
                                                    : "default"
                                            }
                                        >
                                            {TimeTracker.hhMMSS(
                                                TimeTracker.duration(period),
                                            )}
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
                        onClick={handleStart}
                    >
                        <RiPlayFill />
                    </Button>
                    <Button
                        variant="flat"
                        color="primary"
                        isDisabled={!isPlaying}
                        disabled={!isPlaying}
                        onClick={handleStop}
                    >
                        <RiStopFill />
                    </Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
    );
}
