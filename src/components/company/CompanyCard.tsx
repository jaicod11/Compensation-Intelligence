import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatCompact } from "@/lib/utils/currency";

const industryVariants: Record<string, "indigo" | "green" | "amber" | "red" | "gray"> = { Technology: "indigo", Fintech: "green", "E-Commerce": "amber", "Food Tech": "red", "IT Services": "gray" };

export function CompanyCard({ name, slug, industry, hqCity, count, medianTc, medianBase, rank, currency = "INR" }: { name: string; slug: string; industry?: string | null; hqCity?: string | null; count: number; medianTc: number; medianBase?: number; rank?: number; currency?: string }) {
    return (
        <Link href={`/companies/${slug}`} className="group block bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    {rank !== undefined && <span className="text-gray-300 font-mono text-sm w-5 mt-0.5 flex-shrink-0">{rank}</span>}
                    <div>
                        <div className="flex items-center gap-2 mb-1"><div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">{name[0]}</div><span className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{name}</span></div>
                        <div className="flex items-center gap-2 mt-1.5">{industry && <Badge variant={industryVariants[industry] ?? "gray"} size="sm">{industry}</Badge>}{hqCity && <span className="text-gray-400 text-xs">📍 {hqCity}</span>}</div>
                        <p className="text-gray-400 text-xs mt-1.5">{count} reports</p>
                    </div>
                </div>
                <div className="text-right flex-shrink-0"><div className="font-bold text-indigo-700 font-mono text-lg">{formatCompact(medianTc, currency)}</div><div className="text-gray-400 text-xs">median TC</div>{medianBase !== undefined && <div className="text-gray-400 text-xs mt-0.5">base: {formatCompact(medianBase, currency)}</div>}</div>
            </div>
        </Link>
    );
}