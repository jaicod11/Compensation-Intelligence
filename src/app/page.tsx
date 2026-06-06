import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatCompact } from "@/lib/utils/currency";
import { median } from "@/lib/normalization/compensation";

async function getStats() {
  const [entryCount, companyCount, topCompanies] = await Promise.all([
    prisma.salaryEntry.count(),
    prisma.company.count({ where: { salaries: { some: {} } } }),
    prisma.company.findMany({ include: { salaries: { select: { totalComp: true } } }, where: { salaries: { some: {} } }, take: 6 }),
  ]);
  const companies = topCompanies
    .map((c) => ({ name: c.name, slug: c.slug, medianTc: Math.round(median(c.salaries.map((s) => s.totalComp))), count: c.salaries.length }))
    .sort((a, b) => b.medianTc - a.medianTc);
  return { entryCount, companyCount, companies };
}

export default async function HomePage() {
  const { entryCount, companyCount, companies } = await getStats();
  return (
    <div className="bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            Levels matter more than job titles
          </div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Compensation Intelligence <span className="text-indigo-600">for Tech</span>
          </h1>
          <p className="mt-5 text-xl text-gray-500">
            Compare total compensation across companies using levels — not just job titles.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/salaries" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-lg">Explore Salaries</Link>
            <Link href="/compare" className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-lg">Compare Companies</Link>
          </div>
        </div>
        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[{ label: "Salary Reports", value: entryCount.toLocaleString() }, { label: "Companies", value: companyCount.toLocaleString() }, { label: "Cities Covered", value: "8+" }].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Companies by TC</h2>
          <Link href="/companies" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c) => (
            <Link key={c.slug} href={`/companies/${c.slug}`} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{c.name}</div>
                  <div className="text-sm text-gray-400 mt-0.5">{c.count} reports</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-indigo-700 font-mono text-lg">{formatCompact(c.medianTc)}</div>
                  <div className="text-xs text-gray-400">median TC</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📊", title: "Compare by level, not title", desc: "An L4 at Google and an SDE-2 at Amazon are the same level — we normalize that so you can compare fairly." },
              { icon: "💰", title: "See total compensation", desc: "Base + bonus + RSUs. We annualize stock to make 4-year grants comparable to cash." },
              { icon: "📍", title: "Filter by location", desc: "Bangalore vs Hyderabad vs Delhi NCR — the same level can have different pay ranges." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Know your market value</h2>
        <p className="text-gray-500 mb-6">Submit your own compensation anonymously and help the community.</p>
        <Link href="/submit" className="inline-flex px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">+ Add Your Salary</Link>
      </section>
    </div>
  );
}