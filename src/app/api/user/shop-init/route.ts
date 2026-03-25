import { NextRequest, NextResponse } from 'next/server'
import { getUserShop, createShop } from '@/lib/db/shops'

export const dynamic = 'force-dynamic'

// GET: Get user's shop
export async function GET() {
  try {
    const result = await getUserShop()
    if (result) {
      return NextResponse.json({
        shopId: result.shopId,
        role: result.role,
        shop: result.shop,
      })
    }
    return NextResponse.json({ shopId: null })
  } catch {
    return NextResponse.json({ shopId: null })
  }
}

// POST: Create shop for user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await createShop({ name: body.name || 'My Print Shop' })
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ shop: result.shop })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create shop' },
      { status: 500 }
    )
  }
}
