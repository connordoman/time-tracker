import {
    Button,
    Listbox,
    ListboxItem,
    ListboxSection,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Tooltip,
} from "@nextui-org/react";
import { RxDotsVertical, RxStopwatch } from "react-icons/rx";
import TimeDisplay from "./TimeDisplay";
import type TimeTracker from "@lib/timetracker";
import { useState } from "react";

interface TimesheetNavbarProps {
    timeTracker: TimeTracker;
    totalSeconds: number;
}

export default function TimesheetNavbar({ timeTracker, totalSeconds }: TimesheetNavbarProps) {
    const [currentKeys, setCurrentKeys] = useState<Set<string>>(new Set());

    return (
        <Navbar className="shadow-medium">
            <NavbarBrand>
                <RxStopwatch className="text-3xl" />
                &nbsp;
                <h2 className="font-bold text-xl">Time Tracker</h2>
            </NavbarBrand>
            <NavbarContent justify="end" className="gap-2">
                <NavbarItem className="flex flex-row items-center gap-2">
                    <span className="hidden sm:inline">Total time:</span>
                    <TimeDisplay
                        seconds={totalSeconds}
                        color="success"
                        classNames={{ pre: "font-sans font-semibold text-lg pl-1" }}
                    />
                </NavbarItem>
                <NavbarItem>
                    <Tooltip content="Settings">
                        <Popover placement="bottom" backdrop="blur">
                            <PopoverTrigger>
                                <Button className="p-0 min-w-8 min-h-8 h-8" variant="light" size="lg">
                                    <RxDotsVertical />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64">
                                <Listbox
                                    variant="flat"
                                    aria-label="Listbox menu with sections"
                                    selectionMode="multiple"
                                    selectedKeys={Array.from(currentKeys)}
                                    onAction={(key) => {
                                        console.log("clicked " + key);
                                        const keyString = key as string;

                                        const newKeys = currentKeys;
                                        if (currentKeys.has(keyString)) {
                                            newKeys.delete(keyString);
                                            setCurrentKeys(newKeys);
                                        } else {
                                            newKeys.add(key as string);
                                            setCurrentKeys(newKeys);
                                        }
                                        console.log(newKeys);
                                    }}>
                                    <ListboxSection title="Time Tracker Settings">
                                        <ListboxItem key="24h">24 hour time</ListboxItem>
                                    </ListboxSection>
                                    <ListboxSection title="Window Settings">
                                        <ListboxItem key="hours">Display decimal hours by default</ListboxItem>
                                    </ListboxSection>
                                </Listbox>
                            </PopoverContent>
                        </Popover>
                    </Tooltip>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
