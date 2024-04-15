import type React from "react";

export const prerender = false;

interface BlockquoteProps {
    children?: string | React.ReactNode;
}

export default function Blockquote({ children }: BlockquoteProps) {
    return (
        <blockquote className="pl-8 pr-2 py-4 border-l-5 border-zinc-300 dark:border-zinc-500 bg-zinc-100 dark:bg-zinc-800 text-foreground italic mb-1 rounded">
            {children}
        </blockquote>
    );
}
