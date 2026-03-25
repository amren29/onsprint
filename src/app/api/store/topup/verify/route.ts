import { NextRequest, NextResponse } from 'next/server'

async function fetchBill(billId: string) {
  const apiKey = process.env.BILLPLZ_API_KEY || ''
  const isSandbox = process.env.BILLPLZ_SANDBOX === 'true'
  const baseApiUrl = isSandbox
    ? 'https://www.billplz-sandbox.com/api/v3'
    : 'https://www.billplz.com/api/v3'
  const authHeader = `Basic ${btoa(`${apiKey}:`)}`

  const res = await fetch(`${baseApiUrl}/bills/${billId}`, {
    headers: { 'Authorization': authHeader },
  })
  if (!res.ok) throw new Error(`Billplz API error: ${res.status}`)
  return res.json()
}

export async function GET(req: NextRequest) {
  try {
    const billplzId = req.nextUrl.searchParams.get('billplz_id')
    if (!billplzId) {
      return NextResponse.json({ error: 'Missing billplz_id' }, { status: 400 })
    }

    const bill = await fetchBill(billplzId)

    if (!bill.paid) {
      return NextResponse.json({ error: 'Payment not completed', status: bill.state }, { status: 400 })
    }

    return NextResponse.json({
      verified: true,
      amount: bill.paid_amount / 100,
      amountTotal: bill.paid_amount / 100,
      paymentMethod: 'billplz',
    })
  } catch (err) {
    console.error('Topup verify error:', err)
    const message = err instanceof Error ? err.message : 'Failed to verify payment'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
