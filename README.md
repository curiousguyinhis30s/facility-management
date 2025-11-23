# FacilityPro - Enterprise Facility Management System

**Version:** 0.1.0 (Phase 0 - Foundation)
**Status:** In Development
**Last Updated:** 2025-11-23

---

## Overview

FacilityPro is a comprehensive facility management platform designed for property managers handling condominiums, apartments, warehouses, shoplot, and mixed-use properties. It replaces 7+ disconnected tools with one unified platform, reducing operating costs by 30% and improving tenant satisfaction by 40%.

## Project Status

### Current Phase: Phase 0 - Foundation & Critical Gap Closure (5-6 weeks)

**Progress:** Week 1/6
- ✅ Project structure created
- ✅ Technical design document completed
- ✅ Critical gaps identified and designed
- ⏳ Infrastructure setup in progress

**Next Milestones:**
- Week 2: Database schema implementation
- Week 3: Authentication & multi-currency
- Week 4: Bulk operations & rate limiting
- Week 5-6: Testing & documentation

## Key Features (Planned)

### MVP (Phase 1 - Months 1-3)
- Property & unit management (condos, apartments, warehouses, shoplot, houses)
- Owner and tenant database
- Lease management with e-signatures
- Work order system (preventive & reactive maintenance)
- Rent collection with Stripe integration
- Inspection management
- Basic reporting (rent roll, occupancy, financials)

### Advanced Features (Phase 2-7)
- Workforce management (employees, time tracking, scheduling, safety)
- Asset register & depreciation
- Insurance management
- Parking & visitor management
- Amenity booking
- Communication hub
- Procurement & inventory
- Legal & compliance tracking
- Mobile apps (iOS & Android)
- Advanced analytics & AI predictions

## Technology Stack

### Frontend
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript 5.3
- **UI Library:** React 18
- **Styling:** Tailwind CSS 3.4
- **Component Library:** Radix UI
- **State Management:** Zustand + React Query
- **Forms:** React Hook Form + Zod

### Backend
- **API:** Next.js API Routes (RESTful)
- **Database:** PostgreSQL 15+ (Supabase)
- **Authentication:** JWT with Supabase Auth
- **Real-time:** Supabase Realtime (PostgreSQL pub/sub)
- **File Storage:** Supabase Storage (S3-compatible)
- **Cache:** Redis (Upstash)
- **Search:** PostgreSQL Full-Text Search (pg_trgm)

### Integrations
- **Payments:** Stripe
- **Email:** SendGrid
- **SMS:** Twilio
- **E-Signatures:** DocuSign
- **Background Checks:** Checkr
- **Accounting:** QuickBooks/Xero

### Infrastructure
- **Hosting:** Vercel
- **Database:** Supabase (managed PostgreSQL)
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry (errors), Datadog (metrics)
- **Analytics:** PostHog

## Architecture Highlights

### Critical Design Decisions (from Gap Analysis)

1. **Multi-Currency Support**
   - Exchange rate snapshots for accurate historical reporting
   - Open Exchange Rates API integration
   - Support for USD, EUR, GBP, CAD, AUD, and more

2. **Soft Delete Strategy**
   - 30-day recovery window
   - 7-year retention for legal compliance
   - Cascade rules to maintain data integrity

3. **API Rate Limiting**
   - Sliding window algorithm with Redis
   - Per-endpoint limits (auth: 10/min, payments: 30/hr)
   - 10% burst allowance for temporary spikes

4. **Bulk Operations**
   - Process up to 10,000 items efficiently
   - Preview, confirm, and track progress in real-time
   - Rollback capability for failed operations

5. **Optimistic Locking**
   - Version-based conflict detection
   - Automatic merge for non-conflicting changes
   - User-friendly conflict resolution UI

6. **Distributed Transactions (Saga Pattern)**
   - Example: Move-out workflow with 6 steps
   - Automatic compensation on failure
   - Idempotency keys for external API calls

### Multi-Tenancy
- **Method:** Row-Level Security (PostgreSQL RLS)
- **Isolation:** tenant_id partitioning
- **Scalability:** Sharding plan ready for 1M+ units

### Security
- **Authentication:** JWT with refresh tokens (15-min access, 7-day refresh)
- **Authorization:** Role-Based Access Control (12 roles)
- **Encryption:** AES-256-GCM for PII (SSN, bank accounts)
- **Compliance:** GDPR, CCPA, SOC 2 Type II path

## Design System

Following **Apple HIG + Spotify Encore** principles:

- **Color Palette:**
  - Primary: #2563EB (Blue - trust, professionalism)
  - Success: #10B981 (Green - completed, paid)
  - Warning: #F59E0B (Amber - attention needed)
  - Danger: #EF4444 (Red - urgent, overdue)

- **Typography:** Inter font, 8px base unit, modular scale
- **Spacing:** 8px grid system
- **Accessibility:** WCAG 2.1 AA compliant

## Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm
- Supabase account
- Stripe test account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/facilitypro.git
cd facilitypro

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your credentials
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - STRIPE_PUBLISHABLE_KEY
# - STRIPE_SECRET_KEY

# Run database migrations (once Supabase is set up)
npm run migrate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm run format       # Format code with Prettier
npm test             # Run unit tests (Vitest)
npm run test:e2e     # Run E2E tests (Playwright)
```

## Project Structure

```
facilitypro/
├── src/
│   ├── app/              # Next.js 14 App Router
│   │   ├── (auth)/       # Authentication routes
│   │   ├── (dashboard)/  # Main application routes
│   │   └── api/          # API routes
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Design system components
│   │   └── features/     # Feature-specific components
│   ├── lib/              # Core libraries & utilities
│   │   ├── auth/         # Authentication logic
│   │   ├── db/           # Database client & queries
│   │   ├── currency/     # Multi-currency support
│   │   ├── bulk/         # Bulk operations
│   │   └── saga/         # Saga orchestrator
│   ├── types/            # TypeScript type definitions
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Helper functions
├── supabase/
│   ├── migrations/       # Database migrations
│   └── functions/        # Edge functions
├── tests/
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── docs/                 # Documentation
│   ├── api/              # API documentation
│   └── guides/           # User & developer guides
└── public/               # Static assets
```

## Documentation

- **Technical Design:** [TECHNICAL_DESIGN.md](./TECHNICAL_DESIGN.md)
- **PRD:** See Archon project documents
- **API Docs:** Coming in Phase 1
- **User Guide:** Coming in Phase 2

## Contributing

This is a private project. Contribution guidelines will be added when the project reaches public beta.

## Testing Strategy

### Unit Tests (Vitest)
- All critical business logic
- Currency conversion
- Saga compensation logic
- Soft delete service

### Integration Tests
- API endpoints
- Database operations
- Third-party integrations (mocked)

### E2E Tests (Playwright)
- 15 critical user journeys automated
- Examples:
  - Complete tenant lifecycle (18 steps)
  - Emergency maintenance (9 steps)
  - Bulk lease renewal (100 units)

### Load Testing (k6)
- MVP: 1,000 concurrent users
- Launch: 10,000 concurrent users
- Target: p95 < 2s response time

## Success Metrics

### Technical
- **Uptime:** > 99.9%
- **Response Time:** p95 < 500ms (API), < 2s (page load)
- **Test Coverage:** > 80% for critical paths
- **Security:** Zero critical vulnerabilities

### Business
- **Occupancy Rate:** > 95%
- **Maintenance Response:** < 24 hours
- **Lease Renewal Rate:** > 70%
- **NPS:** > 50

## Roadmap

### ✅ Phase 0: Foundation (Weeks 1-6) - Current
- Project setup
- Critical gap resolution
- Database schema design
- Authentication system

### 📅 Phase 1: MVP (Weeks 7-16) - Planned
- Core property management
- Lease management
- Work order system
- Rent collection
- Basic reporting

### 📅 Phase 2: Workforce (Weeks 17-28)
- Employee management
- Time & attendance
- Shift scheduling
- Preventive maintenance

### 📅 Phase 3-7: Advanced Features (Months 7-18)
- Asset management
- Mobile apps
- Integrations
- Analytics
- Public launch

## License

Proprietary - All rights reserved

## Contact

For questions or support, please contact the development team via Archon project.

---

**Built with ❤️ by the FacilityPro Team**
