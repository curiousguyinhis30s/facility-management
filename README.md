# FacilityPro

> Professional Property Management Platform for the GCC Region

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

---

## Overview

FacilityPro is a comprehensive facility management platform designed for property managers handling condominiums, apartments, warehouses, shoplots, and mixed-use properties. Built with modern web technologies and optimized for the Saudi Arabia and GCC market.

### Key Features

- **Property Management** - Manage multiple properties with detailed unit tracking
- **Tenant Management** - Complete tenant lifecycle from application to move-out
- **Lease Management** - Digital lease creation, tracking, and renewals
- **Maintenance Hub** - Work orders, preventive maintenance, and vendor management
- **Financial Tracking** - Rent collection, payments, and financial reporting
- **Analytics Dashboard** - Real-time insights and KPIs
- **Multi-Currency Support** - SAR, USD, EUR, and more

---

## Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0+ or **pnpm** 8.0+
- **Git** ([Download](https://git-scm.com/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/facilitypro.git

# 2. Navigate to project directory
cd facilitypro

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.local.example .env.local

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Setup

Edit `.env.local` with your configuration:

```env
# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Stripe (Payments)
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run type-check` | Run TypeScript type checking |

---

## Project Structure

```
facilitypro/
├── public/              # Static assets (favicon, images)
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── (auth)/      # Authentication pages
│   │   ├── properties/  # Property management
│   │   ├── tenants/     # Tenant management
│   │   ├── leases/      # Lease management
│   │   ├── maintenance/ # Maintenance tracking
│   │   ├── payments/    # Payment processing
│   │   └── analytics/   # Analytics dashboard
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Base UI components
│   │   ├── layout/      # Layout components
│   │   └── features/    # Feature-specific components
│   ├── contexts/        # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   └── types/           # TypeScript definitions
├── .env.local.example   # Environment template
├── package.json         # Dependencies
└── tailwind.config.ts   # Tailwind configuration
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.3 |
| Styling | Tailwind CSS 3.4 |
| UI Components | Radix UI, Custom Components |
| State | React Context + Local Storage |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Payments | Stripe |
| Deployment | Vercel |

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge | Latest 2 versions |

---

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 3000
lsof -ti :3000 | xargs kill -9
npm run dev
```

**Dependencies not installing**
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## Contributing

This is a private project. For access or collaboration inquiries, please contact the development team.

---

## License

Proprietary - All Rights Reserved

---

## Support

For issues or questions:
- Create an issue in the repository
- Contact: support@facilitypro.app

---

**Built with care for property managers**
