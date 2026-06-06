import { formatCompact } from "@/lib/utils/currency";

export function CompanyStatsBar({ medianTc, medianBase, p25Tc, p75Tc, count, currency = "INR" }: { medianTc: number; medianBase?: number; p25Tc?: number; p75Tc?: number; count: number; currency?: string }) {
    const stats = [
        { label: "Median TC", value: formatCompact(medianTc, currency), highlight: true },
        ...(medianBase !== undefined ? [{ label: "Median Base", value: formatCompact(medianBase, currency), highlight: false }] : []),
        ...(p25Tc !== undefined && p75Tc !== undefined ? [{ label: "P25 – P75", value: `${formatCompact(p25Tc)} – ${formatCompact(p75Tc)}`, highlight: false }] : []),
        { label: "Reports", value: count.toString(), highlight: false },
    ];
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            {stats.map((stat) => (<div key={stat.label} className="bg-white px-5 py-4 text-center"><div className={`font-bold font-mono text-lg ${stat.highlight ? "text-indigo-700" : "text-gray-800"}`}>{stat.value}</div><div className="text-xs text-gray-400 mt-0.5">{stat.label}</div></div>))}
        </div>
    );
}