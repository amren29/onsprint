'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleCallback() {
      try {
        // Wait for Supabase to process the OAuth callback
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()

        // Get the current user
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.replace('/login')
          return
        }

        // Check if user has a shop
        const { data: membership } = await supabase
          .from('shop_members')
          .select('shop_id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (membership?.shop_id) {
          // Has a shop → go to dashboard
          router.replace('/dashboard')
        } else {
          // No shop → create profile and go to onboarding
          // First ensure profile exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle()

          if (!profile) {
            await supabase.from('profiles').insert({
              id: user.id,
              name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
              email: user.email || '',
              role: 'shop_member',
            })
          }

          router.replace('/onboarding')
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        router.replace('/dashboard')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fira Sans', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontSize: 14, color: '#888' }}>Signing you in...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
