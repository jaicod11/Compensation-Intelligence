export interface Company {
    id: string;
    name: string;
    slug: string;
    industry: string | null;
    hqCity: string | null;
    hqCountry: string | null;
    logoUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CompanyWithStats extends Company {
    _count: { salaries: number };
    medianTc: number;
    minTc: number;
    maxTc: number;
}

export interface LevelBreakdown {
    level: string;
    levelOrder: number;
    count: number;
    medianBase: number;
    medianBonus: number;
    medianStock: number;
    medianTc: number;
    p25Tc: number;
    p75Tc: number;
}

export interface CompanyDetail extends CompanyWithStats {
    levelBreakdowns: LevelBreakdown[];
    roleBreakdowns: RoleBreakdown[];
    locationBreakdowns: LocationBreakdown[];
    recentSalaries: import("./salary.types").SalaryEntry[];
}

export interface RoleBreakdown {
    role: string;
    roleSlug: string;
    count: number;
    medianTc: number;
}

export interface LocationBreakdown {
    location: string;
    count: number;
    medianTc: number;
}