import TimeTracker, { hhMMSS, duration } from "@lib/timetracker";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Tooltip,
    Button,
    forwardRef,
} from "@nextui-org/react";
import { PiTrashLight } from "react-icons/pi";

export const prerender = false;

interface PunchCardTimetableProps {
    uuid: string;
    memo: string;
    punchCardCreatedAt: string;
    timeTracker: TimeTracker;
    isPlaying: boolean;
    seconds: number;
    handleDelete: (index: number) => void;
}

function PunchCardTimetable({
    uuid,
    memo,
    punchCardCreatedAt,
    timeTracker,
    isPlaying,
    seconds,
    handleDelete,
}: PunchCardTimetableProps) {
    const workPeriods = timeTracker.getWorkPeriods(uuid);

    return (
        <Table aria-label={`Work period table for ${memo} from ${punchCardCreatedAt}`} removeWrapper isCompact>
            <TableHeader>
                <TableColumn className="text-center text-xs">Start Time</TableColumn>
                <TableColumn className="text-center">End Time</TableColumn>
                <TableColumn className="text-center">
                    <span className="w-6 inline-block">&nbsp;</span>
                </TableColumn>
                <TableColumn className="text-center">Duration</TableColumn>
                <TableColumn className="text-center">
                    <Tooltip content="Delete entry" delay={500} className="text-foreground-500">
                        <span className="mx-auto inline-flex text-base">
                            <PiTrashLight />
                        </span>
                    </Tooltip>
                </TableColumn>
            </TableHeader>
            <TableBody emptyContent="No work periods recorded.">
                {workPeriods.map((period, index) => {
                    const last: boolean = index === workPeriods.length - 1;

                    return (
                        <TableRow key={`${index}_${period.startTimeSeconds}`}>
                            <TableCell className="text-center text-xs">
                                {timeTracker.getTimeInTimezone(period.startTimeSeconds)}
                            </TableCell>
                            <TableCell className="text-center text-xs">
                                {isPlaying && last ? (
                                    <span className="mx-auto">&ndash;&ndash;:&ndash;&ndash;:&ndash;&ndash;</span>
                                ) : (
                                    timeTracker.getTimeInTimezone(period.endTimeSeconds)
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
                                <Tooltip content="Delete" color="danger" delay={500} placement="right">
                                    <Chip
                                        as={Button}
                                        color="danger"
                                        variant="light"
                                        radius="full"
                                        className="p-0 w-4 text-base"
                                        onPress={() => {
                                            handleDelete(index);
                                        }}>
                                        <PiTrashLight />
                                    </Chip>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

export default forwardRef((props: PunchCardTimetableProps, ref) => PunchCardTimetable(props));
