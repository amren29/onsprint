'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CustomSelect from '@/components/CustomSelect'

export default function SuperAdminSupport() {
  const router = useRouter()
  const [tickets, setTickets] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    params.set('page', String(page))

    fetch(`/api/superadmin/support?${params}`)
      .then(r => r.json()).then(d => { setTickets(d.tickets || []); setTotal(d.total || 0); setLoading(false) })
      .catch(() => setLoading(false))
  }, [statusFilter, page])

  const totalPages = Math.ceil(total / 20)

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Support Tickets</div>
          <div className="page-subtitle">{total} tickets</div>
        </div>
      </div>

      <div className="page-scroll">
        <div className="filter-row">
          <div />
          <div className="filter-right">
            <CustomSelect
              value={statusFilter}
              onChange={v => { setStatusFilter(v); setPage(1) }}
              options={[
                { value: '', label: 'All Status' },
                { value: 'open', label: 'Open' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'closed', label: 'Closed' },
              ]}
              style={{ width: 140 }}
            />
          </div>
        </div>

        <div className="card">
          <table className="data-table">
            <thead><tr><th>Subject</th><th>Shop</th><th>User</th><th>Priority</th><th>Status</th><th>Updated</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Loading...</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No tickets</td></tr>
              ) : tickets.map(t => (
                <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/superadmin/support/${t.id}`)}>
                  <td><div className="cell-name">{t.subject}</div></td>
                  <td><div className="cell-sub">{(t.shops as any)?.name || '—'}</div></td>
                  <td><div className="cell-sub">{t.user_email}</div></td>
                  <td><span className={`badge badge-${t.priority === 'urgent' ? 'warning' : t.priority === 'high' ? 'info' : 'pending'}`}>{t.priority}</span></td>
                  <td><span className={`badge badge-${t.status === 'open' ? 'warning' : t.status === 'resolved' ? 'success' : 'info'}`}>{t.status}</span></td>
                  <td><div className="cell-sub">{new Date(t.updated_at).toLocaleString()}</div></td>
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
