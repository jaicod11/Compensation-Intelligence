import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatCompact } from "@/lib/utils/currency";

export function CompanyHeader({ name, slug, industry, hqCity, hqCountry, count, medianTc, p25Tc, p75Tc, currency = "INR" }: { name: string; slug: string; industry?: string | null; hqCity?: string | null; hqCountry?: string | null; count: number; medianTc: number; p25Tc?: number; p75Tc?: number; currency?: string }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl font-bold text-indigo-700 flex-shrink-0">{name[0]}</div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                        <div className="flex items-center gap-2 mt-1">{industry && <Badge variant="indigo" size="sm">{industry}</Badge>}{hqCity && <span className="text-gray-400 text-sm">📍 {hqCity}{hqCountry ? `, ${hqCountry}` : ""}</span>}</div>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="text-center"><div className="text-2xl font-bold text-indigo-700 font-mono">{formatCompact(medianTc, currency)}</div><div className="text-xs text-gray-400 mt-0.5">Median TC</div></div>
                    {p25Tc !== undefined && p75Tc !== undefined && <div className="text-center"><div className="text-sm font-medium text-gray-500 font-mono mt-1">{formatCompact(p25Tc)} – {formatCompact(p75Tc)}</div><div className="text-xs text-gray-400 mt-0.5">P25 – P75</div></div>}
                    <div className="text-center"><div className="text-2xl font-bold text-gray-700">{count}</div><div className="text-xs text-gray-400 mt-0.5">Reports</div></div>
                </div>
            </div>
            <div className="flex gap-3 mt-6">
                <Link href={`/compare?companies=${slug}`} className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100">⚖️ Compare with others</Link>
                <Link href={`/salaries?company=${slug}`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">📋 View all salaries</Link>
                <Link href="/submit" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">+ Add salary</Link>
            </div>
        </div>
    );
}