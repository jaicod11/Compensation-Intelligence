import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toSlug(str: string): string {
    return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function titleCase(str: string): string {
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatMonth(date: Date | string): string {
    return new Date(date).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export function timeAgo(date: Date | string): string {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86_400_000);
    if (days < 1) return "today";
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}yr ago`;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function buildQueryString(params: Record<string, unknown>): string {
    const sp = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") sp.set(key, String(value));
    }
    return sp.toString();
}