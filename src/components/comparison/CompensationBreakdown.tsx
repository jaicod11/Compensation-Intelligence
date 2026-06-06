import { formatCompact } from "@/lib/utils/currency";

export function CompensationBreakdown({ base, bonus, stock, currency = "INR", totalTc }: { base: number; bonus: number; stock: number; currency?: string; totalTc: number }) {
    const items = [{ label: "Base", value: base, color: "bg-indigo-500" }, { label: "Bonus", value: bonus, color: "bg-indigo-300" }, { label: "Stock/yr", value: stock, color: "bg-indigo-200" }];
    return (
        <div className="space-y-2">
            <div className="flex w-full h-3 rounded-full overflow-hidden gap-px">
                {items.map((item) => { const pct = totalTc > 0 ? (item.value / totalTc) * 100 : 0; if (pct === 0) return null; return <div key={item.label} className={`${item.color} transition-all`} style={{ width: `${pct}%` }} title={`${item.label}: ${formatCompact(item.value, currency)} (${Math.round(pct)}%)`} />; })}
            </div>
            <div className="flex gap-4 flex-wrap">
                {items.map((item) => item.value > 0 && (<div key={item.label} className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-sm ${item.color}`} /><span className="text-xs text-gray-500">{item.label}</span><span className="text-xs font-mono text-gray-700">{formatCompact(item.value, currency)}</span></div>))}
            </div>
        </div>
    );
}