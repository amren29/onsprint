'use client'

import { Suspense } from 'react'
import { StoreProvider } from '@/providers/store-context'
import AffiliateCapture from '@/components/store/AffiliateCapture'
import CartTracker from '@/components/store/CartTracker'
import StoreAuthHydrator from '@/components/store/StoreAuthHydrator'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense>
      <StoreProvider>
        <div
          id="store-scroll-root"
          className="store-root antialiased"
          style={{
            position: 'fixed',
            inset: 0,
            overflow: 'auto',
            background: '#ffffff',
            color: '#111827',
            zIndex: 0,
          }}
        >
          <Suspense>
            <AffiliateCapture />
            <CartTracker />
            <StoreAuthHydrator />
          </Suspense>
          {children}
        </div>
      </StoreProvider>
    </Suspense>
  )
}
