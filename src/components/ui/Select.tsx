import { cn } from "@/lib/utils/helpers";
import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectOption { value: string; label: string; disabled?: boolean; }
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label?: string; hint?: string; error?: string; options: SelectOption[]; placeholder?: string; }

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, hint, error, options, placeholder, className, ...props }, ref) => {
    return (
        <div className="w-full space-y-1">
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            {hint && <p className="text-xs text-gray-400">{hint}</p>}
            <select ref={ref} className={cn("w-full border rounded-lg px-3 py-2.5 text-sm bg-white transition-colors focus:outline-none focus:ring-2 appearance-none", error ? "border-red-300 focus:ring-red-400" : "border-gray-200 focus:ring-indigo-500", className)} {...props}>
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((opt) => <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>)}
            </select>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
});
Select.displayName = "Select";