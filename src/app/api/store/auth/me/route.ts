import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const shopId = req.nextUrl.searchParams.get('shopId')
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !shopId) return NextResponse.json({ user: null })

    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data: storeUser } = await admin.from('store_users').select('*').eq('shop_id', shopId).eq('auth_user_id', user.id).maybeSingle()
    if (!storeUser) return NextResponse.json({ user: null })

    const { data: walletEntries } = await admin.from('store_user_wallet_entries').select('*').eq('store_user_id', storeUser.id).order('created_at', { ascending: false }).limit(50)
    const { data: orders } = await admin.from('orders').select('id, seq_id, status, grand_total, created_at, items, source, customer_name, customer_id, delivery_method, delivery_address, due_date, production, payments, timeline, sst_enabled, sst_rate, sst_amount, shipping_cost, subtotal, currency, notes, agent_name').eq('shop_id', shopId).eq('customer_id', storeUser.id).order('created_at', { ascending: false }).limit(20)

    return NextResponse.json({ user: { ...storeUser, walletEntries: walletEntries || [], orders: orders || [] } })
  } catch { return NextResponse.json({ user: null }) }
}
