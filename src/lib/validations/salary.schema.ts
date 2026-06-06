import { z } from "zod";

export const salarySubmitSchema = z.object({
    companyName: z.string().min(1, "Company name is required").max(100).trim(),
    jobTitle: z.string().min(1, "Job title is required").max(120).trim(),
    role: z.string().min(1, "Role is required").max(100).trim(),
    level: z.string().min(1, "Level is required").max(20).trim(),
    location: z.string().min(1, "Location is required").max(100).trim(),
    currency: z.enum(["INR", "USD", "EUR", "GBP", "AED", "SGD"]).default("INR"),
    baseSalary: z.number({ required_error: "Base salary is required" }).positive().max(100_000_000),
    bonus: z.number().min(0).optional().default(0),
    stockAnnual: z.number().min(0).optional().default(0),
    yearsExperience: z.number().int().min(0).max(50).optional(),
});

export type SalarySubmitInput = z.infer<typeof salarySubmitSchema>;

export const salaryFilterSchema = z.object({
    company: z.string().optional(),
    role: z.string().optional(),
    level: z.string().optional(),
    location: z.string().optional(),
    minTc: z.coerce.number().optional(),
    maxTc: z.coerce.number().optional(),
    currency: z.string().optional(),
    sortBy: z.enum(["totalComp", "baseSalary", "reportedAt", "levelOrder"]).optional().default("totalComp"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(25),
});

export type SalaryFilterInput = z.infer<typeof salaryFilterSchema>;