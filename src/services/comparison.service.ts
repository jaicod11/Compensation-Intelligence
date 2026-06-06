import type { ComparisonQuery, ComparisonResponse } from "@/types/comparison.types";

export async function compareCompensation(query: ComparisonQuery): Promise<ComparisonResponse> {
    const res = await fetch("/api/compare", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(query) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "Comparison failed");
    return json.data;
}