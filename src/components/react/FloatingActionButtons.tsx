import { Tooltip } from "@nextui-org/react";
import { PiFloppyDiskLight, PiPlusBold } from "react-icons/pi";
import RoundButton from "./RoundButton";
import { RxDownload, RxShare2 } from "react-icons/rx";
import { RiSave3Fill, RiSave3Line } from "react-icons/ri";

export default function FloatingActionButtons() {
    return (
        <div className="h-16 fixed bottom-0 right-terminal-align z-30 flex flex-row-reverse gap-4 items-center justify-end">
            <Tooltip content="Add new punch">
                <RoundButton color="primary">
                    <PiPlusBold className="text-lg" />
                </RoundButton>
            </Tooltip>
            <Tooltip content="Share">
                <RoundButton color="default">
                    <RxShare2 className="text-lg" />
                </RoundButton>
            </Tooltip>
            <Tooltip content="Save">
                <RoundButton color="default">
                    <PiFloppyDiskLight className="text-lg" />
                </RoundButton>
            </Tooltip>
            <Tooltip content="Download">
                <RoundButton color="default">
                    <RxDownload className="text-lg" />
                </RoundButton>
            </Tooltip>
        </div>
    );
}
