'use client'

import { useEffect, useState } from 'react'

interface UserRow {
  id: string
  email: string
  name: string
  created_at: string
  last_sign_in_at: string | null
  shops: Array<{ shop_id: string; role: string; shops: { name: string } | null }>
}

export default function SuperAdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    params.set('page', String(page))

    fetch(`/api/superadmin/users?${params}`)
      .then(r => r.json())
      .then(data => {
        setUsers(data.users || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [search, page])

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Users</div>
          <div className="page-subtitle">All registered users across the platform</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Search by email or name..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="form-input"
          style={{ width: 280 }}
        />
      </div>

      <div className="page-scroll">
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Shop(s)</th>
                <th>Created</th>
                <th>Last Sign In</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No users found</td></tr>
              ) : users.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.name || '—'}</td>
                  <td>
                    {user.shops.length > 0 ? (
                      user.shops.map((s, i) => (
                        <span key={i} className="badge badge-info" style={{ marginRight: 4 }}>
                          {(s.shops as any)?.name || s.shop_id.slice(0, 8)}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>No shop</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '12px 0' }}>
          <button
            className="btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <span style={{ alignSelf: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            Page {page}
          </span>
          <button
            className="btn-secondary"
            onClick={() => setPage(p => p + 1)}
            disabled={users.length < 20}
          >
            Next
          </button>
        </div>
      </div>
    </>
  )
}
