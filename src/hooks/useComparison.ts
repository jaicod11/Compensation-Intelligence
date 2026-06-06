"use client";
import { useState, useCallback } from "react";
import type { ComparisonQuery, ComparisonResponse } from "@/types/comparison.types";
import { compareCompensation } from "@/services/comparison.service";

export function useComparison() {
    const [result, setResult] = useState<ComparisonResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const compare = useCallback(async (query: ComparisonQuery) => {
        setLoading(true);
        setError(null);
        try {
            setResult(await compareCompensation(query));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Comparison failed");
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => { setResult(null); setError(null); }, []);

    return { result, loading, error, compare, reset };
}