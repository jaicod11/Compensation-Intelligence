"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/helpers";

const NAV_LINKS = [{ href: "/salaries", label: "Salaries" }, { href: "/companies", label: "Companies" }, { href: "/compare", label: "Compare" }];

export function Navbar() {
    const pathname = usePathname();
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">CI</span></div>
                        <span className="font-semibold text-gray-900 text-lg">CompIntel</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} className={cn("px-3 py-2 rounded-md text-sm font-medium transition-colors", pathname.startsWith(link.href) ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100")}>{link.label}</Link>
                        ))}
                    </nav>
                    <Link href="/submit" className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">+ Add Salary</Link>
                </div>
            </div>
        </header>
    );
}