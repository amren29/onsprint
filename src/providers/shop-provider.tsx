'use client'

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

interface ShopContext {
  shopId: string
  role: string
  shop: any
  isLoading: boolean
  error: string
}

const ShopCtx = createContext<ShopContext>({
  shopId: '',
  role: '',
  shop: null,
  isLoading: true,
  error: '',
})

function getCookie(name: string): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ShopContext>({
    shopId: '',
    role: '',
    shop: null,
    isLoading: true,
    error: '',
  })

  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    // Skip on store pages and super admin pages
    if (typeof window !== 'undefined' && (window.location.pathname.startsWith('/store') || window.location.pathname.startsWith('/superadmin'))) {
      setState(s => ({ ...s, isLoading: false }))
      return
    }

    // Step 1: Try cookie first (instant)
    const cachedShopId = getCookie('x-shop-id')
    const cachedRole = getCookie('x-shop-role')
    if (cachedShopId) {
      setState({
        shopId: cachedShopId,
        role: cachedRole,
        shop: null,
        isLoading: false,
        error: '',
      })
    }

    // Step 2: Fetch full shop data from API (updates shop name etc.)
    async function init(retries = 3) {
      try {
        const res = await fetch('/api/user/shop-init')
        if (res.ok) {
          const result = await res.json()
          if (result.shopId) {
            // Set cookie for future loads
            document.cookie = `x-shop-id=${result.shopId}; path=/; max-age=86400; samesite=lax`
            document.cookie = `x-shop-role=${result.role || 'owner'}; path=/; max-age=86400; samesite=lax`
            setState({
              shopId: result.shopId,
              role: result.role,
              shop: result.shop,
              isLoading: false,
              error: '',
            })
            return
          }
        }

        // If we already have shopId from cookie, don't try to create a new shop
        if (cachedShopId) return

        // No shop found — try to auto-create
        const createRes = await fetch('/api/user/shop-init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'My Print Shop' }),
        })
        const created = await createRes.json()
        if (!createRes.ok || created.error) {
          const errorMsg = created.error || 'Unknown error'
          if (errorMsg === 'Not authenticated' && retries > 0) {
            await new Promise(r => setTimeout(r, 1000))
            return init(retries - 1)
          }
          setState(s => ({ ...s, isLoading: false, error: `Shop creation failed: ${errorMsg}` }))
          return
        }
        if (created.shop) {
          document.cookie = `x-shop-id=${created.shop.id}; path=/; max-age=86400; samesite=lax`
          document.cookie = `x-shop-role=owner; path=/; max-age=86400; samesite=lax`
          setState({
            shopId: created.shop.id,
            role: 'owner',
            shop: created.shop,
            isLoading: false,
            error: '',
          })
        }
      } catch (err) {
        console.error('[ShopProvider] Error:', err)
        // If cookie had shopId, keep using it
        if (!cachedShopId) {
          setState(s => ({ ...s, isLoading: false, error: `Shop init failed` }))
        }
      }
    }
    init()
  }, [])

  return <ShopCtx.Provider value={state}>{children}</ShopCtx.Provider>
}

export function useShop() {
  return useContext(ShopCtx)
}
