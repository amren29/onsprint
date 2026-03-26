import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// Allowed folders
const ALLOWED_FOLDERS = new Set(['artwork', 'proofs', 'products'])

/**
 * Verify user is authenticated and belongs to the shop.
 * Returns verified shopId or null.
 */
async function verifyMembership(requestedShopId: string): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Check membership with admin client
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data: membership } = await admin
      .from('shop_members')
      .select('shop_id')
      .eq('user_id', user.id)
      .maybeSingle()

    // Return verified shopId — must match requested
    if (membership?.shop_id === requestedShopId) return membership.shop_id

    // Also check store_users (for customer uploads)
    const { data: storeUser } = await admin
      .from('store_users')
      .select('shop_id')
      .eq('auth_user_id', user.id)
      .eq('shop_id', requestedShopId)
      .maybeSingle()

    if (storeUser?.shop_id) return storeUser.shop_id

    return null
  } catch {
    return null
  }
}

/**
 * File upload to Cloudflare R2.
 *
 * POST /api/upload
 * Body: FormData with:
 *   - file: the file
 *   - shopId: shop ID
 *   - folder: 'artwork' | 'proofs' | 'products'
 *   - refId: reference ID (order_id, product_id, etc.)
 *
 * Returns: { url, key, fileName, size }
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const requestedShopId = formData.get('shopId') as string
    const folder = formData.get('folder') as string || 'artwork'
    const refId = formData.get('refId') as string || 'misc'

    if (!file || !requestedShopId) {
      return NextResponse.json({ error: 'file and shopId required' }, { status: 400 })
    }

    // SECURITY: Validate folder
    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: 'Invalid folder' }, { status: 400 })
    }

    // SECURITY: Verify user belongs to this shop
    const shopId = await verifyMembership(requestedShopId)
    if (!shopId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 100MB.' }, { status: 400 })
    }

    // Build R2 key
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const key = `${shopId}/${folder}/${refId}/${timestamp}-${safeName}`

    // Get R2 bucket from Cloudflare Workers context
    let bucket: any = null
    try {
      const { getCloudflareContext } = await import('@opennextjs/cloudflare')
      const { env } = await getCloudflareContext() as { env: any }
      bucket = env.R2_BUCKET
    } catch {
      // Fallback for local dev
    }

    if (!bucket) {
      return NextResponse.json({ error: 'R2 storage not available' }, { status: 500 })
    }

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer()
    await bucket.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
      customMetadata: {
        shopId,
        folder,
        refId,
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    })

    // Build public URL (requires public access enabled on bucket)
    // Format: https://<custom-domain>/<key> or https://pub-<id>.r2.dev/<key>
    const baseUrl = process.env.R2_PUBLIC_URL || ''
    const url = baseUrl ? `${baseUrl}/${key}` : key

    return NextResponse.json({
      url,
      key,
      fileName: file.name,
      size: file.size,
      contentType: file.type,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

/**
 * DELETE /api/upload?key=...&shopId=...
 */
export async function DELETE(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get('key')
    const requestedShopId = req.nextUrl.searchParams.get('shopId')
    if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })

    // SECURITY: Verify the key belongs to the user's shop
    if (requestedShopId) {
      const shopId = await verifyMembership(requestedShopId)
      if (!shopId || !key.startsWith(`${shopId}/`)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    }

    let bucket: any = null
    try {
      const { getCloudflareContext } = await import('@opennextjs/cloudflare')
      const { env } = await getCloudflareContext() as { env: any }
      bucket = env.R2_BUCKET
    } catch {}

    if (!bucket) return NextResponse.json({ error: 'R2 not available' }, { status: 500 })

    await bucket.delete(key)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete error:', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

/**
 * GET /api/upload?key=...&shopId=...
 * Get a file from R2 (for serving private files).
 */
export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get('key')
    const requestedShopId = req.nextUrl.searchParams.get('shopId')
    if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })

    // SECURITY: Verify the key belongs to the user's shop
    if (requestedShopId) {
      const shopId = await verifyMembership(requestedShopId)
      if (!shopId || !key.startsWith(`${shopId}/`)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    }

    let bucket: any = null
    try {
      const { getCloudflareContext } = await import('@opennextjs/cloudflare')
      const { env } = await getCloudflareContext() as { env: any }
      bucket = env.R2_BUCKET
    } catch {}

    if (!bucket) return NextResponse.json({ error: 'R2 not available' }, { status: 500 })

    const object = await bucket.get(key)
    if (!object) return NextResponse.json({ error: 'File not found' }, { status: 404 })

    const headers = new Headers()
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream')
    headers.set('Cache-Control', 'private, max-age=3600')

    return new NextResponse(object.body, { headers })
  } catch (err) {
    console.error('Get file error:', err)
    return NextResponse.json({ error: 'Failed to get file' }, { status: 500 })
  }
}
