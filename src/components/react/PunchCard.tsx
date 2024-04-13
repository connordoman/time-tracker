import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Button, Input, ButtonGroup } from "@nextui-org/react";
import { type PunchCardData } from "../../lib/time";

interface PunchCardProps {
    punchCard: PunchCardData;
}

export default function PunchCard({punchCard}: PunchCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handleStart = () => {
        setIsPlaying(true);
    }

    const handleStop = () => {
        setIsPlaying(false);
    }

    return <Card className="w-full">
        <CardHeader>
            <Input label="Memo" placeholder={punchCard.memo}/>
        </CardHeader>
        <CardBody>
            <p>{punchCard.notes}</p>
        </CardBody>
        <CardFooter className="gap-2">
            <ButtonGroup>
                <Button variant="flat" color="success" isDisabled={isPlaying} onClick={handleStart}>
                    Start
                </Button>
                <Button variant="flat" color="primary" isDisabled={!isPlaying} onClick={handleStop}>
                    Stop
                </Button>
            </ButtonGroup>
        </CardFooter>
    </Card>
}