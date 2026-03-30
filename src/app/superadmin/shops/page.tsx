'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CustomSelect from '@/components/CustomSelect'

interface Shop {
  id: string
  name: string
  slug: string
  plan: string
  created_at: string
  suspended: boolean
}

export default function SuperAdminShops() {
  const router = useRouter()
  const [shops, setShops] = useState<Shop[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPlan, setNewPlan] = useState('free')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (planFilter) params.set('plan', planFilter)
    params.set('page', String(page))

    fetch(`/api/superadmin/shops?${params}`)
      .then(r => r.json())
      .then(data => {
        setShops(data.shops || [])
        setTotal(data.total || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [search, planFilter, page])

  const totalPages = Math.ceil(total / 20)

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Shops</div>
          <div className="page-subtitle">{total} shops across the platform</div>
        </div>
        <div className="page-actions">
          <button className="topbar-btn" onClick={() => setShowCreate(!showCreate)}>+ Create Shop</button>
        </div>
      </div>

      {showCreate && (
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header"><h3 className="card-title">Create New Shop</h3></div>
          <div style={{ padding: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <span className="form-label">Shop Name *</span>
              <input value={newName} onChange={e => setNewName(e.target.value)} className="form-input" style={{ width: 180 }} placeholder="My Print Shop" />
            </div>
            <div>
              <span className="form-label">Owner Email</span>
              <input value={newEmail} onChange={e => setNewEmail(e.target.value)} className="form-input" style={{ width: 200 }} placeholder="owner@email.com" />
            </div>
            <div>
              <span className="form-label">Plan</span>
              <CustomSelect
                value={newPlan}
                onChange={v => setNewPlan(v)}
                options={[
                  { value: 'free', label: 'Free' },
                  { value: 'trial', label: 'Trial' },
                  { value: 'starter', label: 'Starter' },
                  { value: 'pro', label: 'Pro' },
                  { value: 'business', label: 'Business' },
                ]}
                style={{ width: 110 }}
              />
            </div>
            <button className="btn-primary" disabled={creating || !newName} onClick={async () => {
              setCreating(true)
              const res = await fetch('/api/superadmin/shops/create', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, owner_email: newEmail || undefined, plan: newPlan }),
              })
              if (res.ok) { setNewName(''); setNewEmail(''); setShowCreate(false); setPage(1) }
              else { const d = await res.json(); alert(d.error) }
              setCreating(false)
            }}>{creating ? '...' : 'Create'}</button>
            <button className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="filter-row">
        <div className="filter-bar" />
        <div className="filter-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '6px 12px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search shops..."
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 12.5, color: 'var(--text-primary)', width: 180 }} />
          </div>
          <CustomSelect
            value={planFilter}
            onChange={v => { setPlanFilter(v); setPage(1) }}
            options={[
              { value: '', label: 'All Plans' },
              { value: 'free', label: 'Free' },
              { value: 'trial', label: 'Trial' },
              { value: 'starter', label: 'Starter' },
              { value: 'pro', label: 'Pro' },
              { value: 'business', label: 'Business' },
            ]}
            style={{ width: 130 }}
          />
        </div>
      </div>

      <div className="page-scroll">
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Plan</th>
                <th>Created</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Loading...</td></tr>
              ) : shops.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No shops found</td></tr>
              ) : shops.map(shop => (
                <tr
                  key={shop.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/superadmin/shops/${shop.id}`)}
                >
                  <td><div className="cell-name">{shop.name}</div></td>
                  <td><div className="cell-sub">{shop.slug}</div></td>
                  <td>
                    <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                      {shop.plan || 'free'}
                    </span>
                  </td>
                  <td><div className="cell-sub">{new Date(shop.created_at).toLocaleDateString()}</div></td>
                  <td>
                    {shop.suspended ? (
                      <span className="badge badge-warning">Suspended</span>
                    ) : (
                      <span className="badge badge-success">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '12px 0' }}>
            <button
              className="btn-secondary"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>
            <span style={{ alignSelf: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn-secondary"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  )
}
