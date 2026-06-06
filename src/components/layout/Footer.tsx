import Link from "next/link";
export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center"><span className="text-white font-bold text-xs">CI</span></div>
                        <span className="text-sm text-gray-500">CompIntel — Levels matter more than job titles.</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <Link href="/salaries" className="hover:text-gray-800">Salaries</Link>
                        <Link href="/companies" className="hover:text-gray-800">Companies</Link>
                        <Link href="/compare" className="hover:text-gray-800">Compare</Link>
                        <Link href="/submit" className="hover:text-gray-800">Submit</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}