"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLES } from "@/constants/roles";
import { LEVELS } from "@/constants/levels";
import { LOCATIONS } from "@/constants/locations";

interface FormData {
    companyName: string; jobTitle: string; role: string; level: string;
    location: string; currency: string; baseSalary: string; bonus: string;
    stockAnnual: string; yearsExperience: string;
}

const INITIAL: FormData = { companyName: "", jobTitle: "", role: "software-engineer", level: "L4", location: "Bangalore", currency: "INR", baseSalary: "", bonus: "", stockAnnual: "", yearsExperience: "" };

function inputClass(hasError: boolean) {
    return `w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-colors ${hasError ? "border-red-300 focus:ring-red-400" : "border-gray-200 focus:ring-indigo-500"}`;
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {hint && <p className="text-xs text-gray-400">{hint}</p>}
            {children}
            {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
        </div>
    );
}

export default function SubmitPage() {
    const router = useRouter();
    const [form, setForm] = useState<FormData>(INITIAL);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    function set(field: keyof FormData, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: [] }));
    }

    const totalComp = (parseFloat(form.baseSalary) || 0) + (parseFloat(form.bonus) || 0) + (parseFloat(form.stockAnnual) || 0);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setSubmitting(true); setErrors({});
        try {
            const res = await fetch("/api/salaries", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: form.companyName, jobTitle: form.jobTitle, role: form.role,
                    level: form.level, location: form.location, currency: form.currency,
                    baseSalary: parseFloat(form.baseSalary), bonus: parseFloat(form.bonus) || 0,
                    stockAnnual: parseFloat(form.stockAnnual) || 0,
                    yearsExperience: form.yearsExperience ? parseInt(form.yearsExperience) : undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) { setErrors(data.details ?? { _: [data.error ?? "Submission failed"] }); }
            else { setSuccess(true); setTimeout(() => router.push("/salaries"), 2000); }
        } catch { setErrors({ _: ["Network error — please try again."] }); }
        finally { setSubmitting(false); }
    }

    if (success) {
        return (
            <div className="max-w-lg mx-auto px-4 py-20 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h2>
                <p className="text-gray-500 text-sm">Your salary has been submitted. Redirecting…</p>
            </div>
        );
    }

    const locations = LOCATIONS.filter((l) => ["IN", "US", "REMOTE"].includes(l.countryCode));
    const selectClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500";

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Add Your Salary</h1>
                <p className="text-gray-500 mt-1 text-sm">Submissions are anonymous. Fields marked * are required.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                    <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Role Information</h2>
                    <Field label="Company *" error={errors.companyName?.[0]}>
                        <input type="text" placeholder="e.g. Google, Flipkart, Razorpay" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} required className={inputClass(!!errors.companyName?.[0])} />
                    </Field>
                    <Field label="Job Title *" error={errors.jobTitle?.[0]}>
                        <input type="text" placeholder="e.g. Senior Software Engineer, SDE-2" value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} required className={inputClass(!!errors.jobTitle?.[0])} />
                    </Field>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Role *"><select value={form.role} onChange={(e) => set("role", e.target.value)} className={selectClass}>{ROLES.map((r) => <option key={r.slug} value={r.slug}>{r.label}</option>)}</select></Field>
                        <Field label="Level *" hint="Use the standard level — not the job title level"><select value={form.level} onChange={(e) => set("level", e.target.value)} className={selectClass}>{LEVELS.map((l) => <option key={l.id} value={l.id}>{l.id} — {l.label}</option>)}</select></Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Location *"><select value={form.location} onChange={(e) => set("location", e.target.value)} className={selectClass}>{locations.map((l) => <option key={l.city} value={l.city}>{l.city}</option>)}</select></Field>
                        <Field label="Years of Experience"><input type="number" placeholder="e.g. 4" min={0} max={50} value={form.yearsExperience} onChange={(e) => set("yearsExperience", e.target.value)} className={inputClass(false)} /></Field>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Compensation</h2>
                        <select value={form.currency} onChange={(e) => set("currency", e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {["INR", "USD", "EUR", "GBP", "SGD"].map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <Field label="Annual Base Salary *" error={errors.baseSalary?.[0]} hint={form.currency === "INR" ? "Enter in ₹ — e.g. 1800000 for ₹18L" : "Enter in full — e.g. 120000 for $120K"}>
                        <input type="number" placeholder={form.currency === "INR" ? "e.g. 1800000" : "e.g. 120000"} min={0} value={form.baseSalary} onChange={(e) => set("baseSalary", e.target.value)} required className={inputClass(!!errors.baseSalary?.[0])} />
                    </Field>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Annual Bonus" hint="Leave blank if none"><input type="number" placeholder="e.g. 200000" min={0} value={form.bonus} onChange={(e) => set("bonus", e.target.value)} className={inputClass(false)} /></Field>
                        <Field label="Stock (annualized)" hint="Total RSU grant ÷ 4 years"><input type="number" placeholder="e.g. 600000" min={0} value={form.stockAnnual} onChange={(e) => set("stockAnnual", e.target.value)} className={inputClass(false)} /></Field>
                    </div>
                    {totalComp > 0 && (
                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                            <div className="text-xs text-indigo-600 font-medium mb-1">Total Compensation Preview</div>
                            <div className="text-2xl font-bold font-mono text-indigo-700">{form.currency === "INR" ? "₹" : "$"}{totalComp.toLocaleString("en-IN")}</div>
                            <div className="text-xs text-indigo-500 mt-0.5">= base + bonus + stock/yr</div>
                        </div>
                    )}
                </div>

                {errors._ && <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">{errors._.join(", ")}</div>}
                <button type="submit" disabled={submitting} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm">
                    {submitting ? "Submitting…" : "Submit Salary"}
                </button>
                <p className="text-center text-xs text-gray-400">Submissions are anonymous. No personally identifiable information is collected.</p>
            </form>
        </div>
    );
}