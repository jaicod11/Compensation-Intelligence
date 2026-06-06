"use client";
import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const getFilter = useCallback((key: string) => searchParams.get(key) ?? undefined, [searchParams]);

    const setFilter = useCallback((key: string, value: string | undefined) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) { params.set(key, value); } else { params.delete(key); }
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    }, [router, pathname, searchParams]);

    const setFilters = useCallback((updates: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(updates)) {
            if (value) { params.set(key, value); } else { params.delete(key); }
        }
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    }, [router, pathname, searchParams]);

    const clearFilters = useCallback(() => { router.push(pathname); }, [router, pathname]);

    return { getFilter, setFilter, setFilters, clearFilters, allFilters: Object.fromEntries(searchParams.entries()) };
}