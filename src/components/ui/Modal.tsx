"use client";
import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils/helpers";

interface ModalProps { open: boolean; onClose: () => void; title?: string; children: React.ReactNode; size?: "sm" | "md" | "lg" | "xl"; }
const SIZES = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
    const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }, [onClose]);
    useEffect(() => {
        if (open) { document.addEventListener("keydown", handleKey); document.body.style.overflow = "hidden"; }
        return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
    }, [open, handleKey]);
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={cn("relative w-full bg-white rounded-2xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto", SIZES[size])}>
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">{title}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100">
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}