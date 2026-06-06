"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCompact } from "@/lib/utils/currency";

interface BarData { name: string; base: number; bonus: number; stock: number; }

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    const total = payload.reduce((sum: number, p: any) => sum + (p.value ?? 0), 0);
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
            <p className="font-semibold text-gray-800 mb-2">{label}</p>
            {payload.map((p: any) => (<div key={p.name} className="flex justify-between gap-6"><span style={{ color: p.fill }} className="capitalize">{p.name}</span><span className="font-mono text-gray-700">{formatCompact(p.value)}</span></div>))}
            <div className="border-t border-gray-100 mt-1.5 pt-1.5 flex justify-between"><span className="font-medium text-gray-700">Total TC</span><span className="font-mono font-semibold text-indigo-700">{formatCompact(total)}</span></div>
        </div>
    );
}

export function CompensationBarChart({ data, currency = "INR" }: { data: BarData[]; currency?: string }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => formatCompact(v, currency)} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={56} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="base" name="Base" stackId="tc" fill="#818cf8" radius={[0, 0, 0, 0]} />
                <Bar dataKey="bonus" name="Bonus" stackId="tc" fill="#a5b4fc" />
                <Bar dataKey="stock" name="Stock" stackId="tc" fill="#c7d2fe" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}