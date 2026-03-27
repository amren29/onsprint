# Onsprint Architecture Hardening — Incremental Refactoring Plan

## Context

An expert security review identified that Onsprint's generic `/api/db` proxy (service-role, trusts client shopId) is the #1 security risk. The current architecture routes all 123 DB functions through one endpoint that can access 31 tables. While we added session verification and table whitelisting, the fundamental pattern is too broad. This plan decomposes the generic proxy into safe, auditable patterns incrementally.

**Goal**: Harden authorization, reduce service-role usage, enforce RLS, preserve all existing UI behavior.

---

## Current State

| Metric | Value |
|--------|-------|
| Functions in `src/lib/db/client.ts` | 123 (47 reads, 69 writes, 7 helpers) |
| Files importing client.ts | 65 |
| Dedicated API routes (already safe) | 46 |
| Tables in /api/db whitelist | 31 |
| Tables with auto seq_id | 14 |

---

## Phase 1: Quick Wins (1-2 days)

**Type**: Quick fix

### 1a. Freeze `client.ts`
- Add `// FROZEN — no new functions` header
- All new features use domain routes

### 1b. Harden `/api/db` for writes
- **File**: `src/app/api/db/route.ts`
- Require verified session for ALL write actions (insert/update/delete/upsert)
- The current fallback (`catch {}` on auth failure → use requested shopId) allows anonymous writes
- Change: if auth fails AND action is write → return 403

### 1c. Deploy RLS policies
- **Public read tables** (products, categories, store_settings, store_pages, bundles, memberships, reviews): `SELECT true`
- **Customer tables** (store_users, store_carts, orders for customer view): `SELECT/UPDATE WHERE auth.uid() matches`
- **Admin tables** (all others): All ops require `auth.uid()` in `shop_members`
- Run via Supabase SQL Editor

### Security gain: Anonymous writes blocked, RLS ready for Phase 2
### Rollback: Revert 1 file + drop RLS policies

---

## Phase 2: Store Reads → Direct Supabase + RLS (2-3 days)

**Type**: Medium refactor

### What changes
Store pages stop calling `/api/db`. Instead they query Supabase directly using the browser client (anon key). RLS protects the data.

### New file
`src/lib/store/supabase-queries.ts` — store-specific query functions using `createClient()` from `src/lib/supabase/client.ts`

### Files to migrate

| File | Current Import | New Import | Notes |
|------|---------------|------------|-------|
| `src/lib/store/catalog-bridge.ts` | `/api/store/products` | Direct Supabase `products` + `categories` | Public catalog |
| `src/lib/store/membership-store.ts` | `getMemberships` from client.ts | Direct Supabase `memberships` | Public tiers |
| `src/components/store/CartTracker.tsx` | `upsertAbandonedCart` from client.ts | New `/api/store/cart-tracking` route | Write = needs server |
| `src/lib/store-settings-store.ts` | Direct Supabase REST already | Keep as-is | Already correct |

### Security gain: Store reads never hit service-role. 0 proxy calls from storefront.
### Rollback: Revert ~4 files, store falls back to existing routes.

---

## Phase 3: Admin Reads → Domain Routes (1-2 weeks, incremental)

**Type**: Major refactor (but per-domain, low risk each)

### New shared helper
`src/lib/api/admin-auth.ts`:
```typescript
export async function requireAdmin(req): Promise<{ shopId, userId, role }>
// Reads session, verifies shop_members, returns verified context
```

### Route pattern
```
GET /api/admin/orders         → list orders for verified shop
GET /api/admin/orders?id=xxx  → single order
GET /api/admin/customers      → list customers
...
```

### Client wrapper pattern
```
src/lib/api/orders.ts         → getOrders(shopId), getOrderById(shopId, id)
```

Consumer change: just swap import path. React Query stays identical.

### Migration order (by impact)

| Priority | Domain | Functions | Consumer Files |
|----------|--------|-----------|----------------|
| 1 | Orders | 6 | 5 |
| 2 | Products/Categories | 7 | 5 |
| 3 | Customers | 5 | 3 |
| 4 | Production | 8 | 3 |
| 5 | Inventory | 8 | 3 |
| 6 | Notifications | 12 | 1 |
| 7-17 | Remaining 11 domains | ~55 | ~30 |

### Per-domain effort: 1 new route + 1 new wrapper + 2-5 consumer updates
### Security gain: Each read has explicit auth, typed response, single table access
### Rollback: Revert consumer imports, old client.ts still works

---

## Phase 4: Admin Writes → Domain Routes (1-2 weeks)

**Type**: Major refactor

### Extend Phase 3 routes with POST/PATCH/DELETE

Key concern: `seq_id` generation requires service-role. Create shared helper:
```
src/lib/api/seq-id.ts → generateSeqId(shopId, prefix, pad)
```

### Per mutation route
- Verify session + membership
- Validate input (typed, not generic `Record<string, unknown>`)
- Generate seq_id if needed
- Execute with service-role (scoped to one table)
- Return typed response

### Security gain: Typed validation on all writes, per-domain permissions
### Rollback: Same as Phase 3

---

## Phase 5: Remove `/api/db` (1 day)

### Preconditions
- `grep -r "from '@/lib/db/client'" src/` returns 0 results
- All 65 consumer files migrated

### Actions
- Delete `src/lib/db/client.ts`
- Delete `src/app/api/db/route.ts`
- Update memory/docs

### Security gain: Generic proxy eliminated. No single endpoint accesses all tables.

---

## Summary

| Phase | Duration | Security Gain |
|-------|----------|---------------|
| 1: Freeze + Harden | 1-2 days | Block anon writes, RLS ready |
| 2: Store direct reads | 2-3 days | Store never uses service-role |
| 3: Admin domain reads | 1-2 weeks | No generic proxy for reads |
| 4: Admin domain writes | 1-2 weeks | Typed validation, scoped auth |
| 5: Remove proxy | 1 day | Generic proxy gone |

**Total: 3-5 weeks incremental, deployable after each phase.**

---

## Verification

After each phase:
1. All existing pages load without errors
2. CRUD operations work (create customer, create order, etc.)
3. Store checkout flow works end-to-end
4. Production board drag-and-drop works
5. No console errors about missing data or 403/500s
6. `curl POST /api/db` without auth returns 403 for writes (Phase 1)
7. Direct Supabase query with anon key returns store data (Phase 2)
