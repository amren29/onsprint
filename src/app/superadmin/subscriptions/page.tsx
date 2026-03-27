'use client'

import { useEffect, useState } from 'react'

interface SubData {
  shops: Array<{
    id: string
    name: string
    slug: string
    plan: string
    plan_expires_at: string | null
    stripe_subscription_id: string | null
    created_at: string
  }>
  stats: { activeSubs: number; trialSubs: number; expiredSubs: number; mrr: number }
}

export default function SuperAdminSubscriptions() {
  const [data, setData] = useState<SubData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/superadmin/subscriptions')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="page-scroll">
        <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>Loading...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="page-scroll">
        <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>Failed to load data</div>
      </div>
    )
  }

  const now = new Date()

  function getStatus(shop: SubData['shops'][0]) {
    if (!shop.plan || shop.plan === 'free') return 'free'
    if (shop.plan === 'trial') return 'trial'
    if (shop.plan_expires_at && new Date(shop.plan_expires_at) < now) return 'expired'
    return 'active'
  }

  return (
    <>
      <h1 style={{ fontSize: 18, fontWeight: 700 }}>Subscriptions</h1>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-label">MRR</div>
          </div>
          <div className="stat-value">RM {data.stats.mrr}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-label">Active</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--success-text)' }}>{data.stats.activeSubs}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-label">Trial</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{data.stats.trialSubs}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-label">Expired/Free</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--text-muted)' }}>{data.stats.expiredSubs}</div>
        </div>
      </div>

      <div className="page-scroll">
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Shop</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Billing</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {data.shops.map(shop => {
                const status = getStatus(shop)
                return (
                  <tr key={shop.id}>
                    <td style={{ fontWeight: 500 }}>{shop.name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{shop.plan || 'free'}</td>
                    <td>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: status === 'active' ? 'var(--success-bg)' : status === 'trial' ? 'var(--warning-bg)' : status === 'expired' ? 'var(--danger-bg)' : 'var(--bg-elevated)',
                        color: status === 'active' ? 'var(--success-text)' : status === 'trial' ? 'var(--warning-text)' : status === 'expired' ? 'var(--danger-text)' : 'var(--text-muted)',
                      }}>
                        {status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {shop.stripe_subscription_id ? 'Stripe' : 'Manual'}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {shop.plan_expires_at
                        ? new Date(shop.plan_expires_at).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                )
              })}
              {data.shops.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No shops</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
