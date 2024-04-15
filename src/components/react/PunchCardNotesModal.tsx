import React, { forwardRef, useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Textarea,
    type ModalProps,
    Tooltip,
} from "@nextui-org/react";
import { RiEditBoxLine } from "react-icons/ri";

export const prerender = false;

interface PunchCardNotesModalProps extends Omit<ModalProps, "children"> {
    memo?: string;
    notes?: string;
    onNotesChange?: (notes: string) => void;
}

function PunchCardNotesModal({ memo, notes, onNotesChange, ...props }: PunchCardNotesModalProps) {
    const [currentNotes, setCurrentNotes] = useState(notes);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleNotesChange = (newNotes: string) => {
        setCurrentNotes(newNotes);
    };

    const handleOk = () => {
        if (onNotesChange) onNotesChange(currentNotes ?? "");
    };

    const handleCancel = () => {
        setCurrentNotes(notes);
    };

    return (
        <>
            <Tooltip content="Edit notes" delay={500} className="text-foreground-500">
                <Button onPress={onOpen} variant="flat" color="primary">
                    <RiEditBoxLine />
                </Button>
            </Tooltip>
            <Modal {...props} isOpen={isOpen} size="md" onOpenChange={onOpenChange} position="center" className="mr-5">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Enter notes{memo ? ` for "${memo}"` : null}
                            </ModalHeader>
                            <ModalBody>
                                <Textarea
                                    placeholder={notes}
                                    value={currentNotes}
                                    minRows={6}
                                    onValueChange={handleNotesChange}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
                                        handleCancel();
                                        onClose();
                                    }}>
                                    Close
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => {
                                        handleOk();
                                        onClose();
                                    }}>
                                    Ok
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default forwardRef((props: PunchCardNotesModalProps, ref) => PunchCardNotesModal(props));
