# 💰 CompIntel — Compensation Intelligence System

> **Track C · Full Stack Engineer Assignment**
> Levels matter more than job titles.

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

### 🌐 [Live Demo → your-app.vercel.app](https://your-app.vercel.app)

</div>

---

## 📌 About

**CompIntel** is a compensation intelligence platform focused on **structured and comparable salary data** for tech professionals in India.

This is **NOT** a salary listing website. It helps users compare compensation intelligently using:

- 🎯 **Levels** — L1 to L9, IC/Manager tracks
- 👤 **Roles** — Software Engineer, PM, Data Scientist and more
- 📍 **Location** — Bangalore, Hyderabad, Delhi NCR, Mumbai and more
- 💵 **Compensation Structure** — Base + Bonus + Stock (annualized)

**Core Principle: Levels matter more than job titles.**

An SDE-2 at Amazon and an L4 at Google are the same level — we normalize that so you can compare fairly across companies.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | TailwindCSS |
| **Backend** | Next.js API Routes (Node.js, TypeScript) |
| **Database** | PostgreSQL via Prisma ORM |
| **Validation** | Zod |
| **Charts** | Recharts |
| **Deployment** | Vercel (frontend + API) |
| **Database Host** | Neon (PostgreSQL, free tier) |

---

## ✨ Features

### 🔍 Salary Search & Browse
- Searchable and filterable salary table
- Sort by Total Compensation, Base Salary, Level, or Date
- Filter by Role, Level, Location, and Company
- Paginated results for large datasets
- Responsive table + mobile card layout

### 🏢 Company Profiles
- Company detail pages with aggregated stats
- TC breakdown by level (P25, Median, P75)
- Stacked compensation bar charts (Base + Bonus + Stock)
- Level progression line chart
- Recent salary reports per company

### ⚖️ Compensation Comparison
- Compare up to 3 companies side-by-side
- Select Role + Level + Companies
- See Median TC, P25–P75 range, and breakdown
- Visual bar chart comparison
- Highest TC company highlighted

### 📝 Salary Submission
- Anonymous salary submission form
- Real-time TC preview (Base + Bonus + Stock/yr)
- Validated with Zod — rejects invalid data
- Company name normalization (e.g. "Google LLC" → "Google")
- Missing bonus/stock defaults to 0

---

## 📊 Data Coverage

| Companies | Roles | Locations | Salary Reports |
|---|---|---|---|
| 14 companies | 7 role types | 8+ cities | 200+ reports |

**Companies included:** Google, Microsoft, Amazon, Meta, Flipkart, Swiggy, Zomato, Razorpay, CRED, PhonePe, Infosys, TCS, Wipro, Meesho

---

## 🗄️ Database Schema

```
Company (1) ──── (many) SalaryEntry
  ├── name          (canonical, normalized)
  ├── slug          (url-safe)
  └── industry

SalaryEntry
  ├── jobTitle      (raw submitted title e.g. "SDE-2")
  ├── role          (normalized e.g. "Software Engineer")
  ├── level         (normalized e.g. "L4", "SDE2")
  ├── levelOrder    (numeric for sorting: L1=1, L2=2...)
  ├── baseSalary
  ├── bonus         (defaults to 0)
  ├── stockAnnual   (annualized RSU/ESOP, defaults to 0)
  ├── totalComp     (base + bonus + stockAnnual)
  └── location
```

**TC Formula:** `totalComp = baseSalary + bonus + stockAnnual`

*Stock is stored as annualized value (e.g. ₹48L over 4 years = ₹12L/year)*

---

## 📁 Project Structure

```
compensation-intelligence/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── seed.ts                # Sample data (Indian tech companies)
│
└── src/
    ├── app/                   # Next.js 14 App Router
    │   ├── page.tsx           # Landing page
    │   ├── salaries/          # Browse & search salaries
    │   ├── companies/         # Company profiles
    │   ├── compare/           # Side-by-side comparison tool
    │   ├── submit/            # Salary submission form
    │   └── api/               # Backend API routes
    │       ├── salaries/      # GET list + POST submit
    │       ├── companies/     # GET all + GET by slug
    │       ├── compare/       # POST comparison engine
    │       ├── levels/        # GET level metadata
    │       └── stats/         # GET platform stats
    │
    ├── components/
    │   ├── ui/                # Base primitives (Badge, Button, Modal...)
    │   ├── layout/            # Navbar, Footer, Sidebar
    │   ├── salary/            # SalaryTable, FilterPanel, SubmitForm...
    │   ├── comparison/        # ComparisonTable, Selector, Breakdown
    │   ├── company/           # CompanyCard, Header, LevelChart...
    │   └── charts/            # Recharts visualizations
    │
    ├── lib/
    │   ├── db.ts              # Prisma singleton
    │   ├── validations/       # Zod schemas
    │   ├── normalization/     # Company + compensation logic
    │   └── utils/             # Currency, helpers, levels
    │
    ├── hooks/                 # Custom React hooks
    ├── services/              # Client-side API wrappers
    ├── types/                 # TypeScript interfaces
    └── constants/             # Levels, roles, locations
```

---

## 🌐 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/salaries` | List/filter salaries with pagination |
| `POST` | `/api/salaries` | Submit a new salary entry |
| `GET` | `/api/salaries/:id` | Get single salary entry |
| `GET` | `/api/companies` | All companies with aggregated stats |
| `GET` | `/api/companies/:slug` | Company detail + level breakdowns |
| `POST` | `/api/compare` | Compare up to 3 companies |
| `GET` | `/api/levels` | Level + role metadata |
| `GET` | `/api/stats` | Platform-wide statistics |

### Query Parameters — `GET /api/salaries`

| Param | Type | Description |
|---|---|---|
| `company` | string | Company slug (e.g. `google`) |
| `role` | string | Role slug (e.g. `software-engineer`) |
| `level` | string | Level (e.g. `L4`, `SDE2`) |
| `location` | string | City name (e.g. `Bangalore`) |
| `sortBy` | string | `totalComp` \| `baseSalary` \| `levelOrder` \| `reportedAt` |
| `sortOrder` | string | `asc` \| `desc` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (max: 100) |

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- A [Neon](https://neon.tech) PostgreSQL database (free)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/jaicod11/Compensation-Intelligence.git
cd Compensation-Intelligence

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your DATABASE_URL from Neon dashboard
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npx tsx prisma/seed.ts
```

### Run Development Server

```bash
npm run dev
# → http://localhost:3000
```

---

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

npx prisma studio    # Open Prisma database browser
npx prisma db push   # Push schema changes to DB
npx tsx prisma/seed.ts  # Re-seed sample data
```

---

## 🚢 Deployment

### Deployed on Vercel + Neon

| Service | Purpose | Tier |
|---|---|---|
| **Vercel** | Hosts Next.js app + API routes | Free |
| **Neon** | PostgreSQL database | Free (512MB) |

### Deploy Your Own

1. Fork this repo
2. Create a [Neon](https://neon.tech) database and copy the connection string
3. Import to [Vercel](https://vercel.com) and add these environment variables:
   - `DATABASE_URL` — your Neon connection string
   - `NEXTAUTH_SECRET` — any random string
   - `NEXTAUTH_URL` — your Vercel URL
   - `NEXT_PUBLIC_APP_URL` — your Vercel URL
4. Deploy!

---

## 🔧 Key Design Decisions

**1. Levels over job titles**
The `level` field is normalized to a canonical scale (L1–L9) regardless of what a company calls it. This enables true cross-company comparison.

**2. Total Compensation formula**
`TC = Base + Bonus + (Stock annualized)`
Stock is stored as the annualized value (4-year grant ÷ 4) to make comparisons fair.

**3. Normalization at write time**
Company names and levels are normalized when data is ingested, keeping reads fast.

**4. URL-synced filters**
Filter state is stored in the URL so it survives page refresh and is shareable.

**5. Zod validation**
All POST bodies are validated before hitting the database. Invalid data is rejected with clear error messages.

---

## 📚 References

- [Levels.fyi](https://www.levels.fyi/) — Primary reference (levels-based compensation)
- [AmbitionBox](https://www.ambitionbox.com/) — Indian market reference
- [6figr](https://6figr.com/) — Indian tech salaries
- [Glassdoor](https://www.glassdoor.com/) — General market data

---

## 👨‍💻 Author

Built as part of **Track C — Compensation Intelligence System** assignment.

---

<div align="center">
  <strong>CompIntel</strong> — Compare compensation intelligently. Levels matter more than job titles.
  <br><br>
  <a href="https://compensation-intelligence-smoky.vercel.app/">🌐 Live Demo</a> ·
  <a href="https://github.com/jaicod11/Compensation-Intelligence">📦 GitHub</a>
</div>