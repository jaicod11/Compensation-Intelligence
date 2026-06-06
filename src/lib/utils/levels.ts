import { LEVELS } from "@/constants/levels";

export function getLevelLabel(levelId: string): string {
    return LEVELS.find((l) => l.id === levelId)?.label ?? levelId;
}

export function getLevelOrder(levelId: string): number {
    return LEVELS.find((l) => l.id === levelId)?.order ?? 0;
}

export function getLevelVariant(order: number): "gray" | "indigo" | "green" | "amber" {
    if (order <= 2) return "gray";
    if (order <= 4) return "indigo";
    if (order <= 6) return "green";
    return "amber";
}

export function getLevelYoeLabel(levelId: string): string {
    const level = LEVELS.find((l) => l.id === levelId);
    if (!level) return "";
    const [min, max] = level.yoeRange;
    return `${min}–${max} yrs exp`;
}

export function sortLevels(levelIds: string[]): string[] {
    return [...levelIds].sort((a, b) => getLevelOrder(a) - getLevelOrder(b));
}