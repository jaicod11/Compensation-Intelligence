import { cn } from "@/lib/utils/helpers";
export function Spinner({ className }: { className?: string }) {
    return <div className={cn("flex items-center justify-center py-12", className)}><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>;
}