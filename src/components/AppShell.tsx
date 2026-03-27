'use client'

import { Suspense, useState, useCallback } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import NotifPopup from './NotifPopup'
import RealtimeListener from './RealtimeListener'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen(v => !v), [])

  return (
    <div className="app-shell">
      {/* Mobile sidebar overlay */}
      <div
        className={`sidebar-overlay${mobileOpen ? ' open' : ''}`}
        onClick={closeMobile}
      />
      <Suspense>
        <Sidebar mobileOpen={mobileOpen} onNavigate={closeMobile} />
      </Suspense>
      <div className="main-area">
        <Topbar onHamburgerClick={toggleMobile} />
        <main className="page-content">{children}</main>
      </div>
      <NotifPopup />
      <RealtimeListener />
    </div>
  )
}
