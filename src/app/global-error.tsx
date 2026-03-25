'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error.message, error.digest)
  }, [error])

  return (
    <html>
      <body style={{ background: '#111', color: '#fff', padding: 40, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 24 }}>Please try refreshing the page.</p>
          <button
            onClick={reset}
            style={{
              padding: '10px 24px',
              background: '#fff',
              color: '#111',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
