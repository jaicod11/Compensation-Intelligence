import { z } from "zod";

export const companyCreateSchema = z.object({
    name: z.string().min(1, "Company name is required").max(100).trim(),
    slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
    industry: z.enum(["Technology", "Fintech", "E-Commerce", "Food Tech", "IT Services", "Healthcare", "Education", "Media", "Other"]).optional(),
    hqCity: z.string().max(80).optional(),
    hqCountry: z.string().max(80).optional(),
    logoUrl: z.string().url().optional(),
});

export type CompanyCreateInput = z.infer<typeof companyCreateSchema>;

export const companyFilterSchema = z.object({
    search: z.string().optional(),
    industry: z.string().optional(),
});