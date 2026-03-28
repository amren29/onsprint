'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface OrderRow {
  id: string
  seq_id: string
  shop_id: string
  status: string
  grand_total: number
  customer_name: string
  created_at: string
  shops: { name: string } | null
}

const fmtRM = (n: number) => `RM ${(n || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`

const STATUS_BADGE: Record<string, string> = {
  Pending: 'badge badge-warning',
  Confirmed: 'badge badge-info',
  Completed: 'badge badge-success',
  Cancelled: 'badge badge-pending',
}

export default function SuperAdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    params.set('page', String(page))

    fetch(`/api/superadmin/orders?${params}`)
      .then(r => r.json())
      .then(data => {
        setOrders(data.orders || [])
        setTotal(data.total || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [search, statusFilter, page])

  const totalPages = Math.ceil(total / 20)

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Orders</div>
          <div className="page-subtitle">{total} orders across all shops</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search order # or customer..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="form-input"
          style={{ width: 260 }}
        />
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="form-input"
          style={{ width: 140 }}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="page-scroll">
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Shop</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No orders found</td></tr>
              ) : orders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 500 }}>{order.seq_id || order.id.slice(0, 8)}</td>
                  <td>
                    <Link href={`/superadmin/shops/${order.shop_id}`} style={{ color: 'var(--accent)' }}>
                      {(order.shops as any)?.name || order.shop_id.slice(0, 8)}
                    </Link>
                  </td>
                  <td>{order.customer_name || '—'}</td>
                  <td>
                    <span className={STATUS_BADGE[order.status] || 'badge badge-pending'}>
                      {order.status}
                    </span>
                  </td>
                  <td>{fmtRM(order.grand_total)}</td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(order.created_at).toLocaleDateString()}
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
