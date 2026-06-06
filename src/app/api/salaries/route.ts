import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { salarySubmitSchema, salaryFilterSchema } from "@/lib/validations/salary.schema";
import { normalizeCompanyName } from "@/lib/normalization/company";
import { calculateTotalComp } from "@/lib/normalization/compensation";
import { normalizeRole } from "@/constants/roles";
import { normalizeLevel, getLevelOrder } from "@/constants/levels";
import { normalizeLocation } from "@/constants/locations";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
    try {
        const rawParams = Object.fromEntries(new URL(request.url).searchParams.entries());
        const parsed = salaryFilterSchema.safeParse(rawParams);
        if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid query parameters", details: parsed.error.flatten().fieldErrors }, { status: 400 });

        const { company, role, level, location, minTc, maxTc, sortBy, sortOrder, page, limit } = parsed.data;
        const where: Prisma.SalaryEntryWhereInput = {};
        if (company) where.company = { slug: company };
        if (role) where.roleSlug = role;
        if (level) where.level = { contains: level, mode: "insensitive" };
        if (location) where.location = { contains: location, mode: "insensitive" };
        if (minTc !== undefined || maxTc !== undefined) {
            where.totalComp = {};
            if (minTc !== undefined) where.totalComp.gte = minTc;
            if (maxTc !== undefined) where.totalComp.lte = maxTc;
        }
        const skip = (page - 1) * limit;
        const [total, data] = await Promise.all([
            prisma.salaryEntry.count({ where }),
            prisma.salaryEntry.findMany({ where, include: { company: { select: { id: true, name: true, slug: true, industry: true } } }, orderBy: { [sortBy]: sortOrder }, skip, take: limit }),
        ]);
        return NextResponse.json({ success: true, data, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        console.error("[GET /api/salaries]", err);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const parsed = salarySubmitSchema.safeParse(await request.json());
        if (!parsed.success) return NextResponse.json({ success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors }, { status: 422 });

        const input = parsed.data;
        const { name: companyName, slug: companySlug } = normalizeCompanyName(input.companyName);
        const company = await prisma.company.upsert({ where: { slug: companySlug }, update: {}, create: { name: companyName, slug: companySlug } });
        const { role, roleSlug } = normalizeRole(input.role);
        const normalizedLevel = normalizeLevel(input.level);
        const levelOrder = getLevelOrder(normalizedLevel);
        const normalizedLocation = normalizeLocation(input.location);
        const bonus = input.bonus ?? 0;
        const stockAnnual = input.stockAnnual ?? 0;
        const totalComp = calculateTotalComp(input.baseSalary, bonus, stockAnnual);

        const entry = await prisma.salaryEntry.create({
            data: { companyId: company.id, jobTitle: input.jobTitle.trim(), role, roleSlug, level: normalizedLevel, levelOrder, levelTrack: "IC", yearsExperience: input.yearsExperience ?? null, location: normalizedLocation, country: input.currency === "USD" ? "USA" : "India", currency: input.currency, baseSalary: input.baseSalary, bonus, stockAnnual, totalComp },
            include: { company: true },
        });
        return NextResponse.json({ success: true, data: entry }, { status: 201 });
    } catch (err) {
        console.error("[POST /api/salaries]", err);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}