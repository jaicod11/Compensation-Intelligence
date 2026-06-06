"use client";
import { useState, useEffect } from "react";
import type { CompanyWithStats } from "@/types/company.types";

export function useCompanyData() {
    const [companies, setCompanies] = useState<CompanyWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/companies")
            .then((r) => r.json())
            .then((d) => setCompanies(d.data ?? []))
            .catch(() => setError("Failed to load companies"))
            .finally(() => setLoading(false));
    }, []);

    return { companies, loading, error };
}