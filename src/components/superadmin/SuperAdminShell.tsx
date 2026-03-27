'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SuperAdminSidebar from './SuperAdminSidebar'
import SuperAdminTopbar from './SuperAdminTopbar'

export default function SuperAdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'authorized' | 'denied'>('loading')
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen(v => !v), [])

  useEffect(() => {
    fetch('/api/superadmin/me')
      .then(r => {
        if (r.ok) {
          setStatus('authorized')
        } else {
          setStatus('denied')
          router.push('/dashboard')
        }
      })
      .catch(() => {
        setStatus('denied')
        router.push('/dashboard')
      })
  }, [router])

  if (status === 'loading') {
    return (
      <div className="app-shell">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>
          Loading...
        </div>
      </div>
    )
  }

  if (status === 'denied') return null

  return (
    <div className="app-shell">
      <div
        className={`sidebar-overlay${mobileOpen ? ' open' : ''}`}
        onClick={closeMobile}
      />
      <SuperAdminSidebar mobileOpen={mobileOpen} onNavigate={closeMobile} />
      <div className="main-area">
        <SuperAdminTopbar onHamburgerClick={toggleMobile} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}
