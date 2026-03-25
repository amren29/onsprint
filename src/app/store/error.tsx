'use client'

import { useEffect } from 'react'

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log RSC errors but don't show them to users
    console.error('Store error:', error.message)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-6 text-sm">Please try refreshing the page.</p>
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
