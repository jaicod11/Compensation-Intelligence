"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROLES } from "@/constants/roles";
import { LEVELS } from "@/constants/levels";
import { LOCATIONS } from "@/constants/locations";

interface FormState { companyName: string; jobTitle: string; role: string; level: string; location: string; currency: string; baseSalary: string; bonus: string; stockAnnual: string; yearsExperience: string; }
const INITIAL: FormState = { companyName: "", jobTitle: "", role: "software-engineer", level: "L4", location: "Bangalore", currency: "INR", baseSalary: "", bonus: "", stockAnnual: "", yearsExperience: "" };

export function SalarySubmitForm({ onSuccess }: { onSuccess?: () => void }) {
    const router = useRouter();
    const [form, setForm] = useState<FormState>(INITIAL);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    function set(field: keyof FormState, value: string) { setForm((p) => ({ ...p, [field]: value })); setErrors((p) => ({ ...p, [field]: [] })); }

    const totalComp = (parseFloat(form.baseSalary) || 0) + (parseFloat(form.bonus) || 0) + (parseFloat(form.stockAnnual) || 0);
    const selectClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500";
    const locations = LOCATIONS.filter((l) => ["IN", "US", "REMOTE"].includes(l.countryCode));

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setSubmitting(true); setErrors({});
        try {
            const res = await fetch("/api/salaries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ companyName: form.companyName, jobTitle: form.jobTitle, role: form.role, level: form.level, location: form.location, currency: form.currency, baseSalary: parseFloat(form.baseSalary), bonus: parseFloat(form.bonus) || 0, stockAnnual: parseFloat(form.stockAnnual) || 0, yearsExperience: form.yearsExperience ? parseInt(form.yearsExperience) : undefined }) });
            const data = await res.json();
            if (!res.ok) { setErrors(data.details ?? { _root: [data.error ?? "Submission failed"] }); }
            else { setSubmitted(true); onSuccess?.(); setTimeout(() => router.push("/salaries"), 1800); }
        } catch { setErrors({ _root: ["Network error — please try again."] }); }
        finally { setSubmitting(false); }
    }

    if (submitted) return <div className="text-center py-10"><div className="text-5xl mb-3">✅</div><p className="font-semibold text-gray-900">Salary submitted!</p><p className="text-gray-400 text-sm mt-1">Redirecting…</p></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Company *" placeholder="e.g. Google, Razorpay" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} error={errors.companyName?.[0]} required />
                <Input label="Job Title *" placeholder="e.g. SDE-2, Senior PM" value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} error={errors.jobTitle?.[0]} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Role *</label><select value={form.role} onChange={(e) => set("role", e.target.value)} className={selectClass}>{ROLES.map((r) => <option key={r.slug} value={r.slug}>{r.label}</option>)}</select></div>
                <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Level *</label><select value={form.level} onChange={(e) => set("level", e.target.value)} className={selectClass}>{LEVELS.map((l) => <option key={l.id} value={l.id}>{l.id} — {l.label}</option>)}</select></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Location *</label><select value={form.location} onChange={(e) => set("location", e.target.value)} className={selectClass}>{locations.map((l) => <option key={l.city} value={l.city}>{l.city}</option>)}</select></div>
                <Input label="Years of Experience" type="number" min={0} max={50} placeholder="e.g. 4" value={form.yearsExperience} onChange={(e) => set("yearsExperience", e.target.value)} />
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Compensation</p>
                    <select value={form.currency} onChange={(e) => set("currency", e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">{["INR", "USD", "EUR", "GBP", "SGD"].map((c) => <option key={c} value={c}>{c}</option>)}</select>
                </div>
                <Input label="Annual Base Salary *" type="number" min={0} placeholder={form.currency === "INR" ? "e.g. 1800000" : "e.g. 120000"} hint={form.currency === "INR" ? "Enter full amount — e.g. 1800000 for ₹18L" : undefined} value={form.baseSalary} onChange={(e) => set("baseSalary", e.target.value)} error={errors.baseSalary?.[0]} required />
                <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Annual Bonus" type="number" min={0} placeholder="e.g. 200000" hint="Leave blank if none" value={form.bonus} onChange={(e) => set("bonus", e.target.value)} />
                    <Input label="Stock (annualized)" type="number" min={0} placeholder="e.g. 600000" hint="Total RSU grant ÷ 4 years" value={form.stockAnnual} onChange={(e) => set("stockAnnual", e.target.value)} />
                </div>
                {totalComp > 0 && <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4"><p className="text-xs text-indigo-600 font-medium mb-0.5">Total Compensation Preview</p><p className="text-2xl font-bold font-mono text-indigo-700">{form.currency === "INR" ? "₹" : "$"}{totalComp.toLocaleString("en-IN")}</p><p className="text-xs text-indigo-400 mt-0.5">= base + bonus + stock/yr</p></div>}
            </div>
            {errors._root && <p className="text-sm text-red-600">{errors._root[0]}</p>}
            <Button type="submit" fullWidth size="lg" loading={submitting}>Submit Salary</Button>
            <p className="text-center text-xs text-gray-400">Submissions are completely anonymous.</p>
        </form>
    );
}