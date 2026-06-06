import Link from "next/link";
import { prisma } from "@/lib/db";
import { median } from "@/lib/normalization/compensation";
import { formatCompact } from "@/lib/utils/currency";
import { Badge } from "@/components/ui/Badge";

async function getCompanies() {
    const companies = await prisma.company.findMany({
        include: { _count: { select: { salaries: true } }, salaries: { select: { totalComp: true, baseSalary: true } } },
        where: { salaries: { some: {} } },
    });
    return companies.map((c) => ({
        id: c.id, name: c.name, slug: c.slug, industry: c.industry, hqCity: c.hqCity,
        count: c._count.salaries,
        medianTc: Math.round(median(c.salaries.map((s) => s.totalComp))),
        medianBase: Math.round(median(c.salaries.map((s) => s.baseSalary))),
    })).sort((a, b) => b.medianTc - a.medianTc);
}

const industryColors: Record<string, "indigo" | "green" | "amber" | "red" | "gray"> = {
    Technology: "indigo", Fintech: "green", "E-Commerce": "amber", "Food Tech": "red", "IT Services": "gray",
};

export default async function CompaniesPage() {
    const companies = await getCompanies();
    const industries = Array.from(new Set(companies.map((c) => c.industry).filter(Boolean))) as string[];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
                <p className="text-gray-500 mt-1 text-sm">{companies.length} companies · ranked by median Total Compensation</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm text-gray-500 self-center mr-1">Filter:</span>
                {industries.map((ind) => (
                    <a key={ind} href={`?industry=${ind}`} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors">{ind}</a>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hidden md:block">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">HQ</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Reports</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Median Base</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-indigo-600 uppercase font-semibold">Median TC</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {companies.map((c, i) => (
                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-400 font-mono text-sm">{i + 1}</td>
                                <td className="px-6 py-4"><Link href={`/companies/${c.slug}`} className="font-semibold text-gray-900 hover:text-indigo-700">{c.name}</Link></td>
                                <td className="px-4 py-4">{c.industry && <Badge variant={industryColors[c.industry] ?? "gray"}>{c.industry}</Badge>}</td>
                                <td className="px-4 py-4 text-gray-500 text-sm">{c.hqCity}</td>
                                <td className="px-4 py-4 text-right text-gray-500">{c.count}</td>
                                <td className="px-4 py-4 text-right font-mono text-gray-600 text-sm">{formatCompact(c.medianBase)}</td>
                                <td className="px-6 py-4 text-right font-bold font-mono text-indigo-700">{formatCompact(c.medianTc)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-3">
                {companies.map((c, i) => (
                    <Link key={c.id} href={`/companies/${c.slug}`} className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-200">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-300 font-mono text-sm w-6">{i + 1}</span>
                            <div>
                                <div className="font-semibold text-gray-900">{c.name}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{c.count} reports · {c.hqCity}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-indigo-700 font-mono">{formatCompact(c.medianTc)}</div>
                            <div className="text-xs text-gray-400">median TC</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}