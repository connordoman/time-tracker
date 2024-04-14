import type React from "react";

interface BlockquoteProps {
    children?: string | React.ReactNode;
}

export default function Blockquote({ children }: BlockquoteProps) {
    return (
        <blockquote className="pl-8 py-4 border-l-5 bg-zinc-100 text-zinc-800 italic mb-1 rounded">
            {children}
        </blockquote>
    );
}
