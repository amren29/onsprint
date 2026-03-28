'use client'

export default function SuperAdminSettings() {
  const planPricing = [
    { plan: 'Starter', price: 'RM 29/mo', features: 'Basic features, 1 user' },
    { plan: 'Pro', price: 'RM 79/mo', features: 'Advanced features, 5 users' },
    { plan: 'Business', price: 'RM 149/mo', features: 'All features, unlimited users' },
  ]

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-subtitle">Platform configuration (read-only)</div>
        </div>
      </div>

      <div className="page-scroll">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Plan Pricing</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Price</th>
                <th>Features</th>
              </tr>
            </thead>
            <tbody>
              {planPricing.map(p => (
                <tr key={p.plan}>
                  <td style={{ fontWeight: 500 }}>{p.plan}</td>
                  <td>{p.price}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.features}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Environment</h3>
          </div>
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px 16px', fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>Platform</span>
            <span>Cloudflare Workers</span>
            <span style={{ color: 'var(--text-muted)' }}>Framework</span>
            <span>Next.js (App Router)</span>
            <span style={{ color: 'var(--text-muted)' }}>Database</span>
            <span>Supabase (PostgreSQL)</span>
            <span style={{ color: 'var(--text-muted)' }}>Auth</span>
            <span>Supabase Auth</span>
            <span style={{ color: 'var(--text-muted)' }}>Currency</span>
            <span>MYR (Malaysian Ringgit)</span>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: 12, padding: '8px 0' }}>
          Settings are read-only in this version. Contact the developer to make changes.
        </p>
      </div>
    </>
  )
}
