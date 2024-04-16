import { Button, forwardRef, type ButtonProps } from "@nextui-org/react";
import { PiPlusBold } from "react-icons/pi";

function RoundButton(props: ButtonProps) {
    return (
        <Button
            {...props}
            ref={props.ref}
            color={props.color}
            variant="flat"
            className={
                "rounded-full px-0 min-w-fit w-12 h-12 shadow-medium backdrop-blur-md backdrop-brightness-150 " +
                props.className
            }>
            {props.children}
        </Button>
    );
}

export default forwardRef((props: ButtonProps, ref) => RoundButton({ ref, ...props }));
