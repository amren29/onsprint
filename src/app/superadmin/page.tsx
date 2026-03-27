'use client'

import { useEffect, useState } from 'react'

const ShopIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const SubsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
)

const RevenueIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
)

const NewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)

interface Stats {
  totalShops: number
  activeSubs: number
  mrr: number
  newThisMonth: number
  totalOrders: number
  dailyRevenue: Record<string, number>
  recentShops: Array<{ id: string; name: string; slug: string; plan: string; created_at: string }>
}

function formatRM(n: number) {
  return `RM ${n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/superadmin/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="page-scroll">
        <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>Loading dashboard...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="page-scroll">
        <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>Failed to load stats</div>
      </div>
    )
  }

  // Build chart data from dailyRevenue
  const entries = Object.entries(stats.dailyRevenue).sort(([a], [b]) => a.localeCompare(b))
  const maxRevenue = Math.max(...entries.map(([, v]) => v), 1)

  return (
    <>
      <h1 style={{ fontSize: 18, fontWeight: 700 }}>Platform Dashboard</h1>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-label">
              <span className="stat-icon" style={{ color: 'var(--accent)' }}><ShopIcon /></span>
              Total Shops
            </div>
          </div>
          <div className="stat-value">{stats.totalShops}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-label">
              <span className="stat-icon" style={{ color: 'var(--success-text)' }}><SubsIcon /></span>
              Active Subs
            </div>
          </div>
          <div className="stat-value">{stats.activeSubs}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-label">
              <span className="stat-icon" style={{ color: 'var(--warning)' }}><RevenueIcon /></span>
              Revenue (30d)
            </div>
          </div>
          <div className="stat-value">{formatRM(stats.mrr)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-label">
              <span className="stat-icon" style={{ color: 'var(--purple-text)' }}><NewIcon /></span>
              New This Month
            </div>
          </div>
          <div className="stat-value">{stats.newThisMonth}</div>
        </div>
      </div>

      <div className="page-scroll">
        {/* Revenue Chart */}
        {entries.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Daily Revenue (Last 30 Days)</h3>
            </div>
            <div style={{ padding: '16px', overflowX: 'auto' }}>
              <svg width="100%" height="200" viewBox={`0 0 ${Math.max(entries.length * 24, 300)} 200`} style={{ minWidth: 300 }}>
                {entries.map(([date, value], i) => {
                  const barHeight = (value / maxRevenue) * 160
                  const x = i * 24 + 4
                  return (
                    <g key={date}>
                      <rect
                        x={x}
                        y={180 - barHeight}
                        width="16"
                        height={barHeight}
                        rx="3"
                        fill="var(--accent)"
                        opacity="0.8"
                      >
                        <title>{date}: {formatRM(value)}</title>
                      </rect>
                      {i % 5 === 0 && (
                        <text x={x + 8} y="196" textAnchor="middle" fontSize="9" fill="var(--text-muted)">
                          {date.slice(5)}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Shops</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Plan</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentShops.map(shop => (
                <tr key={shop.id}>
                  <td style={{ fontWeight: 500 }}>{shop.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{shop.slug}</td>
                  <td>
                    <span className={`status-badge status-${shop.plan || 'free'}`}>
                      {shop.plan || 'free'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{relativeTime(shop.created_at)}</td>
                </tr>
              ))}
              {stats.recentShops.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No shops yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
