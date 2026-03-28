'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search shops..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="form-input"
          style={{ width: 240 }}
        />
        <select
          value={planFilter}
          onChange={e => { setPlanFilter(e.target.value); setPage(1) }}
          className="form-input"
          style={{ width: 130 }}
        >
          <option value="">All Plans</option>
          <option value="free">Free</option>
          <option value="trial">Trial</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
          <option value="business">Business</option>
        </select>
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
                  <td style={{ fontWeight: 500 }}>{shop.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{shop.slug}</td>
                  <td>
                    <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                      {shop.plan || 'free'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(shop.created_at).toLocaleDateString()}
                  </td>
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
