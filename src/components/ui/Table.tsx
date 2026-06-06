import { cn } from "@/lib/utils/helpers";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("overflow-x-auto", className)}><table className="w-full text-sm">{children}</table></div>;
}
export function TableHead({ children }: { children: React.ReactNode }) {
    return <thead><tr className="bg-gray-50 border-b border-gray-200">{children}</tr></thead>;
}
export function Th({ children, className, align = "left", sortable = false, onClick }: { children: React.ReactNode; className?: string; align?: "left" | "right" | "center"; sortable?: boolean; onClick?: () => void }) {
    return <th onClick={onClick} className={cn("px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider", align === "right" && "text-right", align === "center" && "text-center", sortable && "cursor-pointer select-none hover:text-gray-700", className)}>{children}</th>;
}
export function TableBody({ children }: { children: React.ReactNode }) {
    return <tbody className="divide-y divide-gray-100">{children}</tbody>;
}
export function Tr({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
    return <tr onClick={onClick} className={cn("hover:bg-gray-50 transition-colors", onClick && "cursor-pointer", className)}>{children}</tr>;
}
export function Td({ children, className, align = "left" }: { children: React.ReactNode; className?: string; align?: "left" | "right" | "center" }) {
    return <td className={cn("px-4 py-3", align === "right" && "text-right", align === "center" && "text-center", className)}>{children}</td>;
}