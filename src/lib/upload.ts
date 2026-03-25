/**
 * Upload a file to Cloudflare R2 via /api/upload.
 *
 * Usage:
 *   const result = await uploadFile(file, shopId, 'artwork', orderId)
 *   console.log(result.url) // public R2 URL
 */
export async function uploadFile(
  file: File,
  shopId: string,
  folder: 'artwork' | 'proofs' | 'products',
  refId: string,
): Promise<{ url: string; key: string; fileName: string; size: number; contentType: string }> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('shopId', shopId)
  formData.append('folder', folder)
  formData.append('refId', refId)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  return data
}

/**
 * Delete a file from R2.
 */
export async function deleteFile(key: string): Promise<void> {
  await fetch(`/api/upload?key=${encodeURIComponent(key)}`, { method: 'DELETE' })
}
