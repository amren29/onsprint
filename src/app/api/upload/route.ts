import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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
    const shopId = formData.get('shopId') as string
    const folder = formData.get('folder') as string || 'artwork'
    const refId = formData.get('refId') as string || 'misc'

    if (!file || !shopId) {
      return NextResponse.json({ error: 'file and shopId required' }, { status: 400 })
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
 * DELETE /api/upload?key=...
 */
export async function DELETE(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get('key')
    if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })

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
 * GET /api/upload?key=...
 * Get a file from R2 (for serving private files).
 */
export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get('key')
    if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })

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
    headers.set('Cache-Control', 'public, max-age=31536000')

    return new NextResponse(object.body, { headers })
  } catch (err) {
    console.error('Get file error:', err)
    return NextResponse.json({ error: 'Failed to get file' }, { status: 500 })
  }
}
