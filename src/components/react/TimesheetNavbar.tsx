import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Snippet } from "@nextui-org/react";
import { RxStopwatch } from "react-icons/rx";
import { hhMMSS, secondsToHours } from "@lib/timetracker";
import TimeDisplay from "./TimeDisplay";

interface TimesheetNavbarProps {
    totalSeconds: number;
}

export default function TimesheetNavbar({ totalSeconds }: TimesheetNavbarProps) {
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
                    <TimeDisplay
                        seconds={totalSeconds}
                        color="success"
                        classNames={{ pre: "font-sans font-semibold text-lg pl-1" }}
                    />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
