export interface SalaryEntry {
    id: string;
    companyId: string;
    company?: CompanyBasic;
    jobTitle: string;
    role: string;
    roleSlug: string;
    level: string;
    levelOrder: number;
    levelTrack: "IC" | "M";
    yearsExperience: number | null;
    location: string;
    country: string;
    currency: string;
    baseSalary: number;
    bonus: number;
    stockAnnual: number;
    totalComp: number;
    reportedAt: string;
    isVerified: boolean;
}

export interface CompanyBasic {
    id: string;
    name: string;
    slug: string;
    industry: string | null;
}

export interface SalaryFilters {
    company?: string;
    role?: string;
    level?: string;
    location?: string;
    minTc?: number;
    maxTc?: number;
    currency?: string;
    sortBy?: "totalComp" | "baseSalary" | "reportedAt" | "levelOrder";
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
}

export interface SalaryListResponse {
    data: SalaryEntry[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface SalarySubmitInput {
    companyName: string;
    jobTitle: string;
    role: string;
    level: string;
    location: string;
    currency: string;
    baseSalary: number;
    bonus?: number;
    stockAnnual?: number;
    yearsExperience?: number;
}