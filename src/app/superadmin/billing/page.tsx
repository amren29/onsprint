'use client'

import { useEffect, useState } from 'react'
import CustomSelect from '@/components/CustomSelect'

type Tab = 'payments' | 'coupons'
const fmtRM = (n: number) => `RM ${(n || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`

export default function SuperAdminBilling() {
  const [tab, setTab] = useState<Tab>('coupons')
  const [coupons, setCoupons] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Coupon form
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState('percent')
  const [discountValue, setDiscountValue] = useState('')
  const [maxUses, setMaxUses] = useState('')
  const [creating, setCreating] = useState(false)

  function loadData() {
    setLoading(true)
    if (tab === 'coupons') {
      fetch('/api/superadmin/billing/coupons')
        .then(r => r.json()).then(d => { setCoupons(d.coupons || []); setLoading(false) })
    } else {
      fetch('/api/superadmin/billing/payments')
        .then(r => r.json()).then(d => { setPayments(d.payments || []); setLoading(false) })
    }
  }

  useEffect(() => { loadData() }, [tab])

  async function createCoupon() {
    if (!code || !discountValue) return
    setCreating(true)
    const res = await fetch('/api/superadmin/billing/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code, discount_type: discountType,
        discount_value: parseFloat(discountValue),
        max_uses: maxUses ? parseInt(maxUses) : null,
      }),
    })
    if (res.ok) {
      setCode(''); setDiscountValue(''); setMaxUses('')
      loadData()
    }
    setCreating(false)
  }

  async function deactivateCoupon(id: string) {
    if (!confirm('Deactivate this coupon?')) return
    await fetch('/api/superadmin/billing/coupons', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadData()
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Billing</div>
          <div className="page-subtitle">Payment history and coupon management</div>
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-bar">
          <button className={`filter-tab${tab === 'coupons' ? ' active' : ''}`} onClick={() => setTab('coupons')}>Coupons</button>
          <button className={`filter-tab${tab === 'payments' ? ' active' : ''}`} onClick={() => setTab('payments')}>Payments</button>
        </div>
      </div>

      <div className="page-scroll">
        {loading ? (
          <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Loading...</div>
        ) : tab === 'coupons' ? (
          <>
            <div className="card">
              <div className="card-header"><h3 className="card-title">Create Coupon</h3></div>
              <div style={{ padding: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <span className="form-label">Code</span>
                  <input value={code} onChange={e => setCode(e.target.value)} className="form-input" style={{ width: 120 }} placeholder="SAVE20" />
                </div>
                <div>
                  <span className="form-label">Type</span>
                  <CustomSelect
                    value={discountType}
                    onChange={v => setDiscountType(v)}
                    options={[
                      { value: 'percent', label: 'Percent' },
                      { value: 'fixed', label: 'Fixed (RM)' },
                    ]}
                    style={{ width: 100 }}
                  />
                </div>
                <div>
                  <span className="form-label">Value</span>
                  <input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} className="form-input" style={{ width: 80 }} placeholder="20" />
                </div>
                <div>
                  <span className="form-label">Max Uses</span>
                  <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} className="form-input" style={{ width: 80 }} placeholder="100" />
                </div>
                <button className="btn-primary" onClick={createCoupon} disabled={creating || !code || !discountValue}>
                  {creating ? '...' : 'Create'}
                </button>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h3 className="card-title">All Coupons</h3></div>
              <table className="data-table">
                <thead><tr><th>Code</th><th>Discount</th><th>Used</th><th>Max</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {coupons.map(c => (
                    <tr key={c.id}>
                      <td><div className="cell-name" style={{ fontFamily: 'monospace' }}>{c.code}</div></td>
                      <td>{c.discount_type === 'percent' ? `${c.discount_value}%` : fmtRM(c.discount_value)}</td>
                      <td>{c.used_count}</td>
                      <td>{c.max_uses || '—'}</td>
                      <td><span className={`badge ${c.active ? 'badge-success' : 'badge-pending'}`}>{c.active ? 'Active' : 'Inactive'}</span></td>
                      <td>
                        {c.active && (
                          <button className="btn-ghost" style={{ fontSize: 11, color: 'var(--negative)' }} onClick={() => deactivateCoupon(c.id)}>
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No coupons</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="card">
            <div className="card-header"><h3 className="card-title">Payment Transactions</h3></div>
            <table className="data-table">
              <thead><tr><th>ID</th><th>Shop</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.id}>
                    <td><div className="cell-sub" style={{ fontFamily: 'monospace' }}>{p.id?.slice(0, 8)}</div></td>
                    <td><div className="cell-sub">{(p.shops as any)?.name || '—'}</div></td>
                    <td><div className="cell-name">{fmtRM(p.amount)}</div></td>
                    <td><span className={`badge ${p.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span></td>
                    <td><div className="cell-sub">{new Date(p.created_at).toLocaleDateString()}</div></td>
                  </tr>
                ))}
                {payments.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No payments</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
