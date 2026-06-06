import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { median } from "@/lib/normalization/compensation";

export async function GET() {
    try {
        const [totalEntries, totalCompanies, roleStats, topCompanies, locationStats] = await Promise.all([
            prisma.salaryEntry.count(),
            prisma.company.count(),
            prisma.salaryEntry.groupBy({ by: ["role", "roleSlug"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
            prisma.company.findMany({ include: { _count: { select: { salaries: true } }, salaries: { select: { totalComp: true } } }, orderBy: { salaries: { _count: "desc" } }, take: 10 }),
            prisma.salaryEntry.groupBy({ by: ["location"], _count: { id: true }, orderBy: { _count: { id: "desc" } }, take: 10 }),
        ]);

        const medianTcByRole = await Promise.all(roleStats.slice(0, 8).map(async (r) => {
            const entries = await prisma.salaryEntry.findMany({ where: { roleSlug: r.roleSlug }, select: { totalComp: true } });
            return { role: r.role, medianTc: Math.round(median(entries.map((e) => e.totalComp))), count: r._count.id };
        }));

        const topCompaniesByTc = topCompanies.filter((c) => c.salaries.length > 0).map((c) => ({ company: c.name, slug: c.slug, medianTc: Math.round(median(c.salaries.map((s) => s.totalComp))), count: c._count.salaries })).sort((a, b) => b.medianTc - a.medianTc).slice(0, 8);

        return NextResponse.json({ success: true, data: { totalEntries, totalCompanies, totalRoles: roleStats.length, totalLocations: locationStats.length, medianTcByRole, topCompaniesByTc } });
    } catch (err) {
        console.error("[GET /api/stats]", err);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}