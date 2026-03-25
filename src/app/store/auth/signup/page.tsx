'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/store/Navbar'
import Footer from '@/components/store/Footer'
import Input from '@/components/store/ui/Input'
import Button from '@/components/store/ui/Button'
// TODO [Batch G]: Replace auth-store with Supabase store-users
import { useAuthStore } from '@/lib/store/auth-store'
import { useStoreGlobal } from '@/hooks/useStoreGlobal'
import { useStore } from '@/providers/store-context'

export default function SignUpPage() {
  const router = useRouter()
  const signUp = useAuthStore((s) => s.signUp)
  const currentUser = useAuthStore((s) => s.currentUser)
  const globalSettings = useStoreGlobal()
  const { basePath, shopId } = useStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  useEffect(() => {
    if (currentUser) router.replace(`${basePath}/account`)
  }, [currentUser, router])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setGlobalError('')
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    const result = await signUp(name.trim(), email.trim(), password)
    if (result.success) {
      router.push(`${basePath}/account`)
    } else {
      setGlobalError(result.error || 'Sign up failed')
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {confirmationSent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
              <p className="text-sm text-gray-500 mb-6">
                We sent a confirmation link to <strong>{email}</strong>. Please click the link to verify your account.
              </p>
              <Link href={`${basePath}/auth/signin`} className="text-accent font-semibold hover:underline text-sm">
                Back to Sign In
              </Link>
            </div>
          ) : (
          <>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-sm text-gray-500">Join {globalSettings.shopName} to manage your orders</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            {globalError && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                {globalError}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="Ahmad Zulkifli"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              autoComplete="name"
            />

            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href={`${basePath}/auth/signin`} className="text-accent font-semibold hover:underline">
              Sign in
            </Link>
          </p>
          </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
