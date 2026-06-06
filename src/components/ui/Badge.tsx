import { cn } from "@/lib/utils/helpers";

interface BadgeProps { children: React.ReactNode; variant?: "default" | "indigo" | "green" | "amber" | "red" | "gray"; size?: "sm" | "md"; className?: string; }

const VARIANTS = { default: "bg-gray-100 text-gray-700", indigo: "bg-indigo-100 text-indigo-700", green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", gray: "bg-gray-100 text-gray-500" };
const SIZES = { sm: "text-xs px-2 py-0.5", md: "text-sm px-2.5 py-1" };

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
    return <span className={cn("inline-flex items-center font-medium rounded-full", VARIANTS[variant], SIZES[size], className)}>{children}</span>;
}