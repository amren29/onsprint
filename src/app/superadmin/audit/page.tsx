'use client'

import { useEffect, useState } from 'react'

export default function SuperAdminAudit() {
  const [logs, setLogs] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [actionFilter, setActionFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (actionFilter) params.set('action', actionFilter)
    params.set('page', String(page))

    fetch(`/api/superadmin/audit?${params}`)
      .then(r => r.json())
      .then(d => { setLogs(d.logs || []); setTotal(d.total || 0); setLoading(false) })
      .catch(() => setLoading(false))
  }, [actionFilter, page])

  const totalPages = Math.ceil(total / 30)

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Audit Log</div>
          <div className="page-subtitle">{total} recorded actions</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1) }} className="form-input" style={{ width: 200 }}>
          <option value="">All Actions</option>
          <option value="shop_created">Shop Created</option>
          <option value="shop_deleted">Shop Deleted</option>
          <option value="shop_ownership_transferred">Ownership Transfer</option>
          <option value="coupon_created">Coupon Created</option>
          <option value="coupon_deactivated">Coupon Deactivated</option>
          <option value="announcement_sent">Announcement Sent</option>
        </select>
      </div>

      <div className="page-scroll">
        <div className="card">
          <table className="data-table">
            <thead><tr><th>Time</th><th>Admin</th><th>Action</th><th>Entity</th><th>Details</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No audit logs</td></tr>
              ) : logs.map(log => (
                <tr key={log.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: 11, whiteSpace: 'nowrap' }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td>{log.admin_email}</td>
                  <td><span className="badge badge-info">{log.action}</span></td>
                  <td style={{ fontSize: 11 }}>
                    {log.entity_type && <span>{log.entity_type}</span>}
                    {log.entity_id && <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>{log.entity_id.slice(0, 8)}</span>}
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '12px 0' }}>
            <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span style={{ alignSelf: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Page {page} of {totalPages}</span>
            <button className="btn-secondary" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>
    </>
  )
}
