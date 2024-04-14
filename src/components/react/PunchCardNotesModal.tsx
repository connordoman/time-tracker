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
} from "@nextui-org/react";
import { RiEditBoxLine } from "react-icons/ri";

interface PunchCardNotesModalProps {
    memo?: string;
    notes?: string;
    onNotesChange?: (notes: string) => void;
}

function PunchCardNotesModal({ memo, notes, onNotesChange }: PunchCardNotesModalProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleNotesChange = (notes: string) => {
        if (onNotesChange) onNotesChange(notes);
    };

    return (
        <>
            <Button onPress={onOpen} variant="flat" color="primary">
                <RiEditBoxLine />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Enter notes{memo ? " for " + memo : null}
                            </ModalHeader>
                            <ModalBody>
                                <Textarea placeholder={notes} value={notes} onValueChange={handleNotesChange} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
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

export default forwardRef(PunchCardNotesModal);
