import { cn } from "@/lib/utils/helpers";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; hint?: string; error?: string; leftIcon?: React.ReactNode; }

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, hint, error, leftIcon, className, ...props }, ref) => {
    return (
        <div className="w-full space-y-1">
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            {hint && <p className="text-xs text-gray-400">{hint}</p>}
            <div className="relative">
                {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</div>}
                <input ref={ref} className={cn("w-full border rounded-lg px-3 py-2.5 text-sm bg-white transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2", leftIcon && "pl-9", error ? "border-red-300 focus:ring-red-400" : "border-gray-200 focus:ring-indigo-500", className)} {...props} />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
});
Input.displayName = "Input";