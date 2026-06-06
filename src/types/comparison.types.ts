import type { SalaryEntry } from "./salary.types";

export interface ComparisonQuery {
    role: string;
    level: string;
    location?: string;
    companies?: string[];
}

export interface CompensationStats {
    count: number;
    medianBase: number;
    medianBonus: number;
    medianStock: number;
    medianTc: number;
    p10Tc: number;
    p25Tc: number;
    p75Tc: number;
    p90Tc: number;
    minTc: number;
    maxTc: number;
}

export interface ComparisonResult {
    company: { id: string; name: string; slug: string };
    role: string;
    level: string;
    location: string | null;
    stats: CompensationStats;
    samples: SalaryEntry[];
}

export interface ComparisonResponse {
    results: ComparisonResult[];
    summary: {
        highestTc: string;
        lowestTc: string;
        differencePercent: number;
    };
}