import { LevelProgressionChart } from "@/components/charts/LevelProgressionChart";
import type { LevelBreakdown } from "@/types/company.types";

export function CompanyLevelChart({ levelBreakdowns, currency = "INR" }: { levelBreakdowns: LevelBreakdown[]; currency?: string }) {
    if (levelBreakdowns.length < 2) return <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Not enough level data to display chart</div>;
    return <LevelProgressionChart levels={levelBreakdowns} currency={currency} />;
}