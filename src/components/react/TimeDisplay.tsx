import { hhMMSS, secondsToHours } from "@lib/timetracker";
import { Snippet, forwardRef, type SnippetProps } from "@nextui-org/react";
import { useState, useEffect } from "react";

interface TimeDisplayProps extends SnippetProps {
    seconds: number;
}

function TimeDisplay({ seconds, ...props }: TimeDisplayProps) {
    const [timeString, setTimeString] = useState(hhMMSS(seconds));
    const [hours, setHours] = useState(secondsToHours(seconds).toFixed(2));
    const [altPressed, setAltPressed] = useState(false);

    useEffect(() => {
        setTimeString(hhMMSS(seconds));
        setHours(secondsToHours(seconds).toFixed(2));
    }, [seconds]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Alt") {
                setAltPressed(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Alt") {
                setAltPressed(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    });
    return (
        <Snippet
            codeString={altPressed ? hours : timeString}
            color={props.color ?? "primary"}
            className="font-sans rounded-full"
            classNames={{ pre: "font-sans font-semibold text-lg pl-1" }}
            tooltipProps={{
                content: altPressed ? `Copy as hours: ${hours}h` : `Copy as time: ${timeString}`,
                className: "text-white dark:text-zinc-100 dark:bg-green-700",
            }}
            hideSymbol
            {...props}>
            {altPressed ? `${hours}h` : timeString}
        </Snippet>
    );
}

export default forwardRef((props: TimeDisplayProps, ref) => <TimeDisplay ref={ref} {...props} />);
