import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = [
  '/store',
  '/s/',
  '/track',
  '/proofing',
  '/login',
  '/register',
  '/reset-password',
  '/verify-email',
  '/api/',
]

function isPublicRoute(path: string): boolean {
  if (path === '/') return true
  return PUBLIC_ROUTES.some((route) => path === route || path.startsWith(route + '/') || path.startsWith(route))
}

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Rewrite /s/[slug]/... → /store/... (pass slug via query param)
  if (path.startsWith('/s/')) {
    const segments = path.split('/') // ['', 's', 'my-shop', 'products', ...]
    const slug = segments[2]
    if (slug) {
      const rest = '/' + segments.slice(3).join('/') // '/products/...'
      const storePath = '/store' + (rest === '/' ? '' : rest)
      const url = request.nextUrl.clone()
      url.pathname = storePath
      url.searchParams.set('_slug', slug)
      return NextResponse.rewrite(url)
    }
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — IMPORTANT: do not remove
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isPublic = isPublicRoute(path)
  const isAuthPage = path === '/login' || path === '/register' || path === '/reset-password' || path === '/verify-email'

  // Protected routes: redirect to /login if no session
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from auth pages
  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Prefetch/validate shopId cookie — always verify against actual membership
  if (user && !isPublic) {
    try {
      const { data: membership } = await supabase
        .from('shop_members')
        .select('shop_id, role')
        .eq('user_id', user.id)
        .maybeSingle()

      const cookieShopId = request.cookies.get('x-shop-id')?.value
      if (membership) {
        // Set or update cookie if it doesn't match current membership
        if (cookieShopId !== membership.shop_id) {
          supabaseResponse.cookies.set('x-shop-id', membership.shop_id, {
            path: '/', maxAge: 60 * 60 * 24, httpOnly: false, sameSite: 'lax',
          })
          supabaseResponse.cookies.set('x-shop-role', membership.role, {
            path: '/', maxAge: 60 * 60 * 24, httpOnly: false, sameSite: 'lax',
          })
        }

        // Check plan expiry — block access after 7-day grace period
        // Skip for settings (so they can renew) and API routes
        if (!path.startsWith('/settings') && !path.startsWith('/api/')) {
          const { data: shop } = await supabase
            .from('shops')
            .select('plan, plan_expires_at, stripe_subscription_id')
            .eq('id', membership.shop_id)
            .maybeSingle()

          if (shop?.plan_expires_at) {
            const expiresAt = new Date(shop.plan_expires_at)
            const graceEnd = new Date(expiresAt)
            graceEnd.setDate(graceEnd.getDate() + 7)
            const now = new Date()

            if (now > graceEnd && !shop.stripe_subscription_id) {
              // Plan expired + 7-day grace period over + no active subscription
              const url = request.nextUrl.clone()
              url.pathname = '/settings'
              url.searchParams.set('section', 'billing')
              url.searchParams.set('expired', '1')
              return NextResponse.redirect(url)
            }
          }
        }
      } else if (cookieShopId) {
        // User has no shop membership — clear stale cookie
        supabaseResponse.cookies.set('x-shop-id', '', { path: '/', maxAge: 0 })
        supabaseResponse.cookies.set('x-shop-role', '', { path: '/', maxAge: 0 })
      }
    } catch {
      // Non-critical — ShopProvider will fall back to API
    }
  } else if (!user && !isPublic) {
    // Not logged in — clear any stale shop cookies
    const cookieShopId = request.cookies.get('x-shop-id')?.value
    if (cookieShopId) {
      supabaseResponse.cookies.set('x-shop-id', '', { path: '/', maxAge: 0 })
      supabaseResponse.cookies.set('x-shop-role', '', { path: '/', maxAge: 0 })
    }
  }

  return supabaseResponse
}
