import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { median, percentile } from "@/lib/normalization/compensation";
import { formatCompact } from "@/lib/utils/currency";
import { timeAgo } from "@/lib/utils/helpers";
import { Badge } from "@/components/ui/Badge";
import { LevelProgressionChart } from "@/components/charts/LevelProgressionChart";
import { CompensationBarChart } from "@/components/charts/CompensationBarChart";

async function getCompanyDetail(slug: string) {
    const company = await prisma.company.findUnique({ where: { slug }, include: { salaries: { orderBy: { levelOrder: "asc" } } } });
    if (!company) return null;

    const salaries = company.salaries;
    const allTcs = salaries.map((s) => s.totalComp);
    const sortedTc = [...allTcs].sort((a, b) => a - b);

    const levelMap = new Map<string, typeof salaries>();
    for (const s of salaries) { const arr = levelMap.get(s.level) ?? []; arr.push(s); levelMap.set(s.level, arr); }

    const levelBreakdowns = Array.from(levelMap.entries()).map(([level, entries]) => {
        const tcs = entries.map((e) => e.totalComp).sort((a, b) => a - b);
        return {
            level, levelOrder: entries[0].levelOrder, count: entries.length,
            medianBase: Math.round(median(entries.map((e) => e.baseSalary))),
            medianBonus: Math.round(median(entries.map((e) => e.bonus))),
            medianStock: Math.round(median(entries.map((e) => e.stockAnnual))),
            medianTc: Math.round(median(tcs)),
            p25Tc: Math.round(percentile(tcs, 25)),
            p75Tc: Math.round(percentile(tcs, 75)),
        };
    }).sort((a, b) => a.levelOrder - b.levelOrder);

    return {
        ...company,
        count: salaries.length,
        medianTc: Math.round(median(allTcs)),
        p25Tc: Math.round(percentile(sortedTc, 25)),
        p75Tc: Math.round(percentile(sortedTc, 75)),
        levelBreakdowns,
        recentSalaries: [...salaries].sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()).slice(0, 8),
    };
}

export default async function CompanyDetailPage({ params }: { params: { slug: string } }) {
    const company = await getCompanyDetail(params.slug);
    if (!company) notFound();

    const barChartData = company.levelBreakdowns.map((l) => ({ name: l.level, base: l.medianBase, bonus: l.medianBonus, stock: l.medianStock }));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Link href="/companies" className="hover:text-gray-700">Companies</Link>
                <span>/</span>
                <span className="text-gray-700 font-medium">{company.name}</span>
            </nav>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-xl font-bold text-indigo-700">{company.name[0]}</div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                {company.industry && <Badge variant="indigo">{company.industry}</Badge>}
                                {company.hqCity && <span className="text-gray-400 text-sm">📍 {company.hqCity}, {company.hqCountry}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-700 font-mono">{formatCompact(company.medianTc)}</div>
                            <div className="text-xs text-gray-400 mt-0.5">Median TC</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-700">{company.count}</div>
                            <div className="text-xs text-gray-400 mt-0.5">Reports</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-medium text-gray-500 mt-1">{formatCompact(company.p25Tc)} – {formatCompact(company.p75Tc)}</div>
                            <div className="text-xs text-gray-400 mt-0.5">P25–P75 TC</div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <Link href={`/compare?companies=${company.slug}`} className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100">Compare with others</Link>
                    <Link href={`/salaries?company=${company.slug}`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">View all salaries</Link>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">TC by Level</h2>
                    {company.levelBreakdowns.length > 1 ? <LevelProgressionChart levels={company.levelBreakdowns} /> : <p className="text-gray-400 text-sm py-8 text-center">Not enough level data</p>}
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">Compensation Breakdown by Level</h2>
                    {barChartData.length > 0 ? <CompensationBarChart data={barChartData} /> : <p className="text-gray-400 text-sm py-8 text-center">No data</p>}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-semibold text-gray-900">Compensation by Level</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Reports</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Median Base</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bonus</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock/yr</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-indigo-600 uppercase font-semibold">Median TC</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">P25–P75</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {company.levelBreakdowns.map((l) => (
                                <tr key={l.level} className="hover:bg-gray-50">
                                    <td className="px-6 py-3"><Badge variant="indigo">{l.level}</Badge></td>
                                    <td className="px-4 py-3 text-right text-gray-500">{l.count}</td>
                                    <td className="px-4 py-3 text-right font-mono text-gray-600 text-xs">{formatCompact(l.medianBase)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-gray-500 text-xs">{l.medianBonus > 0 ? formatCompact(l.medianBonus) : <span className="text-gray-300">—</span>}</td>
                                    <td className="px-4 py-3 text-right font-mono text-gray-500 text-xs">{l.medianStock > 0 ? formatCompact(l.medianStock) : <span className="text-gray-300">—</span>}</td>
                                    <td className="px-4 py-3 text-right font-bold font-mono text-indigo-700">{formatCompact(l.medianTc)}</td>
                                    <td className="px-6 py-3 text-right text-xs font-mono text-gray-400">{formatCompact(l.p25Tc)} – {formatCompact(l.p75Tc)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Recent Reports</h2>
                    <Link href={`/salaries?company=${company.slug}`} className="text-sm text-indigo-600 hover:text-indigo-800">View all →</Link>
                </div>
                <div className="divide-y divide-gray-100">
                    {company.recentSalaries.map((s) => (
                        <Link key={s.id} href={`/salaries/${s.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                            <div>
                                <div className="font-medium text-gray-800">{s.jobTitle}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="indigo" size="sm">{s.level}</Badge>
                                    <span className="text-gray-400 text-xs">{s.location} · {timeAgo(s.reportedAt)}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold font-mono text-indigo-700">{formatCompact(s.totalComp, s.currency)}</div>
                                <div className="text-xs text-gray-400">TC/yr</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}