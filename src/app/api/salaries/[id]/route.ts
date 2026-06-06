import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const entry = await prisma.salaryEntry.findUnique({ where: { id: params.id }, include: { company: true } });
        if (!entry) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: entry });
    } catch (err) {
        console.error("[GET /api/salaries/:id]", err);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}