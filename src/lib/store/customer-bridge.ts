/**
 * Upsert an online store customer into the admin customer directory (Supabase).
 * Uses direct Supabase REST API to avoid 'use server' imports (Cloudflare Workers compat).
 */
export async function upsertOnlineCustomer(
  shopId: string,
  contact: { name: string; email: string; phone: string; company: string },
  _orderTotal: number,
) {
  if (!contact.email.trim() || !shopId) return

  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/customers`,
      {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          shop_id: shopId,
          name: contact.name,
          email: contact.email.trim().toLowerCase(),
          phone: contact.phone || '',
          company: contact.company || '',
          customer_type: 'Individual',
          status: 'Active',
        }),
      }
    )
  } catch {
    // Silently fail — non-critical for checkout flow
  }
}
