'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/auth-store'

/** Rehydrates store auth from Supabase session on mount */
export default function StoreAuthHydrator() {
  const fetchUser = useAuthStore(s => s.fetchUser)
  const isHydrated = useAuthStore(s => s.isHydrated)

  useEffect(() => {
    if (!isHydrated) {
      fetchUser()
    }
  }, [fetchUser, isHydrated])

  return null
}
