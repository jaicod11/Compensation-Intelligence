"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCompact } from "@/lib/utils/currency";
import type { LevelBreakdown } from "@/types/company.types";

export function LevelProgressionChart({ levels, currency = "INR" }: { levels: LevelBreakdown[]; currency?: string }) {
    const data = levels.map((l) => ({ level: l.level, "Median TC": l.medianTc, "P25": l.p25Tc, "P75": l.p75Tc }));
    return (
        <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="level" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => formatCompact(v, currency)} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={56} />
                <Tooltip formatter={(value: number) => formatCompact(value, currency)} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }} />
                <Line dataKey="P25" stroke="#c7d2fe" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
                <Line dataKey="Median TC" stroke="#4f46e5" strokeWidth={2.5} dot={{ fill: "#4f46e5", r: 3 }} />
                <Line dataKey="P75" stroke="#c7d2fe" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
            </LineChart>
        </ResponsiveContainer>
    );
}