export interface Role {
    slug: string;
    label: string;
    aliases: string[];
    category: "Engineering" | "Product" | "Design" | "Data" | "Operations";
}

export const ROLES: Role[] = [
    { slug: "software-engineer", label: "Software Engineer", category: "Engineering", aliases: ["software engineer", "swe", "sde", "software development engineer", "software developer", "backend engineer", "frontend engineer", "full stack engineer", "engineer", "member of technical staff", "mts"] },
    { slug: "product-manager", label: "Product Manager", category: "Product", aliases: ["product manager", "pm", "senior product manager", "group product manager", "director of product", "program manager"] },
    { slug: "data-scientist", label: "Data Scientist", category: "Data", aliases: ["data scientist", "ml engineer", "machine learning engineer", "research scientist", "applied scientist"] },
    { slug: "data-engineer", label: "Data Engineer", category: "Data", aliases: ["data engineer", "analytics engineer"] },
    { slug: "devops-engineer", label: "DevOps / SRE", category: "Engineering", aliases: ["devops engineer", "sre", "site reliability engineer", "infrastructure engineer", "cloud engineer"] },
    { slug: "design", label: "Designer", category: "Design", aliases: ["product designer", "ux designer", "ui designer", "ux/ui designer", "visual designer"] },
    { slug: "engineering-manager", label: "Engineering Manager", category: "Engineering", aliases: ["engineering manager", "em", "engineering lead", "team lead", "tech lead manager"] },
];

export function normalizeRole(raw: string): { role: string; roleSlug: string } {
    const lower = raw.toLowerCase().trim();
    for (const role of ROLES) {
        if (role.aliases.some((a) => a.toLowerCase() === lower)) {
            return { role: role.label, roleSlug: role.slug };
        }
    }
    const slug = lower.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    return { role: raw, roleSlug: slug };
}