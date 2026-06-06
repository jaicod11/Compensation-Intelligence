export interface Location {
    city: string;
    state: string;
    country: string;
    countryCode: string;
    colIndex: number;
    aliases: string[];
}

export const LOCATIONS: Location[] = [
    { city: "Bangalore", state: "Karnataka", country: "India", countryCode: "IN", colIndex: 100, aliases: ["bangalore", "bengaluru", "blr"] },
    { city: "Hyderabad", state: "Telangana", country: "India", countryCode: "IN", colIndex: 88, aliases: ["hyderabad", "hyd"] },
    { city: "Delhi NCR", state: "Delhi", country: "India", countryCode: "IN", colIndex: 95, aliases: ["delhi", "delhi ncr", "noida", "gurgaon", "gurugram", "del"] },
    { city: "Mumbai", state: "Maharashtra", country: "India", countryCode: "IN", colIndex: 108, aliases: ["mumbai", "bombay", "bom"] },
    { city: "Pune", state: "Maharashtra", country: "India", countryCode: "IN", colIndex: 82, aliases: ["pune"] },
    { city: "Chennai", state: "Tamil Nadu", country: "India", countryCode: "IN", colIndex: 80, aliases: ["chennai", "madras", "maa"] },
    { city: "Kolkata", state: "West Bengal", country: "India", countryCode: "IN", colIndex: 72, aliases: ["kolkata", "calcutta", "ccu"] },
    { city: "Ahmedabad", state: "Gujarat", country: "India", countryCode: "IN", colIndex: 68, aliases: ["ahmedabad", "amd"] },
    { city: "San Francisco Bay Area", state: "California", country: "USA", countryCode: "US", colIndex: 380, aliases: ["san francisco", "sf", "bay area", "silicon valley", "mountain view", "sunnyvale", "palo alto"] },
    { city: "Seattle", state: "Washington", country: "USA", countryCode: "US", colIndex: 280, aliases: ["seattle", "redmond", "bellevue"] },
    { city: "New York", state: "New York", country: "USA", countryCode: "US", colIndex: 340, aliases: ["new york", "nyc", "new york city"] },
    { city: "Remote", state: "", country: "Remote", countryCode: "REMOTE", colIndex: 100, aliases: ["remote", "work from home", "wfh"] },
];

export function normalizeLocation(raw: string): string {
    const lower = raw.toLowerCase().trim();
    for (const loc of LOCATIONS) {
        if (loc.aliases.includes(lower)) return loc.city;
    }
    return raw;
}

export function getColIndex(city: string): number {
    return LOCATIONS.find((l) => l.city === city)?.colIndex ?? 100;
}