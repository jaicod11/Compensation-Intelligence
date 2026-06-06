"use client";
import { ROLES } from "@/constants/roles";
import { LEVELS } from "@/constants/levels";
import { LOCATIONS } from "@/constants/locations";
import type { SalaryFilters } from "@/types/salary.types";

interface SalaryFilterPanelProps { filters: SalaryFilters; onUpdate: (updates: Partial<SalaryFilters>) => void; onReset: () => void; totalResults?: number; }

export function SalaryFilterPanel({ filters, onUpdate, onReset, totalResults }: SalaryFilterPanelProps) {
    const indianLocations = LOCATIONS.filter((l) => l.countryCode === "IN");
    const selectClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500";

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5 sticky top-20">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 text-sm">Filters</h2>
                {totalResults !== undefined && <span className="text-xs text-gray-400">{totalResults} results</span>}
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Role</label>
                <select value={filters.role ?? ""} onChange={(e) => onUpdate({ role: e.target.value || undefined })} className={selectClass}>
                    <option value="">All Roles</option>
                    {ROLES.map((r) => <option key={r.slug} value={r.slug}>{r.label}</option>)}
                </select>
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Level</label>
                <select value={filters.level ?? ""} onChange={(e) => onUpdate({ level: e.target.value || undefined })} className={selectClass}>
                    <option value="">All Levels</option>
                    {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.id} — {l.label}</option>)}
                </select>
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Location</label>
                <select value={filters.location ?? ""} onChange={(e) => onUpdate({ location: e.target.value || undefined })} className={selectClass}>
                    <option value="">All Locations</option>
                    {indianLocations.map((l) => <option key={l.city} value={l.city}>{l.city}</option>)}
                </select>
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Sort by</label>
                <select value={filters.sortBy ?? "totalComp"} onChange={(e) => onUpdate({ sortBy: e.target.value as SalaryFilters["sortBy"] })} className={selectClass}>
                    <option value="totalComp">Total Comp</option>
                    <option value="baseSalary">Base Salary</option>
                    <option value="levelOrder">Level</option>
                    <option value="reportedAt">Most Recent</option>
                </select>
            </div>
            <button onClick={onReset} className="w-full text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg py-2 transition-colors hover:bg-gray-50">Reset filters</button>
        </div>
    );
}