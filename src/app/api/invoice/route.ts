import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

/**
 * GET /api/invoice?orderId=X&shopId=Y
 * Returns an HTML invoice that can be printed/saved as PDF
 */
export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get('orderId')
    const shopId = req.nextUrl.searchParams.get('shopId')

    if (!orderId || !shopId) {
      return new NextResponse('Missing orderId or shopId', { status: 400 })
    }

    const supabase = getSupabase()

    // Fetch order
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('shop_id', shopId)
      .single()

    if (!order) return new NextResponse('Order not found', { status: 404 })

    // Fetch shop info
    const { data: shop } = await supabase
      .from('shops')
      .select('name, slug, logo_url, settings')
      .eq('id', shopId)
      .single()

    // Fetch store settings for contact info
    const { data: settings } = await supabase
      .from('store_settings')
      .select('config')
      .eq('shop_id', shopId)
      .maybeSingle()

    const config = (settings?.config || {}) as Record<string, any>
    const shopName = shop?.name || config.storeName || 'Print Shop'
    const shopEmail = config.email || ''
    const shopPhone = config.phone || ''
    const shopAddress = config.address || ''
    const logoUrl = shop?.logo_url || config.logoUrl || ''

    // Parse order data
    const items = (order.items || []) as any[]
    const subtotal = order.subtotal || items.reduce((s: number, i: any) => s + (i.total || 0), 0)
    const sstRate = order.sst_rate || 0
    const sstAmount = order.sst_amount || 0
    const shippingCost = order.shipping_cost || 0
    const grandTotal = order.grand_total || subtotal + sstAmount + shippingCost
    const discount = order.discount || 0
    const currency = order.currency || 'MYR'
    const createdAt = order.created_at ? new Date(order.created_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
    const seqId = order.seq_id || orderId.slice(0, 8)

    const fmtRM = (n: number) => `RM ${n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${seqId} — ${shopName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Fira Sans', -apple-system, sans-serif; color: #1a1a1a; background: #fff; font-size: 13px; line-height: 1.5; }
    .invoice { max-width: 800px; margin: 0 auto; padding: 48px 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .logo-area { display: flex; align-items: center; gap: 12px; }
    .logo-icon { width: 40px; height: 40px; background: #7c3aed; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .shop-name { font-size: 20px; font-weight: 700; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { font-size: 28px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px; }
    .invoice-title .inv-num { font-size: 13px; color: #888; margin-top: 4px; }
    .meta-row { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
    .meta-block h3 { font-size: 10px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
    .meta-block p { font-size: 13px; color: #444; line-height: 1.6; }
    .meta-block strong { font-weight: 600; color: #1a1a1a; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead th { text-align: left; font-size: 10px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.08em; padding: 10px 12px; border-bottom: 2px solid #f0f0f0; }
    thead th:last-child { text-align: right; }
    tbody td { padding: 12px; border-bottom: 1px solid #f5f5f5; font-size: 13px; color: #444; }
    tbody td:last-child { text-align: right; font-weight: 600; color: #1a1a1a; }
    .item-name { font-weight: 600; color: #1a1a1a; }
    .item-spec { font-size: 11px; color: #999; margin-top: 2px; }
    .totals { margin-left: auto; width: 280px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #666; }
    .total-row.grand { border-top: 2px solid #1a1a1a; padding-top: 12px; margin-top: 8px; font-size: 16px; font-weight: 700; color: #1a1a1a; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #f0f0f0; text-align: center; }
    .footer p { font-size: 11px; color: #bbb; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; }
    .badge-confirmed { background: #f0fdf4; color: #22c55e; }
    .badge-pending { background: #fffbeb; color: #f59e0b; }
    @media print {
      body { background: #fff; }
      .invoice { padding: 20px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background: #f5f5f5; padding: 12px; text-align: center;">
    <button onclick="window.print()" style="padding: 8px 24px; background: #1a1a1a; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;">
      Download PDF / Print
    </button>
  </div>

  <div class="invoice">
    <!-- Header -->
    <div class="header">
      <div class="logo-area">
        ${logoUrl ? `<img src="${logoUrl}" alt="" style="width: 40px; height: 40px; border-radius: 10px; object-fit: contain;">` : `<div class="logo-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="white"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.4"/></svg></div>`}
        <div>
          <div class="shop-name">${shopName}</div>
          ${shopPhone ? `<div style="font-size: 12px; color: #888;">${shopPhone}</div>` : ''}
        </div>
      </div>
      <div class="invoice-title">
        <h1>INVOICE</h1>
        <div class="inv-num">${seqId}</div>
        <div class="inv-num">${createdAt}</div>
      </div>
    </div>

    <!-- Meta -->
    <div class="meta-row">
      <div class="meta-block">
        <h3>Bill To</h3>
        <p>
          <strong>${order.customer_name || 'Customer'}</strong><br>
          ${order.delivery_address ? `${order.delivery_address}<br>` : ''}
        </p>
      </div>
      <div class="meta-block" style="text-align: right;">
        <h3>From</h3>
        <p>
          <strong>${shopName}</strong><br>
          ${shopEmail ? `${shopEmail}<br>` : ''}
          ${shopAddress ? `${shopAddress}` : ''}
        </p>
      </div>
    </div>

    <!-- Order info -->
    <div style="display: flex; gap: 24px; margin-bottom: 24px;">
      <div><span style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.1em;">Status</span><br><span class="badge ${order.status === 'Confirmed' ? 'badge-confirmed' : 'badge-pending'}">${order.status}</span></div>
      <div><span style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.1em;">Delivery</span><br><span style="font-size: 13px; font-weight: 500;">${order.delivery_method || 'Self-Pickup'}</span></div>
      <div><span style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.1em;">Payment</span><br><span style="font-size: 13px; font-weight: 500;">${currency}</span></div>
    </div>

    <!-- Items table -->
    <table>
      <thead>
        <tr>
          <th style="width: 50%">Item</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item: any) => `
        <tr>
          <td>
            <div class="item-name">${item.name || ''}</div>
            ${item.optionSummary ? `<div class="item-spec">${item.optionSummary}</div>` : ''}
          </td>
          <td>${item.qty || 1}</td>
          <td>${fmtRM(item.unitPrice || item.total / (item.qty || 1))}</td>
          <td>${fmtRM(item.total || 0)}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <div class="total-row"><span>Subtotal</span><span>${fmtRM(subtotal)}</span></div>
      ${discount > 0 ? `<div class="total-row"><span>Discount</span><span>-${fmtRM(discount)}</span></div>` : ''}
      ${shippingCost > 0 ? `<div class="total-row"><span>Shipping</span><span>${fmtRM(shippingCost)}</span></div>` : ''}
      ${sstAmount > 0 ? `<div class="total-row"><span>SST (${sstRate}%)</span><span>${fmtRM(sstAmount)}</span></div>` : ''}
      <div class="total-row grand"><span>Total</span><span>${fmtRM(grandTotal)}</span></div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Thank you for your business.</p>
      <p style="margin-top: 4px;">Generated by Onsprint — onsprint.my</p>
    </div>
  </div>
</body>
</html>`

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (err) {
    console.error('Invoice error:', err)
    return new NextResponse('Failed to generate invoice', { status: 500 })
  }
}
