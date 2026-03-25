'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/providers/store-context'

/**
 * Store homepage — redirects to products page.
 * Tier 1 & 2 shops get a simple product-first store.
 * Tier 3 (Pro) shops can customize this via website builder later.
 */
export default function HomePage() {
  const router = useRouter()
  const { basePath } = useStore()

  useEffect(() => {
    router.replace(`${basePath}/products`)
  }, [router, basePath])

  return null
}
