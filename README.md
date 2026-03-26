# Onsprint

Multi-tenant print shop management platform built for Malaysian printing businesses.

**Live:** [onsprint.mohamedamrin07.workers.dev](https://onsprint.mohamedamrin07.workers.dev)

---

## What is Onsprint?

Onsprint replaces spreadsheets, WhatsApp orders, and scattered tools with one unified platform. Shop owners manage orders, production, payments, customers, and their online store — all from a single dashboard.

## Tech Stack

- **Frontend:** Next.js 15 (App Router)
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Hosting:** Cloudflare Workers (OpenNext)
- **Payments:** Billplz (Malaysian FPX, cards, e-wallets) + Stripe (subscriptions)
- **File Storage:** Cloudflare R2
- **UI:** Custom CSS, Fira Sans, dark/light theme

## Architecture

```
Browser → Cloudflare Workers (Next.js via OpenNext)
              ↓
         /api/db proxy (service role key)
              ↓
         Supabase (PostgreSQL)
              ↓
         R2 (file storage)
```

All DB calls go through `/api/db` generic proxy — no direct `'use server'` imports in client components (Cloudflare Workers compatibility).

Multi-tenant: every query requires `shop_id`. The middleware validates shop membership via cookies.

---

## Features

### Admin Dashboard
- Revenue overview with charts (weekly/daily)
- Active orders, pending orders, stock alerts
- Real-time order notifications via Supabase Realtime
- Welcome banner with onboarding checklist

### Order Management
- Create, edit, duplicate orders
- Order status: Pending → Confirmed → Cancelled
- Production tracking linked to kanban board
- Invoice generation (HTML → PDF via browser print)
- Customer and agent assignment

### Production Board
- Kanban-style board with 12 stages:
  - New Order → Artwork Checking → Designing → Refine → Waiting Customer Feedback → Ready to Print → Printing → Finishing → QC → Ready to Pickup → Collected → Done
- Drag & drop cards between columns
- Card modal with proofing, jobsheets, timeline, notes
- Artwork upload to R2 with version control

### Online Store
- Product catalog with 55 seed products
- Size dropdown, option dropdowns (Material, Lamination, Cut)
- Pricing engine: volume, sqft, fixed, fixed_per_size
- Cart, checkout, Billplz payment gateway
- Customer accounts (Supabase Auth, auto-confirmed)
- Order tracking page
- Simplified for Tier 1 & 2 (Home, Products, Track Order)

### Products & Catalog
- 55 pre-loaded products from Excel spreadsheet
- 33 categories
- 6 product groups: Standard, Signage & Office, Books & Calendars, Packaging, Apparel & Merch, Event Material
- Auto-seed on onboarding based on shop type
- Product editor with sizes, options, pricing tiers, images (R2 upload)
- Categories tab inline in Products page

### Customer Management
- Customer directory with CRUD
- Online store customers linked via `store_users` table
- Agent system with prepaid wallets and discount rates
- Membership tiers (Supabase-backed)
- Affiliate tracking

### Payments
- Billplz integration (FPX, cards, e-wallets)
- Auto-split payments between platform and shop owner
- Platform fee per plan: Starter RM 1.00, Growth RM 0.60, Pro RM 0.20
- Payment transactions table
- Bank account connection flow

### Team & Permissions
- Custom permissions per team member
- Owner has full access
- Staff see only pages assigned to them
- Permission toggles: Dashboard, Orders, Customers, Payments, Stock, Suppliers, Agents, Membership, Products, Reports, Production, Store, Settings

### Subscription Plans (Stripe)
- Starter: RM 99/mo — 1 team member, standard products, basic store
- Growth: RM 249/mo — 5 team members, all products, agent system
- Pro: RM 499/mo — unlimited team, website builder, custom domain
- 14-day free trial on all plans
- Stripe Checkout + Customer Portal
- Webhook handles subscription lifecycle
- Plan enforcement: 7-day grace period after expiry → blocked to billing page

### File Upload (Cloudflare R2)
- Product images
- Customer artwork uploads (up to 100MB)
- Production proofing files with version control
- Public URLs via r2.dev

### Authentication
- Admin: Supabase Auth with OTP email verification
- Store customers: Supabase Auth, auto-confirmed (no email verification)
- Google OAuth for admin login
- Forgot password flow for both admin and customers
- Middleware validates session + shop membership on every request

### Other Features
- Stock/inventory management
- Supplier management
- Reports page
- Notification system (in-app + bell sound)
- Search palette (Cmd+K)
- Dark/light theme toggle
- Store website builder (Pro tier, 18 section types)
- SEO settings
- Abandoned cart tracking
- Discount/campaign management

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── db/            # Generic DB proxy
│   │   ├── store/         # Store auth, checkout, products
│   │   ├── plan/          # Stripe subscription
│   │   ├── upload/        # R2 file upload
│   │   ├── invoice/       # Invoice generation
│   │   └── billplz/       # Payment callbacks
│   ├── dashboard/         # Admin dashboard
│   ├── orders/            # Order management
│   ├── catalog/           # Product management
│   ├── production/        # Kanban production board
│   ├── store/             # Customer-facing online store
│   ├── settings/          # Account, billing, team
│   ├── storefront/        # Store admin (editor, settings)
│   └── onboarding/        # New shop setup (10 steps)
├── components/
│   ├── Sidebar.tsx         # Main nav with permissions
│   ├── AppShell.tsx        # Dashboard layout wrapper
│   ├── production/         # Kanban components
│   ├── store/              # Store UI components
│   ├── store-builder/      # Website builder
│   └── settings/           # Settings components
├── lib/
│   ├── db/
│   │   ├── client.ts       # 80+ client-safe DB functions
│   │   ├── orders.ts       # Server actions (unused on Cloudflare)
│   │   └── ...             # Other DB modules
│   ├── store/
│   │   ├── auth-store.ts   # Zustand + Supabase auth
│   │   ├── cart-store.ts   # Shopping cart
│   │   └── pricing-engine.ts
│   ├── supabase/           # Supabase client/server/middleware
│   ├── stripe.ts           # Stripe API (fetch-based)
│   └── upload.ts           # R2 upload helper
├── providers/
│   ├── shop-provider.tsx   # Admin multi-tenant context
│   ├── store-context.tsx   # Store multi-tenant context
│   └── query-provider.tsx  # React Query
├── data/
│   └── seed-products.json  # 55 product templates
└── types/
    └── store.ts            # TypeScript types
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Site
NEXT_PUBLIC_SITE_URL=
BASE_URL=

# Billplz
BILLPLZ_API_KEY=
BILLPLZ_SIGNATURE_KEY=
BILLPLZ_SANDBOX=true
ONSPRINT_BILLPLZ_EMAIL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER_MONTHLY=
STRIPE_PRICE_STARTER_ANNUALLY=
STRIPE_PRICE_GROWTH_MONTHLY=
STRIPE_PRICE_GROWTH_ANNUALLY=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_ANNUALLY=

# R2
R2_PUBLIC_URL=

# Node
NODE_VERSION=20
```

---

## Deploy

```bash
# Build and deploy to Cloudflare Workers
./deploy.sh

# Or manually
npx next build
npx opennextjs-cloudflare build
npx wrangler deploy
```

---

## Database

38 Supabase tables including:

- `shops`, `shop_members` — multi-tenant
- `orders`, `customers`, `agents`, `payments` — core business
- `products`, `categories` — catalog
- `boards`, `board_columns`, `board_cards` — production kanban
- `store_users`, `store_user_wallet_entries` — customer auth
- `store_pages`, `store_settings` — website builder
- `memberships`, `discounts`, `affiliates` — loyalty
- `notifications`, `proofs`, `sequences` — system

Auto `seq_id` generation via `next_seq()` PostgreSQL function.

---

## Key Design Decisions

1. **No `'use server'` in `'use client'` components** — causes RSC 500 on Cloudflare Workers. All DB calls go through `/api/db` proxy.
2. **`btoa()` instead of `Buffer.from()`** — Cloudflare Workers compatibility.
3. **Web Crypto API instead of Node.js `crypto`** — edge runtime.
4. **Billplz API calls inlined in route handlers** — no shared module imports (chunk loading fails on Cloudflare).
5. **Stripe SDK replaced with fetch** — Node.js HTTP doesn't work on Cloudflare Workers.
6. **React Query with 5-min staleTime** — instant navigation, background refetch.
7. **Cookie-based shopId** — middleware prefetches, ShopProvider reads instantly.

---

## License

Private. All rights reserved.
