import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {
            // Read-only in route handler GET
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ shop: null })
    }

    const { data: membership } = await supabase
      .from('shop_members')
      .select('shop_id, role, shops(id, name, slug, logo_url, currency, plan_id, settings)')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!membership) {
      return NextResponse.json({ shop: null })
    }

    const shop = membership.shops as any
    return NextResponse.json({
      shop: {
        id: membership.shop_id,
        slug: shop?.slug || '',
        name: shop?.name || '',
      },
    })
  } catch {
    return NextResponse.json({ shop: null })
  }
}
