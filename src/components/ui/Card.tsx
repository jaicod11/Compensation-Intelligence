import { cn } from "@/lib/utils/helpers";

interface CardProps { children: React.ReactNode; className?: string; padding?: "none" | "sm" | "md" | "lg"; hover?: boolean; onClick?: () => void; }
const PADDING = { none: "", sm: "p-4", md: "p-6", lg: "p-8" };

export function Card({ children, className, padding = "md", hover = false, onClick }: CardProps) {
    return <div onClick={onClick} className={cn("bg-white rounded-xl border border-gray-200", PADDING[padding], hover && "hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer", onClick && "cursor-pointer", className)}>{children}</div>;
}
export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("px-6 py-4 border-b border-gray-100 flex items-center justify-between", className)}>{children}</div>;
}
export function CardTitle({ children }: { children: React.ReactNode }) {
    return <h3 className="font-semibold text-gray-900 text-sm">{children}</h3>;
}
export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("p-6", className)}>{children}</div>;
}