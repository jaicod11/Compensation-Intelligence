import { Badge } from "@/components/ui/Badge";
import { CompensationBreakdown } from "@/components/comparison/CompensationBreakdown";
import { formatCompact } from "@/lib/utils/currency";

interface CompareResult { company: { id: string; name: string; slug: string }; role: string; level: string; stats: { count: number; medianTc: number; medianBase: number; medianBonus: number; medianStock: number; p25Tc: number; p75Tc: number; p10Tc: number; p90Tc: number; }; }

export function ComparisonTable({ results, highestCompany, currency = "INR" }: { results: CompareResult[]; highestCompany?: string; currency?: string }) {
    const rows = [{ key: "medianBase", label: "Median Base" }, { key: "medianBonus", label: "Median Bonus" }, { key: "medianStock", label: "Stock / yr" }, { key: "p25Tc", label: "P25 TC" }, { key: "medianTc", label: "Median TC", bold: true }, { key: "p75Tc", label: "P75 TC" }, { key: "p10Tc", label: "P10 TC" }, { key: "p90Tc", label: "P90 TC" }, { key: "count", label: "Reports", isCount: true }] as const;
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">Metric</th>
                        {results.map((r) => (<th key={r.company.slug} className="px-4 py-3 text-right"><div className="flex flex-col items-end gap-1"><span className={`font-semibold ${r.company.name === highestCompany ? "text-indigo-700" : "text-gray-800"}`}>{r.company.name}</span><Badge variant="indigo" size="sm">{r.level}</Badge></div></th>))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {rows.map(({ key, label, bold, isCount }) => (
                        <tr key={key} className={bold ? "bg-indigo-50" : "hover:bg-gray-50"}>
                            <td className={`px-4 py-3 text-gray-500 ${bold ? "font-semibold text-gray-700" : ""}`}>{label}</td>
                            {results.map((r) => { const raw = r.stats[key as keyof typeof r.stats] as number; const isTop = bold && r.company.name === highestCompany; return <td key={r.company.slug} className="px-4 py-3 text-right"><span className={`font-mono ${bold ? isTop ? "font-bold text-indigo-700 text-base" : "font-semibold text-gray-800" : "text-gray-600 text-xs"}`}>{isCount ? raw : raw > 0 ? formatCompact(raw, currency) : <span className="text-gray-300">—</span>}</span></td>; })}
                        </tr>
                    ))}
                    <tr className="border-t border-gray-200">
                        <td className="px-4 py-3 text-gray-500 text-xs">Breakdown</td>
                        {results.map((r) => (<td key={r.company.slug} className="px-4 py-4"><CompensationBreakdown base={r.stats.medianBase} bonus={r.stats.medianBonus} stock={r.stats.medianStock} totalTc={r.stats.medianTc} currency={currency} /></td>))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}