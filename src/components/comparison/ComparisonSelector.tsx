"use client";
import { ROLES } from "@/constants/roles";
import { LEVELS } from "@/constants/levels";
import { Button } from "@/components/ui/Button";

interface CompanyOption { id: string; name: string; slug: string; }
interface ComparisonSelectorProps { companies: CompanyOption[]; selectedCompanies: string[]; role: string; level: string; onToggleCompany: (slug: string) => void; onRoleChange: (role: string) => void; onLevelChange: (level: string) => void; onCompare: () => void; loading?: boolean; error?: string | null; }

export function ComparisonSelector({ companies, selectedCompanies, role, level, onToggleCompany, onRoleChange, onLevelChange, onCompare, loading, error }: ComparisonSelectorProps) {
    const selectClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500";
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Role</label><select value={role} onChange={(e) => onRoleChange(e.target.value)} className={selectClass}>{ROLES.map((r) => <option key={r.slug} value={r.slug}>{r.label}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Level</label><select value={level} onChange={(e) => onLevelChange(e.target.value)} className={selectClass}>{LEVELS.map((l) => <option key={l.id} value={l.id}>{l.id} — {l.label}</option>)}</select></div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Companies <span className="text-gray-400 normal-case font-normal">(select 2–3)</span></label>
                <div className="flex flex-wrap gap-2">
                    {companies.map((c) => { const selected = selectedCompanies.includes(c.slug); const maxed = !selected && selectedCompanies.length >= 3; return <button key={c.slug} onClick={() => onToggleCompany(c.slug)} disabled={maxed} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${selected ? "bg-indigo-600 text-white border-indigo-600" : maxed ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-700"}`}>{c.name}</button>; })}
                </div>
                {selectedCompanies.length > 0 && <p className="text-xs text-gray-400">{selectedCompanies.length} selected · {3 - selectedCompanies.length} remaining</p>}
            </div>
            {error && <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">{error}</div>}
            <Button onClick={onCompare} disabled={selectedCompanies.length < 2} loading={loading} size="md">Compare →</Button>
        </div>
    );
}