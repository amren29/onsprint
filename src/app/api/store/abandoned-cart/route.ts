import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

/**
 * POST /api/store/abandoned-cart
 * Upsert an abandoned cart snapshot (no auth required — guest carts are valid)
 */
export async function POST(req: NextRequest) {
  try {
    const { shopId, data } = await req.json()
    if (!shopId || !data) {
      return NextResponse.json({ error: 'shopId and data required' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { data: row, error } = await supabase
      .from('abandoned_carts')
      .upsert({ shop_id: shopId, ...data }, { onConflict: 'session_id' })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data: row })
  } catch (err) {
    console.error('Abandoned cart upsert error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

/**
 * DELETE /api/store/abandoned-cart?shopId=...&sessionId=...
 * Remove an abandoned cart by session_id
 */
export async function DELETE(req: NextRequest) {
  try {
    const shopId = req.nextUrl.searchParams.get('shopId')
    const sessionId = req.nextUrl.searchParams.get('sessionId')
    if (!shopId || !sessionId) {
      return NextResponse.json({ error: 'shopId and sessionId required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Find the cart by session_id + shop_id, then delete
    const { data: cart } = await supabase
      .from('abandoned_carts')
      .select('id')
      .eq('shop_id', shopId)
      .eq('session_id', sessionId)
      .maybeSingle()

    if (cart) {
      await supabase
        .from('abandoned_carts')
        .delete()
        .eq('id', cart.id)
        .eq('shop_id', shopId)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Abandoned cart delete error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
