import { Button, forwardRef, type ButtonProps } from "@nextui-org/react";
import { PiPlusBold } from "react-icons/pi";

function RoundButton(props: ButtonProps) {
    return (
        <Button
            ref={props.ref}
            color="primary"
            variant="solid"
            className="px-0 min-w-fit w-12 h-12 rounded-full drop-shadow-xl"
            {...props}>
            {props.children}
        </Button>
    );
}

export default forwardRef((props: ButtonProps, ref) => RoundButton({ ref, ...props }));
