import type React from "react";

export const prerender = false;

interface BlockquoteProps {
    children?: string | React.ReactNode;
}

export default function Blockquote({ children }: BlockquoteProps) {
    return (
        <blockquote className="pl-8 py-4 border-l-5 border-1 border-zinc-400 dark:border-zinc-500 bg-zinc-100 dark:bg-zinc-800 text-foreground italic mb-1 rounded">
            {children}
        </blockquote>
    );
}
