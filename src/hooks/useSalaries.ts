"use client";
import { useState, useEffect, useCallback } from "react";
import type { SalaryFilters, SalaryListResponse } from "@/types/salary.types";
import { fetchSalaries } from "@/services/salary.service";

export function useSalaries(initialFilters: SalaryFilters = {}) {
    const [filters, setFilters] = useState<SalaryFilters>(initialFilters);
    const [data, setData] = useState<SalaryListResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async (f: SalaryFilters) => {
        setLoading(true);
        setError(null);
        try {
            setData(await fetchSalaries(f));
        } catch {
            setError("Failed to load salaries");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(filters); }, [filters, load]);

    const updateFilters = useCallback((updates: Partial<SalaryFilters>) => {
        setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({ sortBy: "totalComp", sortOrder: "desc", page: 1, limit: 25 });
    }, []);

    return { data, loading, error, filters, updateFilters, resetFilters };
}