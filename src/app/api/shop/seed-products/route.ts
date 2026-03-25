import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import seedProducts from '@/data/seed-products.json'

export const dynamic = 'force-dynamic'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

/**
 * POST: Seed products for a shop based on selected service groups.
 * Body: { shopId, groups: ["standard", "signage_office", ...] }
 *
 * "standard" is always included (basic print products every shop needs).
 */
export async function POST(req: NextRequest) {
  try {
    const { shopId, groups } = await req.json()
    if (!shopId || !groups?.length) {
      return NextResponse.json({ error: 'shopId and groups required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Ensure "standard" is always included
    const selectedGroups = new Set<string>(groups)
    selectedGroups.add('standard')

    // Filter seed products by selected groups
    const toSeed = (seedProducts as any[]).filter(p => selectedGroups.has(p.group))

    // Check which products already exist (by sku/name)
    const { data: existing } = await supabase
      .from('products')
      .select('sku, name')
      .eq('shop_id', shopId)

    const existingSlugs = new Set((existing || []).map((p: any) => p.sku))

    // Only seed products that don't already exist
    const newProducts = toSeed.filter(p => !existingSlugs.has(p.slug))

    if (newProducts.length === 0) {
      return NextResponse.json({ seeded: 0, message: 'All products already exist' })
    }

    // Generate seq_ids and insert
    let seeded = 0
    for (const p of newProducts) {
      // Get next seq_id
      let seqId = `CGRP-${seeded + 1}`
      try {
        const { data: sid } = await supabase.rpc('next_seq', { p_shop_id: shopId, p_prefix: 'CGRP', p_pad: 2 })
        if (sid) seqId = sid
      } catch { /* use fallback */ }

      // Convert option_groups to editor format (dropdown style)
      const optionGroups = (p.options || []).map((opt: any) => ({
        groupName: opt.name || '',
        selectionType: 'single',
        displayType: 'dropdown',
        required: true,
        options: (opt.values || []).map((v: string) => ({
          label: v,
          modifierType: 'none',
          modifierValue: 0,
        })),
      }))

      // Store pricing as total prices per quantity tier
      const volumeTiers = (p.pricing || []).map((t: any) => ({
        minQty: t.qty,
        unitPrice: t.price, // TOTAL price for this quantity (not per-unit)
      }))

      // Determine pricing type from seed data
      const pricingType = p._pricing_type || 'volume'
      // For sqft/fixed, use the raw price from spreadsheet (total for qty 1)
      const rawFirstPrice = p.pricing?.[0]?.price || 0
      const basePrice = volumeTiers.length > 0 ? volumeTiers[0].unitPrice : rawFirstPrice

      // Build sizes payload based on pricing type
      let sizesPayload: Record<string, unknown> = {}
      let pricingPayload: Record<string, unknown> = {}
      let isBulkVariant = false

      if (pricingType === 'sqft') {
        // Custom size + predefined sizes dropdown
        sizesPayload = {
          mode: 'both',
          fixed: (p.sizes || []).map((s: string, i: number) => ({
            label: s,
            width: '', height: '', unit: 'mm',
            basePrice: volumeTiers[i]?.unitPrice || basePrice,
            volumeTiers: volumeTiers,
          })),
          sqft: { pricePerSqft: basePrice, minCharge: basePrice },
        }
        pricingPayload = volumeTiers.length > 0 ? { volumeTiers } : {}
      } else if (pricingType === 'fixed_per_size') {
        // Each size has its own price from volume tiers
        sizesPayload = p.sizes?.length > 0 ? {
          mode: 'fixed',
          fixed: p.sizes.map((s: string, i: number) => ({
            label: s,
            width: '', height: '', unit: 'mm',
            basePrice: volumeTiers[i]?.unitPrice || basePrice,
            volumeTiers: volumeTiers,
          })),
        } : {}
        pricingPayload = volumeTiers.length > 0 ? { volumeTiers } : {}
      } else if (pricingType === 'fixed') {
        // Simple fixed price per unit
        sizesPayload = {}
        pricingPayload = {}
      } else {
        // Volume pricing — quantity tiers
        if (p.sizes?.length > 0) {
          sizesPayload = {
            mode: 'fixed',
            fixed: p.sizes.map((s: string) => ({
              label: s,
              width: '', height: '', unit: 'mm',
              volumeTiers: volumeTiers,
            })),
          }
        } else {
          // No sizes — store volume tiers at product level, use standard dropdown UI (not bulk variant)
          isBulkVariant = false
        }
        pricingPayload = volumeTiers.length > 0 ? { volumeTiers } : {}
      }

      const { error } = await supabase.from('products').insert({
        shop_id: shopId,
        seq_id: seqId,
        name: p.name,
        sku: p.slug,
        description: p.category,
        notes: p.duration || '',
        pricing_type: pricingType === 'sqft' ? 'sqft' : pricingType === 'fixed' ? 'fixed' : 'volume',
        base_price: basePrice,
        pricing: pricingPayload,
        option_groups: optionGroups,
        sizes: sizesPayload,
        main_image: '',
        variant_images: [],
        bulk_variant: isBulkVariant,
        product_info: { group: p.group, source_url: p.url, starting_price: p.starting_price, processDuration: p.duration },
        status: 'Active',
        visibility: 'published',
      })
      if (error) console.error(`Failed to seed ${p.name}:`, error.message)

      if (!error) seeded++
    }

    // Also seed categories
    const categories = [...new Set(newProducts.map(p => p.category).filter(Boolean))]
    for (const cat of categories) {
      const { data: existingCat } = await supabase
        .from('categories')
        .select('id')
        .eq('shop_id', shopId)
        .eq('name', cat)
        .maybeSingle()

      if (!existingCat) {
        let catSeq = cat
        try {
          const { data: sid } = await supabase.rpc('next_seq', { p_shop_id: shopId, p_prefix: 'CAT', p_pad: 3 })
          if (sid) catSeq = sid
        } catch {}

        const { data: newCat } = await supabase.from('categories').insert({
          shop_id: shopId,
          seq_id: catSeq,
          name: cat,
        }).select('id').single()

        // Link products to category
        if (newCat) {
          const slugs = newProducts.filter(p => p.category === cat).map(p => p.slug)
          for (const sku of slugs) {
            await supabase.from('products').update({ category_id: newCat.id }).eq('shop_id', shopId).eq('sku', sku)
          }
        }
      }
    }

    return NextResponse.json({ seeded, total: newProducts.length })
  } catch (err) {
    console.error('Seed products error:', err)
    return NextResponse.json({ error: 'Failed to seed products' }, { status: 500 })
  }
}
