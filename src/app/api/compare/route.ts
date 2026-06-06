import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { median, computeStats } from "@/lib/normalization/compensation";

const compareSchema = z.object({ role: z.string().min(1), level: z.string().min(1), location: z.string().optional(), companies: z.array(z.string()).min(2).max(3) });

export async function POST(request: NextRequest) {
    try {
        const parsed = compareSchema.safeParse(await request.json());
        if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });

        const { role, level, location, companies } = parsed.data;
        const results = await Promise.all(companies.map(async (slug) => {
            const company = await prisma.company.findUnique({ where: { slug } });
            if (!company) return null;
            const salaries = await prisma.salaryEntry.findMany({ where: { companyId: company.id, roleSlug: role, level: { contains: level, mode: "insensitive" }, ...(location ? { location: { contains: location, mode: "insensitive" } } : {}) } });
            const tcValues = salaries.map((s) => s.totalComp);
            return { company: { id: company.id, name: company.name, slug: company.slug }, role, level, location: location ?? null, stats: { ...computeStats(tcValues), medianBase: Math.round(median(salaries.map((s) => s.baseSalary))), medianBonus: Math.round(median(salaries.map((s) => s.bonus))), medianStock: Math.round(median(salaries.map((s) => s.stockAnnual))) }, samples: salaries.slice(0, 5) };
        }));

        const validResults = results.filter(Boolean);
        if (validResults.length === 0) return NextResponse.json({ success: false, error: "No data found for comparison" }, { status: 404 });

        const sorted = [...validResults].sort((a, b) => (b!.stats.medianTc ?? 0) - (a!.stats.medianTc ?? 0));
        const highest = sorted[0]!;
        const lowest = sorted[sorted.length - 1]!;
        const diff = highest.stats.medianTc > 0 && lowest.stats.medianTc > 0 ? Math.round(((highest.stats.medianTc - lowest.stats.medianTc) / lowest.stats.medianTc) * 100) : 0;

        return NextResponse.json({ success: true, data: { results: validResults, summary: { highestTc: highest.company.name, lowestTc: lowest.company.name, differencePercent: diff } } });
    } catch (err) {
        console.error("[POST /api/compare]", err);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}