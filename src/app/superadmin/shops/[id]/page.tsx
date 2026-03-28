'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface ShopDetail {
  shop: any
  members: Array<{ user_id: string; email: string; name: string; role: string; created_at: string }>
  orderCount: number
}

export default function SuperAdminShopDetail() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<ShopDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const id = params.id as string

  function loadShop() {
    setLoading(true)
    fetch(`/api/superadmin/shops/${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { loadShop() }, [id])

  async function toggleSuspend() {
    if (!data?.shop) return
    setSaving(true)
    await fetch('/api/superadmin/shops', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, suspended: !data.shop.suspended }),
    })
    loadShop()
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="page-scroll">
        <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>Loading...</div>
      </div>
    )
  }

  if (!data?.shop) {
    return (
      <div className="page-scroll">
        <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>Shop not found</div>
      </div>
    )
  }

  const shop = data.shop

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn-ghost" onClick={() => router.push('/superadmin/shops')} style={{ fontSize: 12 }}>
            &larr; Back
          </button>
          <div>
            <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {shop.name}
              {shop.suspended && <span className="badge badge-warning">SUSPENDED</span>}
            </div>
            <div className="page-subtitle">{shop.slug} · {data.members.length} members · {data.orderCount} orders</div>
          </div>
        </div>
        <div className="page-actions">
          <button
            className={shop.suspended ? 'btn-primary' : 'btn-secondary'}
            onClick={toggleSuspend}
            disabled={saving}
            style={!shop.suspended ? { color: 'var(--negative)', borderColor: 'var(--negative)' } : {}}
          >
            {saving ? 'Saving...' : shop.suspended ? 'Unsuspend' : 'Suspend'}
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-label">Plan</div>
          </div>
          <div className="stat-value" style={{ textTransform: 'capitalize' }}>{shop.plan || 'free'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-label">Orders</div>
          </div>
          <div className="stat-value">{data.orderCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-label">Members</div>
          </div>
          <div className="stat-value">{data.members.length}</div>
        </div>
      </div>

      <div className="page-scroll">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Shop Details</h3>
          </div>
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px 16px', fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>ID</span>
            <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{shop.id}</span>
            <span style={{ color: 'var(--text-muted)' }}>Slug</span>
            <span>{shop.slug}</span>
            <span style={{ color: 'var(--text-muted)' }}>Created</span>
            <span>{new Date(shop.created_at).toLocaleString()}</span>
            {shop.plan_expires_at && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>Plan Expires</span>
                <span>{new Date(shop.plan_expires_at).toLocaleString()}</span>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Members</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.members.map(m => (
                <tr key={m.user_id}>
                  <td>{m.email}</td>
                  <td>{m.name || '—'}</td>
                  <td><span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{m.role}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(m.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {data.members.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No members</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
