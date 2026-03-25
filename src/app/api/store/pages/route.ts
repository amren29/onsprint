import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function GET(req: NextRequest) {
  try {
    const shopId = req.nextUrl.searchParams.get('shopId')
    if (!shopId) return NextResponse.json({ error: 'shopId query parameter is required' }, { status: 400 })

    const pageId = req.nextUrl.searchParams.get('pageId')
    const all = req.nextUrl.searchParams.get('all')
    const supabase = getSupabase()

    // If all=1, return all pages for the shop (used by editor)
    if (all === '1') {
      const { data, error } = await supabase.from('store_pages').select('*').eq('shop_id', shopId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ pages: data })
    }

    // Single page fetch
    const { data, error } = await supabase
      .from('store_pages')
      .select('*')
      .eq('shop_id', shopId)
      .eq('page_id', pageId || 'homepage')
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ page: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST: Save a store page (sections + optional globals) — used by editor
export async function POST(req: NextRequest) {
  try {
    const { shopId, pageId, sections, globals, syncGlobals } = await req.json()
    if (!shopId || !pageId || !sections) {
      return NextResponse.json({ error: 'shopId, pageId, sections required' }, { status: 400 })
    }

    const supabase = getSupabase()
    const upsertData: Record<string, unknown> = { shop_id: shopId, page_id: pageId, sections }
    if (globals !== undefined) upsertData.globals = globals

    const { error } = await supabase
      .from('store_pages')
      .upsert(upsertData, { onConflict: 'shop_id,page_id' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Sync globals to all pages if requested
    if (syncGlobals && globals) {
      await supabase.from('store_pages').update({ globals }).eq('shop_id', shopId)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
