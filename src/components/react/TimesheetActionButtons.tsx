import { Tooltip } from "@nextui-org/react";
import { PiFloppyDiskLight, PiPlusBold } from "react-icons/pi";
import RoundButton from "./RoundButton";
import { RxDownload, RxShare2 } from "react-icons/rx";
import { RiSave3Fill, RiSave3Line } from "react-icons/ri";

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
        <div className="h-16 fixed bottom-0 right-terminal-align z-30 flex flex-row-reverse gap-4 items-center justify-end">
            <Tooltip content="Add new punch">
                <RoundButton color="primary" onPress={onAdd}>
                    <PiPlusBold className="text-lg" />
                </RoundButton>
            </Tooltip>
            <Tooltip content="Share">
                <RoundButton color="default" onPress={onShare}>
                    <RxShare2 className="text-lg" />
                </RoundButton>
            </Tooltip>
            <Tooltip content="Save">
                <RoundButton color={unsaved ? "warning" : "default"} onPress={onSave}>
                    <PiFloppyDiskLight className="text-lg" />
                </RoundButton>
            </Tooltip>
            <Tooltip content="Download">
                <RoundButton color="default" onPress={onDownload}>
                    <RxDownload className="text-lg" />
                </RoundButton>
            </Tooltip>
        </div>
    );
}
