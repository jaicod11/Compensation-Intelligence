import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { median } from "@/lib/normalization/compensation";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const industry = searchParams.get("industry") ?? undefined;
        const search = searchParams.get("search") ?? undefined;

        const companies = await prisma.company.findMany({
            where: { ...(industry ? { industry } : {}), ...(search ? { name: { contains: search, mode: "insensitive" } } : {}) },
            include: { _count: { select: { salaries: true } }, salaries: { select: { totalComp: true, baseSalary: true } } },
            orderBy: { name: "asc" },
        });

        const result = companies.filter((c) => c._count.salaries > 0).map((company) => {
            const tcs = company.salaries.map((s) => s.totalComp);
            const bases = company.salaries.map((s) => s.baseSalary);
            const sortedTc = [...tcs].sort((a, b) => a - b);
            return { id: company.id, name: company.name, slug: company.slug, industry: company.industry, hqCity: company.hqCity, hqCountry: company.hqCountry, count: company._count.salaries, medianTc: Math.round(median(tcs)), medianBase: Math.round(median(bases)), minTc: sortedTc[0] ?? 0, maxTc: sortedTc[sortedTc.length - 1] ?? 0 };
        }).sort((a, b) => b.medianTc - a.medianTc);

        return NextResponse.json({ success: true, data: result });
    } catch (err) {
        console.error("[GET /api/companies]", err);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}