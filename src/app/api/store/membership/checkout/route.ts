import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tierId, tierName, price, shopId, email, name } = body

    if (!tierId || !tierName || !price) {
      return NextResponse.json({ error: 'Missing tier details' }, { status: 400 })
    }

    // Get shop's Billplz collection ID
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('billplz_collection_id, payment_enabled')
      .eq('id', shopId)
      .single()

    if (shopError || !shop || !shop.billplz_collection_id) {
      return NextResponse.json({ error: 'Payment not configured for this shop' }, { status: 400 })
    }

    // Read env vars at request time (Cloudflare Workers)
    const apiKey = process.env.BILLPLZ_API_KEY || ''
    const isSandbox = process.env.BILLPLZ_SANDBOX === 'true'
    const baseApiUrl = isSandbox
      ? 'https://www.billplz-sandbox.com/api/v3'
      : 'https://www.billplz.com/api/v3'
    const authHeader = `Basic ${btoa(`${apiKey}:`)}`

    const baseUrl = process.env.BASE_URL || new URL(req.url).origin
    const amountSen = Math.round(price * 100)

    // Create Billplz bill (inline, no import)
    const billRes = await fetch(`${baseApiUrl}/bills`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collection_id: shop.billplz_collection_id,
        email: email || 'customer@example.com',
        name: name || 'Customer',
        amount: amountSen,
        callback_url: `${baseUrl}/api/billplz/callback`,
        redirect_url: `${baseUrl}/api/billplz/redirect`,
        description: `${tierName} Membership — 12 months`,
        reference_1: `membership-${tierId}-${Date.now()}`,
        reference_1_label: 'Membership Ref',
        reference_2: shopId,
        reference_2_label: 'Shop ID',
      }),
    })

    const billText = await billRes.text()

    if (!billRes.ok) {
      console.error('Billplz createBill failed:', billRes.status, billText.slice(0, 300))
      return NextResponse.json({ error: 'Failed to create payment. Please try again.' }, { status: 500 })
    }

    let bill: { id: string; url: string }
    try {
      bill = JSON.parse(billText)
    } catch {
      console.error('Billplz returned non-JSON:', billText.slice(0, 300))
      return NextResponse.json({ error: 'Unexpected response from payment provider.' }, { status: 500 })
    }

    // Save payment transaction
    await supabase.from('payment_transactions').insert({
      bill_id: bill.id,
      shop_id: shopId,
      order_id: `membership-${tierId}`,
      type: 'membership',
      amount_sen: amountSen,
      status: 'pending',
      customer_email: email,
      customer_name: name,
      metadata: { tierId, tierName, price, type: 'membership' },
    })

    return NextResponse.json({ url: bill.url })
  } catch (err) {
    console.error('Membership checkout error:', err)
    const message = err instanceof Error ? err.message : 'Failed to create checkout session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
