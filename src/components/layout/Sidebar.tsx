"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/helpers";

const LINKS = [{ href: "/salaries", label: "Salaries", icon: "💰" }, { href: "/companies", label: "Companies", icon: "🏢" }, { href: "/compare", label: "Compare", icon: "⚖️" }, { href: "/submit", label: "Add Salary", icon: "+" }];

export function Sidebar({ open = true, onClose }: { open?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    return (
        <>
            {open && onClose && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onClose} />}
            <aside className={cn("fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-56 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto", open ? "translate-x-0" : "-translate-x-full")}>
                <nav className="p-4 space-y-1">
                    {LINKS.map((link) => (
                        <Link key={link.href} href={link.href} onClick={onClose} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", pathname.startsWith(link.href) ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")}>
                            <span>{link.icon}</span>{link.label}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}