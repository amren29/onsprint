import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getOrderById, updateOrder } from '@/lib/db/orders'

export const dynamic = 'force-dynamic'

// POST: Create order
export async function POST(req: NextRequest) {
  try {
    const { shopId, ...orderData } = await req.json()
    if (!shopId) return NextResponse.json({ error: 'shopId required' }, { status: 400 })
    const order = await createOrder(shopId, orderData)
    return NextResponse.json({ order })
  } catch (err: any) {
    console.error('Create order error:', err)
    return NextResponse.json({ error: err.message || 'Failed to create order' }, { status: 500 })
  }
}

// PUT: Update order
export async function PUT(req: NextRequest) {
  try {
    const { shopId, orderId, ...updates } = await req.json()
    if (!shopId || !orderId) return NextResponse.json({ error: 'shopId and orderId required' }, { status: 400 })
    const order = await updateOrder(shopId, orderId, updates)
    return NextResponse.json({ order })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update order' }, { status: 500 })
  }
}

// GET: Get order by ID
export async function GET(req: NextRequest) {
  try {
    const shopId = req.nextUrl.searchParams.get('shopId')
    const orderId = req.nextUrl.searchParams.get('orderId')
    if (!shopId || !orderId) return NextResponse.json({ error: 'shopId and orderId required' }, { status: 400 })
    const order = await getOrderById(shopId, orderId)
    return NextResponse.json({ order })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to get order' }, { status: 500 })
  }
}
