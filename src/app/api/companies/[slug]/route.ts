import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { median, percentile } from "@/lib/normalization/compensation";

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
    try {
        const company = await prisma.company.findUnique({ where: { slug: params.slug }, include: { _count: { select: { salaries: true } }, salaries: { orderBy: { reportedAt: "desc" } } } });
        if (!company) return NextResponse.json({ success: false, error: "Company not found" }, { status: 404 });

        const salaries = company.salaries;

        const levelMap = new Map<string, typeof salaries>();
        for (const s of salaries) { const arr = levelMap.get(s.level) ?? []; arr.push(s); levelMap.set(s.level, arr); }
        const levelBreakdowns = Array.from(levelMap.entries()).map(([level, entries]) => {
            const tcs = entries.map((e) => e.totalComp);
            const sortedTc = [...tcs].sort((a, b) => a - b);
            return { level, levelOrder: entries[0].levelOrder, count: entries.length, medianBase: Math.round(median(entries.map((e) => e.baseSalary))), medianBonus: Math.round(median(entries.map((e) => e.bonus))), medianStock: Math.round(median(entries.map((e) => e.stockAnnual))), medianTc: Math.round(median(tcs)), p25Tc: Math.round(percentile(sortedTc, 25)), p75Tc: Math.round(percentile(sortedTc, 75)) };
        }).sort((a, b) => a.levelOrder - b.levelOrder);

        const roleMap = new Map<string, typeof salaries>();
        for (const s of salaries) { const arr = roleMap.get(s.roleSlug) ?? []; arr.push(s); roleMap.set(s.roleSlug, arr); }
        const roleBreakdowns = Array.from(roleMap.entries()).map(([roleSlug, entries]) => ({ role: entries[0].role, roleSlug, count: entries.length, medianTc: Math.round(median(entries.map((e) => e.totalComp))) })).sort((a, b) => b.medianTc - a.medianTc);

        const locationMap = new Map<string, typeof salaries>();
        for (const s of salaries) { const arr = locationMap.get(s.location) ?? []; arr.push(s); locationMap.set(s.location, arr); }
        const locationBreakdowns = Array.from(locationMap.entries()).map(([location, entries]) => ({ location, count: entries.length, medianTc: Math.round(median(entries.map((e) => e.totalComp))) })).sort((a, b) => b.medianTc - a.medianTc);

        const allTcs = salaries.map((s) => s.totalComp);
        return NextResponse.json({ success: true, data: { id: company.id, name: company.name, slug: company.slug, industry: company.industry, hqCity: company.hqCity, hqCountry: company.hqCountry, logoUrl: company.logoUrl, count: company._count.salaries, medianTc: Math.round(median(allTcs)), minTc: Math.min(...allTcs), maxTc: Math.max(...allTcs), levelBreakdowns, roleBreakdowns, locationBreakdowns, recentSalaries: salaries.slice(0, 10) } });
    } catch (err) {
        console.error("[GET /api/companies/:slug]", err);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}