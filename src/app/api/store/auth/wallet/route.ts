import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { shopId, userId, type, amount, category, description, reference, status } = await req.json()
    if (!shopId || !userId || !type || !amount) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data: user } = await supabase.from('store_users').select('wallet_balance').eq('id', userId).single()
    const currentBalance = user?.wallet_balance ?? 0
    const newBalance = type === 'credit' ? currentBalance + amount : currentBalance - amount

    await supabase.from('store_user_wallet_entries').insert({
      shop_id: shopId, store_user_id: userId, date: new Date().toISOString().slice(0, 10),
      type, category: category || '', description: description || '',
      amount, balance: newBalance, reference: reference || '', status: status || 'completed',
    })
    if (status !== 'pending') {
      await supabase.from('store_users').update({ wallet_balance: newBalance }).eq('id', userId)
    }
    return NextResponse.json({ success: true, balance: newBalance })
  } catch { return NextResponse.json({ error: 'Wallet update failed' }, { status: 500 }) }
}
