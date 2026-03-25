import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, password, shopId } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    if (!authData.user) return NextResponse.json({ error: 'Login failed' }, { status: 500 })

    let storeUser = null
    if (shopId) {
      const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { data } = await admin.from('store_users').select('*').eq('shop_id', shopId).eq('auth_user_id', authData.user.id).maybeSingle()
      if (!data) {
        const { data: created } = await admin.from('store_users').insert({
          shop_id: shopId, auth_user_id: authData.user.id,
          name: authData.user.user_metadata?.name || email.split('@')[0],
          email: email.trim().toLowerCase(), role: 'customer',
        }).select().single()
        storeUser = created
      } else {
        storeUser = data
      }
    }
    return NextResponse.json({ user: storeUser, session: authData.session })
  } catch (err) {
    console.error('Store signin error:', err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
