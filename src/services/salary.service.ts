import type { SalaryFilters, SalaryListResponse, SalaryEntry } from "@/types/salary.types";
import { buildQueryString } from "@/lib/utils/helpers";

const BASE = "/api/salaries";

export async function fetchSalaries(filters: SalaryFilters = {}): Promise<SalaryListResponse> {
    const res = await fetch(`${BASE}?${buildQueryString(filters as Record<string, unknown>)}`);
    if (!res.ok) throw new Error("Failed to fetch salaries");
    return res.json();
}

export async function fetchSalaryById(id: string): Promise<SalaryEntry> {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) throw new Error("Salary not found");
    const json = await res.json();
    return json.data;
}

export async function submitSalary(data: Record<string, unknown>) {
    const res = await fetch(BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const json = await res.json();
    if (!res.ok) throw json;
    return json.data;
}