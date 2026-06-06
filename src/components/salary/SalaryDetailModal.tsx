"use client";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import type { SalaryEntry } from "@/types/salary.types";
import { formatCurrency, formatCompact } from "@/lib/utils/currency";
import { timeAgo } from "@/lib/utils/helpers";

export function SalaryDetailModal({ salary: s, open, onClose }: { salary: SalaryEntry | null; open: boolean; onClose: () => void }) {
    if (!s) return null;
    const breakdown = [
        { label: "Base Salary", value: s.baseSalary, pct: Math.round((s.baseSalary / s.totalComp) * 100) },
        { label: "Annual Bonus", value: s.bonus, pct: Math.round((s.bonus / s.totalComp) * 100) },
        { label: "Stock (annualized)", value: s.stockAnnual, pct: Math.round((s.stockAnnual / s.totalComp) * 100) },
    ];
    return (
        <Modal open={open} onClose={onClose} title="Compensation Detail" size="md">
            <div className="flex items-start justify-between gap-3 mb-6">
                <div>
                    <p className="font-semibold text-gray-900 text-lg">{s.company?.name}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{s.jobTitle}</p>
                    <div className="flex items-center gap-2 mt-2"><Badge variant="indigo">{s.level}</Badge><span className="text-gray-400 text-xs">📍 {s.location}</span><span className="text-gray-300 text-xs">· {timeAgo(s.reportedAt)}</span></div>
                </div>
                <div className="text-right flex-shrink-0"><p className="font-bold text-indigo-700 font-mono text-xl">{formatCompact(s.totalComp, s.currency)}</p><p className="text-gray-400 text-xs">Total TC / yr</p></div>
            </div>
            <div className="space-y-3 mb-6">
                {breakdown.map((item) => (
                    <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">{item.label}</span><div className="flex items-center gap-3"><span className="text-gray-400 text-xs">{item.pct}%</span><span className="font-mono font-medium text-gray-800 text-xs">{item.value > 0 ? formatCurrency(item.value, s.currency) : <span className="text-gray-300">—</span>}</span></div></div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${item.pct}%` }} /></div>
                    </div>
                ))}
                <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-semibold"><span className="text-gray-700">Total</span><span className="font-mono text-indigo-700">{formatCurrency(s.totalComp, s.currency)}</span></div>
            </div>
            <div className="flex gap-2">
                <Link href={`/salaries/${s.id}`} onClick={onClose} className="flex-1 text-center py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100">Full detail →</Link>
                <Link href={`/compare?companies=${s.company?.slug}&role=${s.roleSlug}&level=${s.level}`} onClick={onClose} className="flex-1 text-center py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">Compare level →</Link>
            </div>
        </Modal>
    );
}