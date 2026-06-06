"use client";
import { useState } from "react";
import type { SalaryEntry } from "@/types/salary.types";
import { formatCompact } from "@/lib/utils/currency";
import { timeAgo } from "@/lib/utils/helpers";
import { Badge } from "@/components/ui/Badge";

type SortKey = "totalComp" | "baseSalary" | "levelOrder" | "reportedAt";

export function SalaryTable({ salaries, loading }: { salaries: SalaryEntry[]; loading?: boolean }) {
    const [sortKey, setSortKey] = useState<SortKey>("totalComp");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    function handleSort(key: SortKey) {
        if (sortKey === key) { setSortDir((d) => d === "asc" ? "desc" : "asc"); } else { setSortKey(key); setSortDir("desc"); }
    }

    const sorted = [...salaries].sort((a, b) => {
        const aVal = a[sortKey] as number; const bVal = b[sortKey] as number;
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });

    const SortIcon = ({ col }: { col: SortKey }) => <span className="ml-1 text-gray-400 text-xs">{sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>;

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="px-6 py-4 flex gap-4 animate-pulse">
                            <div className="w-32 h-4 bg-gray-100 rounded" /><div className="w-20 h-4 bg-gray-100 rounded" /><div className="flex-1 h-4 bg-gray-100 rounded" /><div className="w-24 h-4 bg-gray-100 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (salaries.length === 0) {
        return <div className="bg-white rounded-xl border border-gray-200 p-16 text-center"><p className="text-gray-400 text-lg">No salaries match your filters.</p><p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria.</p></div>;
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company / Role</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none" onClick={() => handleSort("levelOrder")}>Level <SortIcon col="levelOrder" /></th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none" onClick={() => handleSort("baseSalary")}>Base <SortIcon col="baseSalary" /></th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock/yr</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-indigo-600 uppercase tracking-wider cursor-pointer hover:text-indigo-800 select-none font-semibold" onClick={() => handleSort("totalComp")}>Total TC <SortIcon col="totalComp" /></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sorted.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4"><div className="font-medium text-gray-900">{s.company?.name}</div><div className="text-gray-500 text-xs mt-0.5">{s.jobTitle}</div></td>
                                <td className="px-4 py-4"><Badge variant="indigo">{s.level}</Badge></td>
                                <td className="px-4 py-4 text-gray-600">{s.location}</td>
                                <td className="px-4 py-4 text-right text-gray-700 font-mono text-xs">{formatCompact(s.baseSalary, s.currency)}</td>
                                <td className="px-4 py-4 text-right text-gray-500 font-mono text-xs">{s.bonus > 0 ? formatCompact(s.bonus, s.currency) : <span className="text-gray-300">—</span>}</td>
                                <td className="px-4 py-4 text-right text-gray-500 font-mono text-xs">{s.stockAnnual > 0 ? formatCompact(s.stockAnnual, s.currency) : <span className="text-gray-300">—</span>}</td>
                                <td className="px-6 py-4 text-right"><span className="font-semibold text-indigo-700 font-mono text-sm">{formatCompact(s.totalComp, s.currency)}</span><div className="text-gray-400 text-xs mt-0.5">{timeAgo(s.reportedAt)}</div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="md:hidden divide-y divide-gray-100">
                {sorted.map((s) => (
                    <div key={s.id} className="px-4 py-4">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">{s.company?.name}</div>
                                <div className="text-gray-500 text-xs mt-0.5 truncate">{s.jobTitle}</div>
                                <div className="flex items-center gap-2 mt-1.5"><Badge variant="indigo" size="sm">{s.level}</Badge><span className="text-gray-400 text-xs">{s.location}</span></div>
                            </div>
                            <div className="text-right flex-shrink-0"><div className="font-semibold text-indigo-700 font-mono">{formatCompact(s.totalComp, s.currency)}</div><div className="text-gray-400 text-xs">TC/yr</div></div>
                        </div>
                        <div className="mt-2 flex gap-4 text-xs text-gray-500">
                            <span>Base: {formatCompact(s.baseSalary, s.currency)}</span>
                            {s.bonus > 0 && <span>Bonus: {formatCompact(s.bonus, s.currency)}</span>}
                            {s.stockAnnual > 0 && <span>RSU: {formatCompact(s.stockAnnual, s.currency)}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}