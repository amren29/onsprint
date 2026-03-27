import { NextRequest, NextResponse } from 'next/server'
import { verifySuperAdmin, getServiceClient } from '@/lib/superadmin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const admin = await verifySuperAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = 20

  const db = getServiceClient()
  const { data: { users }, error } = await db.auth.admin.listUsers({
    page,
    perPage,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get shop memberships for all users
  const userIds = users.map(u => u.id)
  const { data: memberships } = await db
    .from('shop_members')
    .select('user_id, shop_id, role, shops(name)')
    .in('user_id', userIds)

  const membershipMap: Record<string, any[]> = {}
  for (const m of (memberships || [])) {
    if (!membershipMap[m.user_id]) membershipMap[m.user_id] = []
    membershipMap[m.user_id].push(m)
  }

  let filtered = users.map(u => ({
    id: u.id,
    email: u.email || '',
    name: u.user_metadata?.full_name || u.user_metadata?.name || '',
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    shops: membershipMap[u.id] || [],
  }))

  if (search) {
    const s = search.toLowerCase()
    filtered = filtered.filter(u =>
      u.email.toLowerCase().includes(s) || u.name.toLowerCase().includes(s)
    )
  }

  return NextResponse.json({ users: filtered, page, perPage })
}
