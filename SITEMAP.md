# FacilityPro - Site Map

> Complete navigation structure of the FacilityPro application

---

## Public Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Main dashboard with stats and quick actions |
| `/login` | Login | User authentication |
| `/register` | Register | New user registration |
| `/forgot-password` | Forgot Password | Password recovery |

---

## Dashboard & Analytics

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Overview with KPIs, recent activity, quick actions |
| `/analytics` | Analytics | Detailed charts and performance metrics |
| `/reports` | Reports | Generate and export reports |

---

## Property Management

| Route | Page | Description |
|-------|------|-------------|
| `/properties` | Properties List | View all properties with filters |
| `/properties/[id]` | Property Detail | Single property details, units, documents |
| `/facilities` | Facilities | Building and facility management |
| `/facilities/[id]` | Facility Detail | Individual facility information |

---

## Tenant Management

| Route | Page | Description |
|-------|------|-------------|
| `/tenants` | Tenants List | All tenants with search and filters |
| `/tenants/[id]` | Tenant Detail | Tenant profile, lease history, payments |

---

## Lease Management

| Route | Page | Description |
|-------|------|-------------|
| `/leases` | Leases List | All lease agreements |
| `/leases/[id]` | Lease Detail | Individual lease terms and documents |

---

## Maintenance & Work Orders

| Route | Page | Description |
|-------|------|-------------|
| `/maintenance` | Maintenance | Maintenance requests overview |
| `/maintenance/[id]` | Request Detail | Individual maintenance request |
| `/maintenance-hub` | Maintenance Hub | Advanced maintenance management |
| `/work-orders` | Work Orders | Work order tracking |
| `/work-orders/[id]` | Work Order Detail | Individual work order details |

---

## Financial

| Route | Page | Description |
|-------|------|-------------|
| `/payments` | Payments | Payment tracking and history |

---

## Operations

| Route | Page | Description |
|-------|------|-------------|
| `/workforce` | Workforce | Employee and contractor management |
| `/canvas` | Canvas | Visual planning and notes |

---

## Settings

| Route | Page | Description |
|-------|------|-------------|
| `/settings` | Settings | Application configuration |

---

## Visual Sitemap

```
FacilityPro
│
├── 🏠 Dashboard (/)
│   ├── Stats Cards
│   ├── Recent Activity
│   └── Quick Actions
│
├── 📊 Analytics
│   ├── /analytics
│   └── /reports
│
├── 🏢 Properties
│   ├── /properties (List)
│   ├── /properties/[id] (Detail)
│   ├── /facilities (List)
│   └── /facilities/[id] (Detail)
│
├── 👥 Tenants
│   ├── /tenants (List)
│   └── /tenants/[id] (Detail)
│
├── 📄 Leases
│   ├── /leases (List)
│   └── /leases/[id] (Detail)
│
├── 🔧 Maintenance
│   ├── /maintenance (List)
│   ├── /maintenance/[id] (Detail)
│   ├── /maintenance-hub (Hub)
│   ├── /work-orders (List)
│   └── /work-orders/[id] (Detail)
│
├── 💰 Financial
│   └── /payments
│
├── 👷 Operations
│   ├── /workforce
│   └── /canvas
│
├── ⚙️ Settings
│   └── /settings
│
└── 🔐 Authentication
    ├── /login
    ├── /register
    └── /forgot-password
```

---

## Page Count Summary

| Category | Pages |
|----------|-------|
| Dashboard & Analytics | 3 |
| Properties | 4 |
| Tenants | 2 |
| Leases | 2 |
| Maintenance | 5 |
| Financial | 1 |
| Operations | 2 |
| Settings | 1 |
| Authentication | 3 |
| **Total** | **23** |

---

## API Endpoints (Future)

```
/api/v1/
├── auth/
│   ├── login
│   ├── register
│   ├── logout
│   └── refresh
├── properties/
├── tenants/
├── leases/
├── maintenance/
├── payments/
└── reports/
```

---

*Last updated: November 2024*
