import Link from "next/link";
import type { SalaryEntry } from "@/types/salary.types";
import { formatCompact } from "@/lib/utils/currency";
import { timeAgo } from "@/lib/utils/helpers";
import { Badge } from "@/components/ui/Badge";

export function SalaryTableRow({ salary: s }: { salary: SalaryEntry }) {
    return (
        <tr className="hover:bg-gray-50 transition-colors group">
            <td className="px-6 py-4"><Link href={`/companies/${s.company?.slug}`} className="font-medium text-gray-900 hover:text-indigo-700">{s.company?.name}</Link><div className="text-gray-400 text-xs mt-0.5 truncate max-w-[200px]">{s.jobTitle}</div></td>
            <td className="px-4 py-4"><Badge variant="indigo">{s.level}</Badge></td>
            <td className="px-4 py-4 text-gray-500 text-sm">{s.location}</td>
            <td className="px-4 py-4 text-right font-mono text-xs text-gray-600">{formatCompact(s.baseSalary, s.currency)}</td>
            <td className="px-4 py-4 text-right font-mono text-xs text-gray-400">{s.bonus > 0 ? formatCompact(s.bonus, s.currency) : <span className="text-gray-200">—</span>}</td>
            <td className="px-4 py-4 text-right font-mono text-xs text-gray-400">{s.stockAnnual > 0 ? formatCompact(s.stockAnnual, s.currency) : <span className="text-gray-200">—</span>}</td>
            <td className="px-6 py-4 text-right"><Link href={`/salaries/${s.id}`}><span className="font-semibold text-indigo-700 font-mono text-sm group-hover:underline">{formatCompact(s.totalComp, s.currency)}</span></Link><div className="text-gray-300 text-xs mt-0.5">{timeAgo(s.reportedAt)}</div></td>
        </tr>
    );
}