import { NextRequest, NextResponse } from 'next/server'

const PLAN_FEES: Record<string, number> = {
  starter: 100,
  growth: 60,
  pro: 20,
}

const ONSPRINT_BILLPLZ_EMAIL = process.env.ONSPRINT_BILLPLZ_EMAIL || 'platform@onsprint.my'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { shopId, newPlan } = body

    if (!shopId || !newPlan) {
      return NextResponse.json({ error: 'Missing shopId or newPlan' }, { status: 400 })
    }

    if (!PLAN_FEES[newPlan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const { supabase } = await import('@/lib/supabase')

    const newFixedCut = PLAN_FEES[newPlan]

    // Get current shop data
    const { data: shop, error: fetchError } = await supabase
      .from('shops')
      .select('billplz_collection_id, bank_account_name, plan, stripe_subscription_id')
      .eq('id', shopId)
      .single()

    if (fetchError || !shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    if (shop.plan === newPlan) {
      return NextResponse.json({ error: 'Already on this plan' }, { status: 400 })
    }

    // If shop has a Stripe subscription, update it via Stripe
    if (shop.stripe_subscription_id) {
      const { getSubscription, getPriceId } = await import('@/lib/stripe')

      const subscription = await getSubscription(shop.stripe_subscription_id)
      const currentItem = subscription.items.data[0]

      if (!currentItem) {
        return NextResponse.json({ error: 'No subscription item found' }, { status: 500 })
      }

      // Determine billing from current subscription metadata
      const billing = subscription.metadata.billing || 'monthly'
      const newPriceId = getPriceId(newPlan, billing)

      // Update Stripe subscription with new price and metadata
      const res = await fetch(`https://api.stripe.com/v1/subscriptions/${shop.stripe_subscription_id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'items[0][id]': currentItem.id,
          'items[0][price]': newPriceId,
          'metadata[shopId]': shopId,
          'metadata[plan]': newPlan,
          'metadata[billing]': billing,
          'proration_behavior': 'create_prorations',
        }),
      })
      const updated = await res.json() as any
      if (updated.error) throw new Error(updated.error.message || 'Failed to update subscription')

      // The webhook will handle updating the shop in the DB
      return NextResponse.json({
        success: true,
        plan: newPlan,
        platformFeeSen: newFixedCut,
      })
    }

    // Fallback: no Stripe subscription — update Billplz collection directly
    const apiKey = process.env.BILLPLZ_API_KEY || ''
    const isSandbox = process.env.BILLPLZ_SANDBOX === 'true'
    const baseApiUrl = isSandbox ? 'https://www.billplz-sandbox.com/api/v3' : 'https://www.billplz.com/api/v3'
    const authHeader = `Basic ${btoa(`${apiKey}:`)}`
    const title = `${shop.bank_account_name || shopId} - ${newPlan}`.slice(0, 50)
    const colRes = await fetch(`${baseApiUrl}/collections`, {
      method: 'POST',
      headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    if (!colRes.ok) throw new Error('Failed to create Billplz collection')
    const collection = await colRes.json()

    await fetch(`${baseApiUrl}/collections/${collection.id}/split_payments`, {
      method: 'POST',
      headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ONSPRINT_BILLPLZ_EMAIL, fixed_cut: newFixedCut, variable_cut: 0, split_header: true }),
    })

    // Update shop with new plan and collection
    const { error: updateError } = await supabase
      .from('shops')
      .update({
        plan: newPlan,
        platform_fee_sen: newFixedCut,
        billplz_collection_id: collection.id,
      })
      .eq('id', shopId)

    if (updateError) {
      throw new Error(`Failed to update plan: ${updateError.message}`)
    }

    return NextResponse.json({
      success: true,
      plan: newPlan,
      platformFeeSen: newFixedCut,
      collectionId: collection.id,
    })
  } catch (err) {
    console.error('Plan upgrade error:', err)
    const message = err instanceof Error ? err.message : 'Failed to upgrade plan'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
