"use client";
import { useState } from "react";
import { cn } from "@/lib/utils/helpers";

const POSITIONS = { top: "bottom-full left-1/2 -translate-x-1/2 mb-2", bottom: "top-full left-1/2 -translate-x-1/2 mt-2", left: "right-full top-1/2 -translate-y-1/2 mr-2", right: "left-full top-1/2 -translate-y-1/2 ml-2" };

export function Tooltip({ content, children, position = "top" }: { content: string; children: React.ReactNode; position?: "top" | "bottom" | "left" | "right" }) {
    const [visible, setVisible] = useState(false);
    return (
        <div className="relative inline-flex" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            {children}
            {visible && <div className={cn("absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg whitespace-nowrap shadow-lg pointer-events-none", POSITIONS[position])}>{content}</div>}
        </div>
    );
}