export interface Level {
    id: string;
    order: number;
    label: string;
    track: "IC" | "M" | "both";
    aliases: string[];
    yoeRange: [number, number];
}

export const LEVELS: Level[] = [
    { id: "L1", order: 1, label: "Intern / New Grad", track: "IC", aliases: ["L1", "intern", "fresher", "new grad", "trainee", "assistant system engineer"], yoeRange: [0, 1] },
    { id: "L2", order: 2, label: "Junior", track: "IC", aliases: ["L2", "SDE1", "SWE1", "SE1", "junior engineer", "system engineer", "software engineer 1"], yoeRange: [1, 3] },
    { id: "L3", order: 3, label: "Mid-Level", track: "IC", aliases: ["L3", "SDE2", "SWE2", "SE2", "SWE-II", "software engineer 2", "software engineer III", "IC3"], yoeRange: [3, 5] },
    { id: "L4", order: 4, label: "Senior", track: "IC", aliases: ["L4", "SDE3", "SWE3", "SE3", "SWE-III", "senior engineer", "senior sde", "senior software engineer", "software engineer IV", "IC4", "program manager"], yoeRange: [5, 8] },
    { id: "L5", order: 5, label: "Staff / Lead", track: "both", aliases: ["L5", "SDE4", "IC5", "staff engineer", "staff sde", "lead engineer", "tech lead", "software engineer V", "principal"], yoeRange: [8, 12] },
    { id: "L6", order: 6, label: "Principal / Sr. Staff", track: "both", aliases: ["L6", "SDE5", "IC6", "principal engineer", "principal sde", "staff software engineer", "distinguished engineer"], yoeRange: [12, 16] },
    { id: "L7", order: 7, label: "Distinguished / Fellow", track: "IC", aliases: ["L7", "distinguished engineer", "fellow"], yoeRange: [16, 25] },
    { id: "M1", order: 8, label: "Engineering Manager", track: "M", aliases: ["M1", "engineering manager", "em", "manager"], yoeRange: [6, 10] },
    { id: "M2", order: 9, label: "Senior Manager", track: "M", aliases: ["M2", "senior manager", "senior engineering manager"], yoeRange: [10, 15] },
];

export function normalizeLevel(raw: string): string {
    const lower = raw.toLowerCase().trim();
    for (const level of LEVELS) {
        if (level.aliases.some((a) => a.toLowerCase() === lower)) return level.id;
    }
    return raw.toUpperCase();
}

export function getLevelOrder(levelId: string): number {
    return LEVELS.find((l) => l.id === levelId)?.order ?? 0;
}

export function getLevelLabel(levelId: string): string {
    return LEVELS.find((l) => l.id === levelId)?.label ?? levelId;
}