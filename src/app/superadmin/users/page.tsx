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
  const [resetting, setResetting] = useState<string | null>(null)

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

  async function resetPassword(userId: string, email: string) {
    if (!confirm(`Send password reset email to ${email}?`)) return
    setResetting(userId)
    const res = await fetch('/api/superadmin/users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    })
    if (res.ok) {
      alert(`Reset email sent to ${email}`)
    } else {
      const data = await res.json()
      alert(`Failed: ${data.error}`)
    }
    setResetting(null)
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Users</div>
          <div className="page-subtitle">All registered users across the platform</div>
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-bar" />
        <div className="filter-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '6px 12px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by email or name..."
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 12.5, color: 'var(--text-primary)', width: 200 }} />
          </div>
        </div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No users found</td></tr>
              ) : users.map(user => (
                <tr key={user.id}>
                  <td><div className="cell-name">{user.email}</div></td>
                  <td><div className="cell-sub">{user.name || '—'}</div></td>
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
                  <td><div className="cell-sub">{new Date(user.created_at).toLocaleDateString()}</div></td>
                  <td><div className="cell-sub">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : 'Never'}
                  </div></td>
                  <td>
                    <button
                      className="btn-ghost"
                      style={{ fontSize: 11, color: 'var(--accent)' }}
                      onClick={() => resetPassword(user.id, user.email)}
                      disabled={resetting === user.id}
                    >
                      {resetting === user.id ? '...' : 'Reset Password'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '12px 0' }}>
          <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
          <span style={{ alignSelf: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Page {page}</span>
          <button className="btn-secondary" onClick={() => setPage(p => p + 1)} disabled={users.length < 20}>Next</button>
        </div>
      </div>
    </>
  )
}
