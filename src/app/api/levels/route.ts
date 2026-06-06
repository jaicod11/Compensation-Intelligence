import { NextResponse } from "next/server";
import { LEVELS } from "@/constants/levels";
import { ROLES } from "@/constants/roles";

export async function GET() {
    return NextResponse.json({
        success: true,
        data: {
            levels: LEVELS.map((l) => ({ id: l.id, order: l.order, label: l.label, track: l.track, yoeRange: l.yoeRange })),
            roles: ROLES.map((r) => ({ slug: r.slug, label: r.label, category: r.category })),
        },
    });
}