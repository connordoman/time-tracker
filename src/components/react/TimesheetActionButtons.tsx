import { Tooltip, type ButtonProps } from "@nextui-org/react";
import { PiFloppyDiskLight, PiPlusBold } from "react-icons/pi";
import RoundButton from "./RoundButton";
import { RxDownload, RxShare2 } from "react-icons/rx";
import { RiSave3Fill, RiSave3Line } from "react-icons/ri";
import { forwardRef } from "react";

interface TouchButtonProps {
    onPress: () => void;
    children?: React.ReactNode;
    color: ButtonProps["color"];
}

const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
    ({ onPress, children, color }: TouchButtonProps, ref) => {
        return (
            <RoundButton
                ref={ref}
                color={color}
                onPress={onPress}
                className="w-24 h-24 md:h-16 md:w-16 text-5xl md:text-2xl">
                {children}
            </RoundButton>
        );
    }
);

interface TimesheetActionButtonsProps {
    unsaved?: boolean;
    onAdd: () => void;
    onShare: () => void;
    onSave: () => void;
    onDownload: () => void;
}

export default function TimesheetActionButtons({
    unsaved = false,
    onAdd,
    onShare,
    onSave,
    onDownload,
}: TimesheetActionButtonsProps) {
    return (
        <div className="py-[5vh] h-auto fixed bottom-0 right-terminal-align z-30 flex flex-row-reverse gap-4 items-center justify-end">
            <Tooltip content="Add new punch">
                <TouchButton color="primary" onPress={onAdd}>
                    <PiPlusBold className="" />
                </TouchButton>
            </Tooltip>
            <Tooltip content="Share">
                <TouchButton color="default" onPress={onShare}>
                    <RxShare2 className="" />
                </TouchButton>
            </Tooltip>
            <Tooltip content="Save">
                <TouchButton color={unsaved ? "warning" : "default"} onPress={onSave}>
                    <PiFloppyDiskLight className="" />
                </TouchButton>
            </Tooltip>
            <Tooltip content="Download">
                <TouchButton color="default" onPress={onDownload}>
                    <RxDownload className="" />
                </TouchButton>
            </Tooltip>
        </div>
    );
}
