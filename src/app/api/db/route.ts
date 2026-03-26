import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// Tables that don't have shop_id (system tables)
const NO_SHOP_ID_TABLES = ['profiles', 'sequences']

// Allowed tables — whitelist to prevent arbitrary table access
const ALLOWED_TABLES = new Set([
  'orders', 'customers', 'agents', 'products', 'categories', 'payments',
  'inventory_items', 'stock_logs', 'suppliers', 'boards', 'board_columns',
  'board_cards', 'store_pages', 'store_settings', 'store_users',
  'store_user_wallet_entries', 'store_carts', 'notifications', 'notification_prefs',
  'abandoned_carts', 'affiliates', 'affiliate_orders', 'payout_requests',
  'bundles', 'memberships', 'membership_requests', 'discounts', 'campaigns',
  'content_pages', 'message_templates', 'reviews', 'proofs', 'prod_card_states',
  'topup_requests', 'wallet_entries', 'payment_transactions', 'shop_members',
  'profiles', 'sequences',
])

// Tables that need auto-generated seq_id on insert
const SEQ_CONFIG: Record<string, { prefix: string; pad: number }> = {
  customers: { prefix: 'C', pad: 3 },
  orders: { prefix: 'ORD', pad: 4 },
  agents: { prefix: 'AG', pad: 2 },
  payments: { prefix: 'PAY', pad: 4 },
  products: { prefix: 'CGRP', pad: 2 },
  categories: { prefix: 'CAT', pad: 3 },
  bundles: { prefix: 'BDL', pad: 3 },
  discounts: { prefix: 'DSC', pad: 1 },
  boards: { prefix: 'BRD', pad: 1 },
  content_pages: { prefix: 'CNT', pad: 1 },
  inventory_items: { prefix: 'STK', pad: 3 },
  stock_logs: { prefix: 'LOG', pad: 3 },
  suppliers: { prefix: 'SUP', pad: 2 },
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function POST(req: NextRequest) {
  try {
    const { action, table, shopId: requestedShopId, data, filters, select, order, limit, id } = await req.json()
    const supabase = getSupabase()
    const needsShopId = !NO_SHOP_ID_TABLES.includes(table)

    // SECURITY: Whitelist allowed tables
    if (!ALLOWED_TABLES.has(table)) {
      return NextResponse.json({ data: [], error: 'Table not allowed' })
    }

    // SECURITY: Verify user session and derive shopId from membership
    let shopId = requestedShopId
    if (needsShopId) {
      try {
        const cookieStore = await cookies()
        const authClient = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
        )
        const { data: { user } } = await authClient.auth.getUser()

        if (user) {
          // Derive shopId from user's membership — don't trust request
          const { data: membership } = await supabase
            .from('shop_members')
            .select('shop_id')
            .eq('user_id', user.id)
            .maybeSingle()

          if (membership?.shop_id) {
            // Override request shopId with verified membership shopId
            shopId = membership.shop_id
          }
        }
      } catch {
        // If auth check fails, still use requested shopId (for public store routes)
      }
    }

    // SECURITY: shopId is REQUIRED for all tenant tables
    if (needsShopId && !shopId) {
      return NextResponse.json({ data: [], error: 'shopId is required' })
    }

    if (action === 'select') {
      let query = supabase.from(table).select(select || '*')
      if (needsShopId) query = query.eq('shop_id', shopId)
      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          query = query.eq(key, value as string)
        }
      }
      if (order) query = query.order(order.column || 'created_at', { ascending: order.ascending ?? false })
      if (limit) query = query.limit(limit)
      const { data: rows, error } = await query
      if (error) return NextResponse.json({ data: [], error: error.message })
      return NextResponse.json({ data: rows })
    }

    if (action === 'select_single') {
      let query = supabase.from(table).select(select || '*')
      if (needsShopId) query = query.eq('shop_id', shopId)
      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          query = query.eq(key, value as string)
        }
      }
      const { data: row, error } = await query.maybeSingle()
      if (error) return NextResponse.json({ data: null, error: error.message })
      return NextResponse.json({ data: row })
    }

    if (action === 'insert') {
      let insertData = needsShopId ? { shop_id: shopId, ...data } : data

      // Auto-generate seq_id if the table needs one and it's not provided
      if (needsShopId && !insertData.seq_id && SEQ_CONFIG[table]) {
        const { prefix, pad } = SEQ_CONFIG[table]
        const { data: seqId } = await supabase.rpc('next_seq', { p_shop_id: shopId, p_prefix: prefix, p_pad: pad })
        if (seqId) insertData = { ...insertData, seq_id: seqId }
      }

      const { data: row, error } = await supabase.from(table).insert(insertData).select().single()
      if (error) return NextResponse.json({ data: null, error: error.message })
      return NextResponse.json({ data: row })
    }

    if (action === 'update') {
      if (!id) return NextResponse.json({ error: 'id required for update' }, { status: 400 })
      let query = supabase.from(table).update(data).eq('id', id)
      if (needsShopId) query = query.eq('shop_id', shopId)
      const { data: row, error } = await query.select().single()
      if (error) return NextResponse.json({ data: null, error: error.message })
      return NextResponse.json({ data: row })
    }

    if (action === 'upsert') {
      const upsertData = needsShopId ? { shop_id: shopId, ...data } : data
      const { data: row, error } = await supabase.from(table).upsert(upsertData, { onConflict: filters?.onConflict || 'id' }).select().single()
      if (error) return NextResponse.json({ data: null, error: error.message })
      return NextResponse.json({ data: row })
    }

    if (action === 'delete') {
      if (!id) return NextResponse.json({ error: 'id required for delete' }, { status: 400 })
      let query = supabase.from(table).delete().eq('id', id)
      if (needsShopId) query = query.eq('shop_id', shopId)
      const { error } = await query
      if (error) return NextResponse.json({ data: null, error: error.message })
      return NextResponse.json({ success: true })
    }

    if (action === 'rpc') {
      const { data: result, error } = await supabase.rpc(table, data)
      if (error) return NextResponse.json({ data: null, error: error.message })
      return NextResponse.json({ data: result })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('DB proxy error:', err)
    return NextResponse.json({ error: 'Database request failed' }, { status: 500 })
  }
}
