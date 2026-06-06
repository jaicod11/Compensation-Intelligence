"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SalaryTable } from "@/components/salary/SalaryTable";
import { SalaryFilterPanel } from "@/components/salary/SalaryFilterPanel";
import type { SalaryFilters, SalaryListResponse } from "@/types/salary.types";
import { buildQueryString } from "@/lib/utils/helpers";

function SalariesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [result, setResult] = useState<SalaryListResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const filters: SalaryFilters = {
        company: searchParams.get("company") ?? undefined,
        role: searchParams.get("role") ?? undefined,
        level: searchParams.get("level") ?? undefined,
        location: searchParams.get("location") ?? undefined,
        sortBy: (searchParams.get("sortBy") as SalaryFilters["sortBy"]) ?? "totalComp",
        sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc",
        page: Number(searchParams.get("page") ?? 1),
        limit: 25,
    };

    useEffect(() => {
        setLoading(true);
        fetch(`/api/salaries?${buildQueryString(filters as Record<string, unknown>)}`)
            .then((r) => r.json()).then(setResult).catch(console.error).finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.toString()]);

    function updateFilters(updates: Partial<SalaryFilters>) {
        const params = new URLSearchParams(searchParams.toString());
        for (const [k, v] of Object.entries(updates)) {
            if (v !== undefined && v !== null && v !== "") { params.set(k, String(v)); } else { params.delete(k); }
        }
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    }

    function goToPage(page: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Salary Data</h1>
                <p className="text-gray-500 mt-1 text-sm">Real compensation reports — sorted by Total Comp by default.</p>
            </div>
            <div className="mb-6">
                <input type="search" placeholder="Search by company name…" defaultValue={filters.company ?? ""}
                    onChange={(e) => updateFilters({ company: e.target.value.trim() || undefined })}
                    className="w-full sm:max-w-md border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400" />
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
                <aside className="w-full lg:w-56 flex-shrink-0">
                    <SalaryFilterPanel filters={filters} onUpdate={updateFilters} onReset={() => router.push(pathname)} totalResults={result?.total} />
                </aside>
                <div className="flex-1 min-w-0">
                    <SalaryTable salaries={result?.data ?? []} loading={loading} />
                    {result && result.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-sm text-gray-500">
                                Showing {(filters.page! - 1) * filters.limit! + 1}–{Math.min(filters.page! * filters.limit!, result.total)} of {result.total}
                            </span>
                            <div className="flex gap-2">
                                <button disabled={filters.page === 1} onClick={() => goToPage(filters.page! - 1)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">← Prev</button>
                                <span className="px-3 py-1.5 text-sm text-gray-600">{filters.page} / {result.totalPages}</span>
                                <button disabled={filters.page === result.totalPages} onClick={() => goToPage(filters.page! + 1)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next →</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SalariesPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>}>
            <SalariesContent />
        </Suspense>
    );
}