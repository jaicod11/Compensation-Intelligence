const COMPANY_ALIASES: Record<string, string> = {
    "google llc": "Google", "google india": "Google", "alphabet": "Google", "alphabet inc": "Google",
    "microsoft corporation": "Microsoft", "microsoft india": "Microsoft",
    "amazon india": "Amazon", "amazon web services": "Amazon", "aws": "Amazon",
    "facebook": "Meta", "meta platforms": "Meta", "instagram": "Meta", "whatsapp": "Meta",
    "flipkart internet private limited": "Flipkart", "walmart global tech": "Flipkart",
    "infosys limited": "Infosys", "infosys technologies": "Infosys",
    "tata consultancy services": "TCS", "tata consultancy services limited": "TCS",
    "wipro limited": "Wipro", "wipro technologies": "Wipro",
    "swiggy india": "Swiggy", "bundl technologies": "Swiggy",
    "zomato limited": "Zomato", "zomato media pvt ltd": "Zomato",
    "razorpay software private limited": "Razorpay",
    "dreamplug technologies": "CRED",
    "phonepe private limited": "PhonePe",
};

export function normalizeCompanyName(raw: string): { name: string; slug: string } {
    const lower = raw.toLowerCase().trim();
    if (COMPANY_ALIASES[lower]) {
        const canonical = COMPANY_ALIASES[lower];
        return { name: canonical, slug: toSlug(canonical) };
    }
    const canonical = raw.trim().replace(/\b\w/g, (c) => c.toUpperCase());
    return { name: canonical, slug: toSlug(canonical) };
}

function toSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}