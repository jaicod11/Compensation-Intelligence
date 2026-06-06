import type { CompanyWithStats, CompanyDetail } from "@/types/company.types";

export async function fetchCompanies(params: { search?: string; industry?: string } = {}): Promise<CompanyWithStats[]> {
    const sp = new URLSearchParams();
    if (params.search) sp.set("search", params.search);
    if (params.industry) sp.set("industry", params.industry);
    const res = await fetch(`/api/companies?${sp}`);
    if (!res.ok) throw new Error("Failed to fetch companies");
    return (await res.json()).data;
}

export async function fetchCompanyBySlug(slug: string): Promise<CompanyDetail> {
    const res = await fetch(`/api/companies/${slug}`);
    if (!res.ok) throw new Error("Company not found");
    return (await res.json()).data;
}