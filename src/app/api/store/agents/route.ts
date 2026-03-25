import { NextRequest, NextResponse } from 'next/server'
import { createAgent } from '@/lib/db/agents'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { shopId, ...data } = await req.json()
    if (!shopId) return NextResponse.json({ error: 'shopId required' }, { status: 400 })
    const agent = await createAgent(shopId, data)
    return NextResponse.json({ agent })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 })
  }
}
