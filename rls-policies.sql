-- ============================================================
-- Onsprint RLS Policies — Phase 1c
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================
-- Safe to re-run: drops existing policies before creating.
-- /api/db uses service_role key (bypasses RLS).
-- These protect against direct anon-key access
-- and prepare for Phase 2 (store reads via anon key + RLS).
-- ============================================================

-- ============================
-- 1. ENABLE RLS ON ALL TABLES
-- ============================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

ALTER TABLE store_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_user_wallet_entries ENABLE ROW LEVEL SECURITY;

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_prefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prod_card_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE topup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_requests ENABLE ROW LEVEL SECURITY;

-- ============================
-- 2. DROP ALL EXISTING ONSPRINT POLICIES (safe re-run)
-- ============================

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE policyname LIKE 'public_read_%'
       OR policyname LIKE 'customer_%'
       OR policyname LIKE 'admin_%'
       OR policyname LIKE 'member_%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- ============================
-- 3. PUBLIC READ POLICIES
-- ============================
-- These tables can be read by anyone (store visitors).

CREATE POLICY "public_read_products" ON products
  FOR SELECT USING (true);

CREATE POLICY "public_read_categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "public_read_store_settings" ON store_settings
  FOR SELECT USING (true);

CREATE POLICY "public_read_store_pages" ON store_pages
  FOR SELECT USING (true);

CREATE POLICY "public_read_bundles" ON bundles
  FOR SELECT USING (true);

CREATE POLICY "public_read_memberships" ON memberships
  FOR SELECT USING (true);

CREATE POLICY "public_read_reviews" ON reviews
  FOR SELECT USING (true);

-- ============================
-- 4. STORE CUSTOMER POLICIES
-- ============================
-- store_users.auth_user_id links to Supabase auth.uid()
-- store_carts and wallet_entries use store_user_id (FK to store_users.id)

CREATE POLICY "customer_read_own_profile" ON store_users
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "customer_update_own_profile" ON store_users
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- store_carts: match via store_user_id → store_users.auth_user_id
CREATE POLICY "customer_read_own_cart" ON store_carts
  FOR SELECT USING (
    store_user_id IN (SELECT id FROM store_users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "customer_write_own_cart" ON store_carts
  FOR INSERT WITH CHECK (
    store_user_id IN (SELECT id FROM store_users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "customer_update_own_cart" ON store_carts
  FOR UPDATE USING (
    store_user_id IN (SELECT id FROM store_users WHERE auth_user_id = auth.uid())
  );

-- wallet entries: match via store_user_id → store_users.auth_user_id
CREATE POLICY "customer_read_own_wallet" ON store_user_wallet_entries
  FOR SELECT USING (
    store_user_id IN (SELECT id FROM store_users WHERE auth_user_id = auth.uid())
  );

-- ============================
-- 5. ADMIN HELPER FUNCTION
-- ============================

CREATE OR REPLACE FUNCTION auth_shop_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT shop_id FROM shop_members WHERE user_id = auth.uid() LIMIT 1;
$$;

-- ============================
-- 6. ADMIN POLICIES — shop_members
-- ============================

CREATE POLICY "member_read_own" ON shop_members
  FOR SELECT USING (user_id = auth.uid());

-- ============================
-- 7. ADMIN FULL CRUD ON TENANT TABLES
-- ============================

DO $$
DECLARE
  tbl text;
  admin_tables text[] := ARRAY[
    'orders', 'customers', 'agents', 'payments',
    'inventory_items', 'stock_logs', 'suppliers',
    'boards', 'board_columns', 'board_cards',
    'notifications', 'notification_prefs',
    'abandoned_carts', 'affiliates', 'affiliate_orders',
    'payout_requests', 'discounts', 'campaigns',
    'content_pages', 'message_templates',
    'proofs', 'prod_card_states',
    'topup_requests', 'wallet_entries', 'payment_transactions',
    'membership_requests'
  ];
BEGIN
  FOREACH tbl IN ARRAY admin_tables LOOP
    EXECUTE format(
      'CREATE POLICY "admin_select_%1$s" ON %1$I FOR SELECT USING (shop_id = auth_shop_id())',
      tbl
    );
    EXECUTE format(
      'CREATE POLICY "admin_insert_%1$s" ON %1$I FOR INSERT WITH CHECK (shop_id = auth_shop_id())',
      tbl
    );
    EXECUTE format(
      'CREATE POLICY "admin_update_%1$s" ON %1$I FOR UPDATE USING (shop_id = auth_shop_id())',
      tbl
    );
    EXECUTE format(
      'CREATE POLICY "admin_delete_%1$s" ON %1$I FOR DELETE USING (shop_id = auth_shop_id())',
      tbl
    );
  END LOOP;
END $$;

-- ============================
-- 8. ADMIN WRITE ON PUBLIC-READ TABLES
-- ============================

DO $$
DECLARE
  tbl text;
  public_tables text[] := ARRAY[
    'products', 'categories', 'store_settings', 'store_pages',
    'bundles', 'memberships', 'reviews'
  ];
BEGIN
  FOREACH tbl IN ARRAY public_tables LOOP
    EXECUTE format(
      'CREATE POLICY "admin_insert_%1$s" ON %1$I FOR INSERT WITH CHECK (shop_id = auth_shop_id())',
      tbl
    );
    EXECUTE format(
      'CREATE POLICY "admin_update_%1$s" ON %1$I FOR UPDATE USING (shop_id = auth_shop_id())',
      tbl
    );
    EXECUTE format(
      'CREATE POLICY "admin_delete_%1$s" ON %1$I FOR DELETE USING (shop_id = auth_shop_id())',
      tbl
    );
  END LOOP;
END $$;

-- ============================
-- 9. ADMIN READ ON CUSTOMER TABLES
-- ============================

CREATE POLICY "admin_read_store_users" ON store_users
  FOR SELECT USING (shop_id = auth_shop_id());

CREATE POLICY "admin_read_store_carts" ON store_carts
  FOR SELECT USING (shop_id = auth_shop_id());

CREATE POLICY "admin_read_wallet_entries" ON store_user_wallet_entries
  FOR SELECT USING (shop_id = auth_shop_id());

-- ============================================================
-- DONE! Verify with:
-- SELECT tablename, policyname, cmd FROM pg_policies ORDER BY tablename;
-- ============================================================
