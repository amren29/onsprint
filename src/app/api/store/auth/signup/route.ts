import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, phone, company, shopId } = await req.json()
    if (!email || !password || !name || !shopId) {
      return NextResponse.json({ error: 'Name, email, password and shopId required' }, { status: 400 })
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

    // Create user via Admin API — auto-confirmed, no email verification
    const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role: role || 'customer', shop_id: shopId },
      }),
    })

    const authResult = await createRes.json()
    if (!createRes.ok || !authResult.id) {
      const msg = authResult.msg || authResult.message || authResult.error?.message || 'Signup failed'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    // Sign in immediately to get session
    const anon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data: sessionData } = await anon.auth.signInWithPassword({ email, password })

    // Create store_users row
    const admin = createClient(supabaseUrl, serviceKey)

    const { data: existing } = await admin
      .from('store_users')
      .select('id')
      .eq('shop_id', shopId)
      .ilike('email', email.trim())
      .maybeSingle()

    let storeUser
    if (existing) {
      const { data } = await admin.from('store_users')
        .update({ auth_user_id: authResult.id, name, phone: phone || '', company: company || '' })
        .eq('id', existing.id).select().single()
      storeUser = data
    } else {
      const { data, error } = await admin.from('store_users').insert({
        shop_id: shopId, auth_user_id: authResult.id,
        name, email: email.trim().toLowerCase(), role: role || 'customer',
        phone: phone || '', company: company || '',
      }).select().single()
      if (error) return NextResponse.json({ error: 'Account created but profile setup failed' }, { status: 500 })
      storeUser = data
    }

    // Sync to admin customers table
    await admin.from('customers').upsert({
      shop_id: shopId, name, email: email.trim().toLowerCase(),
      phone: phone || '', company: company || '',
      customer_type: role === 'agent' ? 'Agent' : 'Individual', status: 'Active',
    }, { onConflict: 'shop_id,email' })

    return NextResponse.json({ user: storeUser, session: sessionData?.session || null })
  } catch (err) {
    console.error('Store signup error:', err)
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  }
}
