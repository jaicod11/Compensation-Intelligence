"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCompact } from "@/lib/utils/currency";

interface LocationData { location: string; medianTc: number; count: number; }

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm"><p className="font-semibold text-gray-800 mb-1">{label}</p><p className="text-indigo-700 font-mono font-medium">{formatCompact(payload[0].value)}</p><p className="text-gray-400 text-xs">{payload[0].payload.count} reports</p></div>;
}

export function LocationComparisonChart({ data, currency = "INR" }: { data: LocationData[]; currency?: string }) {
    if (!data || data.length === 0) return <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No location data available</div>;
    const sorted = [...data].sort((a, b) => b.medianTc - a.medianTc);
    return (
        <ResponsiveContainer width="100%" height={Math.max(180, sorted.length * 44)}>
            <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 60, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => formatCompact(v, currency)} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="location" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="medianTc" fill="#818cf8" radius={[0, 4, 4, 0]} label={{ position: "right", formatter: (v: number) => formatCompact(v, currency), style: { fontSize: 11, fill: "#4f46e5", fontFamily: "monospace" } }} />
            </BarChart>
        </ResponsiveContainer>
    );
}