import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const companies = [
    { name: "Google", slug: "google", industry: "Technology", hqCity: "Mountain View", hqCountry: "USA" },
    { name: "Microsoft", slug: "microsoft", industry: "Technology", hqCity: "Redmond", hqCountry: "USA" },
    { name: "Amazon", slug: "amazon", industry: "Technology", hqCity: "Seattle", hqCountry: "USA" },
    { name: "Meta", slug: "meta", industry: "Technology", hqCity: "Menlo Park", hqCountry: "USA" },
    { name: "Flipkart", slug: "flipkart", industry: "E-Commerce", hqCity: "Bangalore", hqCountry: "India" },
    { name: "Swiggy", slug: "swiggy", industry: "Food Tech", hqCity: "Bangalore", hqCountry: "India" },
    { name: "Zomato", slug: "zomato", industry: "Food Tech", hqCity: "Gurugram", hqCountry: "India" },
    { name: "Razorpay", slug: "razorpay", industry: "Fintech", hqCity: "Bangalore", hqCountry: "India" },
    { name: "CRED", slug: "cred", industry: "Fintech", hqCity: "Bangalore", hqCountry: "India" },
    { name: "PhonePe", slug: "phonepe", industry: "Fintech", hqCity: "Bangalore", hqCountry: "India" },
    { name: "Infosys", slug: "infosys", industry: "IT Services", hqCity: "Bangalore", hqCountry: "India" },
    { name: "TCS", slug: "tcs", industry: "IT Services", hqCity: "Mumbai", hqCountry: "India" },
    { name: "Wipro", slug: "wipro", industry: "IT Services", hqCity: "Bangalore", hqCountry: "India" },
    { name: "Meesho", slug: "meesho", industry: "E-Commerce", hqCity: "Bangalore", hqCountry: "India" },
];

interface SalaryTemplate {
    jobTitle: string; role: string; roleSlug: string; level: string;
    levelOrder: number; levelTrack: string; yearsExperience: number;
    location: string; currency: string; baseSalary: number; bonus: number; stockAnnual: number;
}

function jitter(value: number, pct = 0.08): number {
    const delta = value * pct;
    return Math.round(value + (Math.random() * 2 - 1) * delta);
}

const googleTemplates: SalaryTemplate[] = [
    { jobTitle: "Software Engineer III", role: "Software Engineer", roleSlug: "software-engineer", level: "L3", levelOrder: 3, levelTrack: "IC", yearsExperience: 1, location: "Hyderabad", currency: "INR", baseSalary: 3200000, bonus: 320000, stockAnnual: 800000 },
    { jobTitle: "Software Engineer IV", role: "Software Engineer", roleSlug: "software-engineer", level: "L4", levelOrder: 4, levelTrack: "IC", yearsExperience: 4, location: "Bangalore", currency: "INR", baseSalary: 4800000, bonus: 600000, stockAnnual: 1800000 },
    { jobTitle: "Senior Software Engineer", role: "Software Engineer", roleSlug: "software-engineer", level: "L5", levelOrder: 5, levelTrack: "IC", yearsExperience: 7, location: "Bangalore", currency: "INR", baseSalary: 6500000, bonus: 900000, stockAnnual: 3200000 },
    { jobTitle: "Staff Software Engineer", role: "Software Engineer", roleSlug: "software-engineer", level: "L6", levelOrder: 6, levelTrack: "IC", yearsExperience: 11, location: "Bangalore", currency: "INR", baseSalary: 9000000, bonus: 1400000, stockAnnual: 5500000 },
    { jobTitle: "Product Manager II", role: "Product Manager", roleSlug: "product-manager", level: "L4", levelOrder: 4, levelTrack: "IC", yearsExperience: 4, location: "Bangalore", currency: "INR", baseSalary: 5200000, bonus: 700000, stockAnnual: 2200000 },
    { jobTitle: "Senior Product Manager", role: "Product Manager", roleSlug: "product-manager", level: "L5", levelOrder: 5, levelTrack: "IC", yearsExperience: 7, location: "Bangalore", currency: "INR", baseSalary: 7200000, bonus: 1100000, stockAnnual: 4000000 },
    { jobTitle: "Data Scientist II", role: "Data Scientist", roleSlug: "data-scientist", level: "L4", levelOrder: 4, levelTrack: "IC", yearsExperience: 4, location: "Hyderabad", currency: "INR", baseSalary: 4800000, bonus: 600000, stockAnnual: 2000000 },
];

const microsoftTemplates: SalaryTemplate[] = [
    { jobTitle: "Software Engineer I", role: "Software Engineer", roleSlug: "software-engineer", level: "SDE1", levelOrder: 3, levelTrack: "IC", yearsExperience: 1, location: "Hyderabad", currency: "INR", baseSalary: 2400000, bonus: 240000, stockAnnual: 600000 },
    { jobTitle: "Software Engineer II", role: "Software Engineer", roleSlug: "software-engineer", level: "SDE2", levelOrder: 4, levelTrack: "IC", yearsExperience: 3, location: "Hyderabad", currency: "INR", baseSalary: 3800000, bonus: 500000, stockAnnual: 1200000 },
    { jobTitle: "Senior Software Engineer", role: "Software Engineer", roleSlug: "software-engineer", level: "SDE3", levelOrder: 5, levelTrack: "IC", yearsExperience: 6, location: "Hyderabad", currency: "INR", baseSalary: 5400000, bonus: 800000, stockAnnual: 2400000 },
    { jobTitle: "Principal Engineer", role: "Software Engineer", roleSlug: "software-engineer", level: "IC5", levelOrder: 6, levelTrack: "IC", yearsExperience: 10, location: "Hyderabad", currency: "INR", baseSalary: 8500000, bonus: 1400000, stockAnnual: 5000000 },
    { jobTitle: "Program Manager", role: "Product Manager", roleSlug: "product-manager", level: "SDE2", levelOrder: 4, levelTrack: "IC", yearsExperience: 4, location: "Hyderabad", currency: "INR", baseSalary: 4000000, bonus: 550000, stockAnnual: 1500000 },
    { jobTitle: "Data Scientist", role: "Data Scientist", roleSlug: "data-scientist", level: "SDE2", levelOrder: 4, levelTrack: "IC", yearsExperience: 3, location: "Hyderabad", currency: "INR", baseSalary: 3900000, bonus: 500000, stockAnnual: 1300000 },
];

const amazonTemplates: SalaryTemplate[] = [
    { jobTitle: "Software Development Engineer I", role: "Software Engineer", roleSlug: "software-engineer", level: "SDE1", levelOrder: 3, levelTrack: "IC", yearsExperience: 1, location: "Bangalore", currency: "INR", baseSalary: 2800000, bonus: 400000, stockAnnual: 900000 },
    { jobTitle: "Software Development Engineer II", role: "Software Engineer", roleSlug: "software-engineer", level: "SDE2", levelOrder: 4, levelTrack: "IC", yearsExperience: 4, location: "Bangalore", currency: "INR", baseSalary: 4200000, bonus: 600000, stockAnnual: 1800000 },
    { jobTitle: "Senior SDE", role: "Software Engineer", roleSlug: "software-engineer", level: "SDE3", levelOrder: 5, levelTrack: "IC", yearsExperience: 7, location: "Bangalore", currency: "INR", baseSalary: 5800000, bonus: 900000, stockAnnual: 3000000 },
    { jobTitle: "Principal SDE", role: "Software Engineer", roleSlug: "software-engineer", level: "IC6", levelOrder: 6, levelTrack: "IC", yearsExperience: 12, location: "Bangalore", currency: "INR", baseSalary: 10000000, bonus: 1800000, stockAnnual: 7000000 },
    { jobTitle: "Product Manager II", role: "Product Manager", roleSlug: "product-manager", level: "L5", levelOrder: 5, levelTrack: "IC", yearsExperience: 6, location: "Bangalore", currency: "INR", baseSalary: 5500000, bonus: 900000, stockAnnual: 2800000 },
];

const flipkartTemplates: SalaryTemplate[] = [
    { jobTitle: "Software Engineer 1", role: "Software Engineer", roleSlug: "software-engineer", level: "SDE1", levelOrder: 3, levelTrack: "IC", yearsExperience: 1, location: "Bangalore", currency: "INR", baseSalary: 2000000, bonus: 200000, stockAnnual: 400000 },
    { jobTitle: "Software Engineer 2", role: "Software Engineer", roleSlug: "software-engineer", level: "SDE2", levelOrder: 4, levelTrack: "IC", yearsExperience: 3, location: "Bangalore", currency: "INR", baseSalary: 3000000, bonus: 350000, stockAnnual: 900000 },
    { jobTitle: "Senior Software Engineer", role: "Software Engineer", roleSlug: "software-engineer", level: "SDE3", levelOrder: 5, levelTrack: "IC", yearsExperience: 6, location: "Bangalore", currency: "INR", baseSalary: 4500000, bonus: 600000, stockAnnual: 1800000 },
    { jobTitle: "Staff Software Engineer", role: "Software Engineer", roleSlug: "software-engineer", level: "SDE4", levelOrder: 6, levelTrack: "IC", yearsExperience: 9, location: "Bangalore", currency: "INR", baseSalary: 6500000, bonus: 1000000, stockAnnual: 3500000 },
    { jobTitle: "Senior Product Manager", role: "Product Manager", roleSlug: "product-manager", level: "PM3", levelOrder: 5, levelTrack: "IC", yearsExperience: 7, location: "Bangalore", currency: "INR", baseSalary: 5200000, bonus: 800000, stockAnnual: 2500000 },
];

const razorpayTemplates: SalaryTemplate[] = [
    { jobTitle: "SDE 1", role: "Software Engineer", roleSlug: "software-engineer", level: "L2", levelOrder: 2, levelTrack: "IC", yearsExperience: 1, location: "Bangalore", currency: "INR", baseSalary: 2200000, bonus: 220000, stockAnnual: 500000 },
    { jobTitle: "SDE 2", role: "Software Engineer", roleSlug: "software-engineer", level: "L3", levelOrder: 3, levelTrack: "IC", yearsExperience: 3, location: "Bangalore", currency: "INR", baseSalary: 3500000, bonus: 420000, stockAnnual: 1200000 },
    { jobTitle: "Senior SDE", role: "Software Engineer", roleSlug: "software-engineer", level: "L4", levelOrder: 4, levelTrack: "IC", yearsExperience: 5, location: "Bangalore", currency: "INR", baseSalary: 5000000, bonus: 700000, stockAnnual: 2500000 },
    { jobTitle: "Staff SDE", role: "Software Engineer", roleSlug: "software-engineer", level: "L5", levelOrder: 5, levelTrack: "IC", yearsExperience: 8, location: "Bangalore", currency: "INR", baseSalary: 7500000, bonus: 1200000, stockAnnual: 4500000 },
];

const tcsTemplates: SalaryTemplate[] = [
    { jobTitle: "Assistant System Engineer", role: "Software Engineer", roleSlug: "software-engineer", level: "L1", levelOrder: 1, levelTrack: "IC", yearsExperience: 0, location: "Chennai", currency: "INR", baseSalary: 380000, bonus: 0, stockAnnual: 0 },
    { jobTitle: "System Engineer", role: "Software Engineer", roleSlug: "software-engineer", level: "L2", levelOrder: 2, levelTrack: "IC", yearsExperience: 2, location: "Chennai", currency: "INR", baseSalary: 450000, bonus: 20000, stockAnnual: 0 },
    { jobTitle: "IT Analyst", role: "Software Engineer", roleSlug: "software-engineer", level: "L3", levelOrder: 3, levelTrack: "IC", yearsExperience: 4, location: "Pune", currency: "INR", baseSalary: 700000, bonus: 50000, stockAnnual: 0 },
    { jobTitle: "Assistant Consultant", role: "Software Engineer", roleSlug: "software-engineer", level: "L4", levelOrder: 4, levelTrack: "IC", yearsExperience: 7, location: "Mumbai", currency: "INR", baseSalary: 1000000, bonus: 100000, stockAnnual: 0 },
    { jobTitle: "Consultant", role: "Software Engineer", roleSlug: "software-engineer", level: "L5", levelOrder: 5, levelTrack: "IC", yearsExperience: 10, location: "Mumbai", currency: "INR", baseSalary: 1400000, bonus: 150000, stockAnnual: 0 },
];

const infosysTemplates: SalaryTemplate[] = [
    { jobTitle: "Systems Engineer", role: "Software Engineer", roleSlug: "software-engineer", level: "L1", levelOrder: 1, levelTrack: "IC", yearsExperience: 0, location: "Bangalore", currency: "INR", baseSalary: 390000, bonus: 0, stockAnnual: 0 },
    { jobTitle: "Senior Systems Engineer", role: "Software Engineer", roleSlug: "software-engineer", level: "L2", levelOrder: 2, levelTrack: "IC", yearsExperience: 3, location: "Bangalore", currency: "INR", baseSalary: 550000, bonus: 30000, stockAnnual: 0 },
    { jobTitle: "Technology Analyst", role: "Software Engineer", roleSlug: "software-engineer", level: "L3", levelOrder: 3, levelTrack: "IC", yearsExperience: 5, location: "Hyderabad", currency: "INR", baseSalary: 800000, bonus: 60000, stockAnnual: 0 },
    { jobTitle: "Tech Lead", role: "Software Engineer", roleSlug: "software-engineer", level: "L4", levelOrder: 4, levelTrack: "IC", yearsExperience: 8, location: "Pune", currency: "INR", baseSalary: 1200000, bonus: 120000, stockAnnual: 0 },
];

const credTemplates: SalaryTemplate[] = [
    { jobTitle: "Software Engineer", role: "Software Engineer", roleSlug: "software-engineer", level: "SDE2", levelOrder: 4, levelTrack: "IC", yearsExperience: 3, location: "Bangalore", currency: "INR", baseSalary: 3800000, bonus: 500000, stockAnnual: 1500000 },
    { jobTitle: "Senior Software Engineer", role: "Software Engineer", roleSlug: "software-engineer", level: "SDE3", levelOrder: 5, levelTrack: "IC", yearsExperience: 5, location: "Bangalore", currency: "INR", baseSalary: 5500000, bonus: 800000, stockAnnual: 3000000 },
    { jobTitle: "Staff Engineer", role: "Software Engineer", roleSlug: "software-engineer", level: "SDE4", levelOrder: 6, levelTrack: "IC", yearsExperience: 8, location: "Bangalore", currency: "INR", baseSalary: 8000000, bonus: 1400000, stockAnnual: 5500000 },
    { jobTitle: "Product Manager", role: "Product Manager", roleSlug: "product-manager", level: "PM2", levelOrder: 4, levelTrack: "IC", yearsExperience: 4, location: "Bangalore", currency: "INR", baseSalary: 4500000, bonus: 700000, stockAnnual: 2000000 },
];

const swiggyTemplates: SalaryTemplate[] = [
    { jobTitle: "SDE 1", role: "Software Engineer", roleSlug: "software-engineer", level: "L3", levelOrder: 3, levelTrack: "IC", yearsExperience: 1, location: "Bangalore", currency: "INR", baseSalary: 2200000, bonus: 250000, stockAnnual: 600000 },
    { jobTitle: "SDE 2", role: "Software Engineer", roleSlug: "software-engineer", level: "L4", levelOrder: 4, levelTrack: "IC", yearsExperience: 4, location: "Bangalore", currency: "INR", baseSalary: 3500000, bonus: 480000, stockAnnual: 1400000 },
    { jobTitle: "Senior SDE", role: "Software Engineer", roleSlug: "software-engineer", level: "L5", levelOrder: 5, levelTrack: "IC", yearsExperience: 6, location: "Bangalore", currency: "INR", baseSalary: 5200000, bonus: 800000, stockAnnual: 2800000 },
    { jobTitle: "Staff Engineer", role: "Software Engineer", roleSlug: "software-engineer", level: "L6", levelOrder: 6, levelTrack: "IC", yearsExperience: 9, location: "Bangalore", currency: "INR", baseSalary: 7200000, bonus: 1200000, stockAnnual: 4500000 },
];

const companyTemplates: Record<string, SalaryTemplate[]> = {
    google: googleTemplates, microsoft: microsoftTemplates,
    amazon: amazonTemplates, flipkart: flipkartTemplates,
    razorpay: razorpayTemplates, tcs: tcsTemplates,
    infosys: infosysTemplates, cred: credTemplates, swiggy: swiggyTemplates,
};

async function main() {
    console.log("🌱 Starting seed...");
    await prisma.salaryEntry.deleteMany();
    await prisma.company.deleteMany();

    for (const company of companies) {
        await prisma.company.create({ data: company });
    }
    console.log(`✅ Created ${companies.length} companies`);

    let totalEntries = 0;
    for (const [slug, templates] of Object.entries(companyTemplates)) {
        const company = await prisma.company.findUnique({ where: { slug } });
        if (!company) continue;
        for (const template of templates) {
            for (let i = 0; i < 3; i++) {
                const base = jitter(template.baseSalary);
                const bonus = jitter(template.bonus);
                const stock = jitter(template.stockAnnual);
                await prisma.salaryEntry.create({
                    data: {
                        companyId: company.id,
                        jobTitle: template.jobTitle,
                        role: template.role,
                        roleSlug: template.roleSlug,
                        level: template.level,
                        levelOrder: template.levelOrder,
                        levelTrack: template.levelTrack,
                        yearsExperience: template.yearsExperience + (i > 0 ? i : 0),
                        location: template.location,
                        country: template.currency === "USD" ? "USA" : "India",
                        currency: template.currency,
                        baseSalary: base,
                        bonus: bonus,
                        stockAnnual: stock,
                        totalComp: base + bonus + stock,
                    },
                });
                totalEntries++;
            }
        }
        console.log(`  ✓ ${slug}: ${templates.length * 3} entries`);
    }
    console.log(`\n✅ Seed complete — ${totalEntries} entries`);
}

main()
    .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
    .finally(() => prisma.$disconnect());