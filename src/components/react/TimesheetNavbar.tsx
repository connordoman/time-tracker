import React, { useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Snippet } from "@nextui-org/react";
import { RxStopwatch } from "react-icons/rx";
import { hhMMSS, secondsToHours } from "@lib/timetracker";

interface TimesheetNavbarProps {
    totalSeconds?: number;
}

export default function TimesheetNavbar({ totalSeconds = 69420 }: TimesheetNavbarProps) {
    const [timeString, setTimeString] = useState(hhMMSS(totalSeconds));

    const hours = secondsToHours(totalSeconds).toFixed(2);

    return (
        <Navbar className="shadow-medium">
            <NavbarBrand>
                <RxStopwatch className="text-3xl" />
                &nbsp;
                <h2 className="font-bold text-xl">Time Tracker</h2>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem className="flex flex-row items-center gap-2">
                    <span className="hidden sm:inline">Total time:</span>
                    <Snippet
                        color="success"
                        hideSymbol
                        className="font-sans rounded-full"
                        tooltipProps={{
                            content: `Copy as hours: ${hours}h`,
                            className: "text-white dark:text-zinc-100 dark:bg-green-700",
                        }}
                        classNames={{ pre: "font-sans font-semibold text-lg" }}
                        codeString={hours}>
                        {timeString}
                    </Snippet>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
