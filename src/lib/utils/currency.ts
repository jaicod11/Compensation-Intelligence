export function formatCurrency(amount: number, currency = "INR", compact = false): string {
    if (compact) return formatCompact(amount, currency);
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatCompact(amount: number, currency = "INR"): string {
    const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency + " ";
    if (currency === "INR") {
        if (amount >= 10_000_000) return `${symbol}${(amount / 10_000_000).toFixed(1)}Cr`;
        if (amount >= 100_000) return `${symbol}${(amount / 100_000).toFixed(1)}L`;
        if (amount >= 1000) return `${symbol}${(amount / 1000).toFixed(0)}K`;
        return `${symbol}${amount}`;
    }
    if (amount >= 1_000_000) return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `${symbol}${(amount / 1_000).toFixed(0)}K`;
    return `${symbol}${amount}`;
}

export function currencySymbol(currency: string): string {
    const map: Record<string, string> = { INR: "₹", USD: "$", EUR: "€", GBP: "£", SGD: "S$" };
    return map[currency] ?? currency;
}