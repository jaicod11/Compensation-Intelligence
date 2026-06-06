export function calculateTotalComp(baseSalary: number, bonus = 0, stockAnnual = 0): number {
    return baseSalary + bonus + stockAnnual;
}

export function annualizeStockGrant(totalGrant: number, vestingYears = 4): number {
    if (vestingYears <= 0) return 0;
    return totalGrant / vestingYears;
}

export function percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    if (sorted.length === 1) return sorted[0];
    const idx = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (idx - lower) * (sorted[upper] - sorted[lower]);
}

export function median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    return percentile(sorted, 50);
}

export function computeStats(tcValues: number[]) {
    if (tcValues.length === 0) {
        return { count: 0, medianTc: 0, p10Tc: 0, p25Tc: 0, p75Tc: 0, p90Tc: 0, minTc: 0, maxTc: 0 };
    }
    const sorted = [...tcValues].sort((a, b) => a - b);
    return {
        count: sorted.length,
        medianTc: Math.round(percentile(sorted, 50)),
        p10Tc: Math.round(percentile(sorted, 10)),
        p25Tc: Math.round(percentile(sorted, 25)),
        p75Tc: Math.round(percentile(sorted, 75)),
        p90Tc: Math.round(percentile(sorted, 90)),
        minTc: sorted[0],
        maxTc: sorted[sorted.length - 1],
    };
}