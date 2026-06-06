import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatCompact, formatCurrency } from "@/lib/utils/currency";
import { timeAgo } from "@/lib/utils/helpers";
import { Badge } from "@/components/ui/Badge";

export default async function SalaryDetailPage({ params }: { params: { id: string } }) {
    const entry = await prisma.salaryEntry.findUnique({ where: { id: params.id }, include: { company: true } });
    if (!entry) notFound();

    const breakdown = [
        { label: "Base Salary", value: entry.baseSalary, pct: Math.round((entry.baseSalary / entry.totalComp) * 100) },
        { label: "Annual Bonus", value: entry.bonus, pct: Math.round((entry.bonus / entry.totalComp) * 100) },
        { label: "Stock (annualized)", value: entry.stockAnnual, pct: Math.round((entry.stockAnnual / entry.totalComp) * 100) },
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                <Link href="/salaries" className="hover:text-gray-700">Salaries</Link>
                <span>/</span>
                <Link href={`/companies/${entry.company.slug}`} className="hover:text-gray-700">{entry.company.name}</Link>
                <span>/</span>
                <span className="text-gray-600">{entry.level}</span>
            </nav>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <Link href={`/companies/${entry.company.slug}`} className="text-indigo-600 font-semibold text-lg hover:text-indigo-800">{entry.company.name}</Link>
                        <h1 className="text-2xl font-bold text-gray-900 mt-1">{entry.jobTitle}</h1>
                        <div className="flex items-center gap-3 mt-3">
                            <Badge variant="indigo" size="md">{entry.level}</Badge>
                            <span className="text-gray-500 text-sm">{entry.role}</span>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-500 text-sm">📍 {entry.location}</span>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="text-3xl font-bold text-indigo-700 font-mono">{formatCompact(entry.totalComp, entry.currency)}</div>
                        <div className="text-gray-400 text-sm mt-0.5">Total Comp / yr</div>
                    </div>
                </div>
                {entry.yearsExperience != null && <p className="text-gray-500 text-sm mt-4">{entry.yearsExperience} years of experience</p>}
                <p className="text-gray-400 text-xs mt-1">Reported {timeAgo(entry.reportedAt)}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="font-semibold text-gray-900 mb-5">Compensation Breakdown</h2>
                <div className="space-y-4">
                    {breakdown.map((item) => (
                        <div key={item.label}>
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-gray-600">{item.label}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400 text-xs">{item.pct}%</span>
                                    <span className="font-mono font-medium text-gray-800">
                                        {item.value > 0 ? formatCurrency(item.value, entry.currency) : <span className="text-gray-300">—</span>}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${item.pct}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-100 mt-6 pt-4 flex justify-between">
                    <span className="font-semibold text-gray-700">Total Compensation</span>
                    <span className="font-bold font-mono text-indigo-700 text-lg">{formatCurrency(entry.totalComp, entry.currency)}</span>
                </div>
            </div>

            <div className="flex gap-3">
                <Link href={`/companies/${entry.company.slug}`} className="flex-1 text-center py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">View {entry.company.name} →</Link>
                <Link href={`/compare?companies=${entry.company.slug}&role=${entry.roleSlug}&level=${entry.level}`} className="flex-1 text-center py-2.5 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100">Compare this level →</Link>
            </div>
        </div>
    );
}