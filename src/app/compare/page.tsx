"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ROLES } from "@/constants/roles";
import { LEVELS } from "@/constants/levels";
import { formatCompact } from "@/lib/utils/currency";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { CompensationBarChart } from "@/components/charts/CompensationBarChart";

interface CompanyOption { id: string; name: string; slug: string; }
interface CompareResult {
    company: { id: string; name: string; slug: string };
    level: string;
    stats: { count: number; medianTc: number; medianBase: number; medianBonus: number; medianStock: number; p25Tc: number; p75Tc: number; };
}

function CompareContent() {
    const searchParams = useSearchParams();
    const [companies, setCompanies] = useState<CompanyOption[]>([]);
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>(searchParams.get("companies")?.split(",").filter(Boolean) ?? []);
    const [role, setRole] = useState(searchParams.get("role") ?? "software-engineer");
    const [level, setLevel] = useState(searchParams.get("level") ?? "L4");
    const [results, setResults] = useState<CompareResult[] | null>(null);
    const [summary, setSummary] = useState<{ highestTc: string; lowestTc: string; differencePercent: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { fetch("/api/companies").then((r) => r.json()).then((d) => setCompanies(d.data ?? [])); }, []);

    async function runComparison() {
        if (selectedCompanies.length < 2) { setError("Select at least 2 companies."); return; }
        setLoading(true); setError(null);
        try {
            const res = await fetch("/api/compare", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role, level, companies: selectedCompanies }) });
            const data = await res.json();
            if (!res.ok) { setError(data.error ?? "No data found."); setResults(null); }
            else { setResults(data.data.results); setSummary(data.data.summary); }
        } catch { setError("Failed to run comparison."); }
        finally { setLoading(false); }
    }

    function toggleCompany(slug: string) {
        setSelectedCompanies((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length < 3 ? [...prev, slug] : prev);
    }

    const barData = results?.map((r) => ({ name: r.company.name, base: r.stats.medianBase, bonus: r.stats.medianBonus, stock: r.stats.medianStock })) ?? [];

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Compare Compensation</h1>
                <p className="text-gray-500 mt-1 text-sm">Select up to 3 companies, a role, and a level to compare side-by-side.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="grid sm:grid-cols-2 gap-5 mb-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {ROLES.map((r) => <option key={r.slug} value={r.slug}>{r.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Level</label>
                        <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.id} — {l.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Companies <span className="text-gray-400 normal-case font-normal">(select up to 3)</span></label>
                    <div className="flex flex-wrap gap-2">
                        {companies.map((c) => {
                            const selected = selectedCompanies.includes(c.slug);
                            const disabled = !selected && selectedCompanies.length >= 3;
                            return (
                                <button key={c.slug} onClick={() => toggleCompany(c.slug)} disabled={disabled}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${selected ? "bg-indigo-600 text-white border-indigo-600" : disabled ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-700"}`}>
                                    {c.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {error && <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">{error}</div>}
                <button onClick={runComparison} disabled={loading || selectedCompanies.length < 2}
                    className="mt-5 w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {loading ? "Comparing…" : "Compare"}
                </button>
            </div>

            {loading && <Spinner />}

            {results && results.length > 0 && (
                <>
                    {summary && summary.differencePercent > 0 && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 text-sm text-indigo-800">
                            <strong>{summary.highestTc}</strong> pays <strong>{summary.differencePercent}% more</strong> than <strong>{summary.lowestTc}</strong> for this role and level.
                        </div>
                    )}
                    <div className={`grid gap-4 mb-6 ${results.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                        {results.map((r) => {
                            const isTop = r.company.name === summary?.highestTc;
                            return (
                                <div key={r.company.slug} className={`bg-white rounded-xl border p-5 relative ${isTop ? "border-indigo-300 shadow-sm" : "border-gray-200"}`}>
                                    {isTop && <span className="absolute -top-3 left-4 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Highest TC</span>}
                                    <div className="font-semibold text-gray-900 text-lg">{r.company.name}</div>
                                    <div className="flex items-center gap-2 mt-1 mb-4"><Badge variant="indigo" size="sm">{r.level}</Badge><span className="text-gray-400 text-xs">{r.stats.count} reports</span></div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-500">Base</span><span className="font-mono text-gray-700">{formatCompact(r.stats.medianBase)}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Bonus</span><span className="font-mono text-gray-500">{r.stats.medianBonus > 0 ? formatCompact(r.stats.medianBonus) : <span className="text-gray-300">—</span>}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Stock/yr</span><span className="font-mono text-gray-500">{r.stats.medianStock > 0 ? formatCompact(r.stats.medianStock) : <span className="text-gray-300">—</span>}</span></div>
                                        <div className="border-t border-gray-100 pt-2 flex justify-between">
                                            <span className="font-semibold text-gray-700">Median TC</span>
                                            <span className={`font-bold font-mono text-lg ${isTop ? "text-indigo-700" : "text-gray-800"}`}>{formatCompact(r.stats.medianTc)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400"><span>P25–P75</span><span className="font-mono">{formatCompact(r.stats.p25Tc)} – {formatCompact(r.stats.p75Tc)}</span></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {barData.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="font-semibold text-gray-900 mb-4">Compensation Breakdown Comparison</h2>
                            <CompensationBarChart data={barData} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default function ComparePage() {
    return <Suspense fallback={<Spinner />}><CompareContent /></Suspense>;
}