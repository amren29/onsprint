import { NextRequest, NextResponse } from 'next/server'
import { verifySuperAdmin, getServiceClient } from '@/lib/superadmin'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifySuperAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const db = getServiceClient()

  const [shopRes, membersRes, ordersRes] = await Promise.all([
    db.from('shops').select('*').eq('id', id).maybeSingle(),
    db.from('shop_members').select('user_id, role, created_at').eq('shop_id', id),
    db.from('orders').select('id', { count: 'exact' }).eq('shop_id', id),
  ])

  if (!shopRes.data) {
    return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
  }

  // Get user emails for members
  const members = []
  for (const m of (membersRes.data || [])) {
    const { data: { user } } = await db.auth.admin.getUserById(m.user_id)
    members.push({
      ...m,
      email: user?.email || 'Unknown',
      name: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
    })
  }

  return NextResponse.json({
    shop: shopRes.data,
    members,
    orderCount: ordersRes.count || 0,
  })
}
