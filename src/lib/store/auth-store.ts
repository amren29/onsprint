import { create } from 'zustand'
import { User, UserRole, Address, SavedArtwork, Order, CanvaTokens, UserMembership, MembershipPurchase, AgentWalletEntry } from '@/types/store'

// ── Map DbStoreUser → User (compatibility with 36+ consumer files) ──────────

function mapDbToUser(db: any, walletEntries?: any[], orders?: any[]): User {
  return {
    id: db.id,
    name: db.name || '',
    email: db.email || '',
    password: '', // never stored client-side
    role: (db.role || 'customer') as UserRole,
    phone: db.phone || '',
    company: db.company || '',
    addresses: (db.addresses || []) as Address[],
    savedArtwork: (db.saved_artwork || []) as SavedArtwork[],
    orders: (orders || []).map((o: any) => ({
      id: o.id,
      customer: o.customer_name || '',
      customerRef: o.customer_id || '',
      agent: o.agent_name || '',
      status: o.status || 'Pending',
      production: o.production || '—',
      created: o.created_at,
      dueDate: o.due_date || '',
      deliveryMethod: o.delivery_method || '',
      deliveryAddress: o.delivery_address || '',
      notes: o.notes || '',
      source: o.source || 'online-store',
      items: o.items || [],
      payments: o.payments || [],
      timeline: o.timeline || [],
      sstEnabled: o.sst_enabled,
      sstRate: o.sst_rate,
      sstAmount: o.sst_amount,
      shippingCost: o.shipping_cost,
      subtotal: o.subtotal,
      grandTotal: o.grand_total,
      currency: o.currency || 'MYR',
    })) as Order[],
    canvaTokens: db.canva_tokens && Object.keys(db.canva_tokens).length > 0
      ? db.canva_tokens as CanvaTokens : undefined,
    createdAt: db.created_at || new Date().toISOString(),
    discountRate: db.discount_rate || undefined,
    affiliateCode: db.affiliate_code || undefined,
    membership: db.membership as UserMembership | undefined,
    membershipPurchases: (db.membership_purchases || []) as MembershipPurchase[],
    walletBalance: db.wallet_balance ?? 0,
    walletEntries: (walletEntries || []).map((e: any) => ({
      id: e.id,
      date: e.date,
      type: e.type,
      category: e.category,
      description: e.description,
      amount: e.amount,
      balance: e.balance,
      reference: e.reference,
      receiptData: e.receipt_file,
      status: e.status,
    })) as AgentWalletEntry[],
  }
}

// ── Helper: get shopId ──────────────────────────────────────────────────────

function getShopId(): string {
  if (typeof document === 'undefined') return ''
  // From store context cookie or env
  const match = document.cookie.match(/(?:^|; )x-shop-id=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : (process.env.NEXT_PUBLIC_SHOP_ID || '')
}

// ── Helper: update store_user via API ───────────────────────────────────────

async function patchUser(userId: string, updates: Record<string, unknown>) {
  const shopId = getShopId()
  if (!shopId) return
  await fetch('/api/store/auth/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shopId, userId, updates }),
  })
}

// ── Admin utility helpers ────────────────────────────────────────────────────

/** Look up a store_user row by email via the /api/db proxy. Returns the raw DB row. */
async function fetchStoreUserByEmail(email: string): Promise<any | null> {
  const shopId = getShopId()
  if (!shopId || !email) return null
  const res = await fetch('/api/db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'select_single', table: 'store_users', shopId, filters: { email: email.trim().toLowerCase() } }),
  })
  if (!res.ok) return null
  const { data } = await res.json()
  return data ?? null
}

/** Look up a store_user row by affiliate_code via the /api/db proxy. */
async function fetchStoreUserByAffiliateCode(code: string): Promise<any | null> {
  const shopId = getShopId()
  if (!shopId || !code) return null
  const res = await fetch('/api/db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'select_single', table: 'store_users', shopId, filters: { affiliate_code: code } }),
  })
  if (!res.ok) return null
  const { data } = await res.json()
  return data ?? null
}

/** Patch a store_user by their DB id */
async function patchUserById(userId: string, updates: Record<string, unknown>) {
  const shopId = getShopId()
  if (!shopId) return
  await fetch('/api/store/auth/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shopId, userId, updates }),
  })
}

/** Post a wallet entry for a store_user */
async function postWalletEntry(userId: string, entry: { type: string; amount: number; category?: string; description?: string; reference?: string; status?: string }) {
  const shopId = getShopId()
  if (!shopId) return
  await fetch('/api/store/auth/wallet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shopId, userId, ...entry }),
  })
}

// ── In-memory cache for store users looked up by email ──────────────────────
// getStoreUserByEmail is called synchronously by admin pages. We populate this
// cache asynchronously; the first call returns null, but subsequent calls
// (after the fetch resolves) return the cached User.
const _userCacheByEmail = new Map<string, User | null>()
const _userCacheByCode = new Map<string, User | null>()

function dbRowToUser(db: any): User {
  return mapDbToUser(db, [], [])
}

// ── Admin utility functions (call Supabase via API, fire-and-forget) ────────

/**
 * Synchronous lookup — returns cached User or null.
 * Triggers an async fetch so that subsequent calls will have the data.
 */
export function getStoreUserByEmail(email: string): User | null {
  if (!email) return null
  const key = email.trim().toLowerCase()
  if (_userCacheByEmail.has(key)) return _userCacheByEmail.get(key) ?? null
  // Kick off async fetch to populate cache
  fetchStoreUserByEmail(key).then(db => {
    _userCacheByEmail.set(key, db ? dbRowToUser(db) : null)
  }).catch(() => {})
  return null
}

export function getStoreUserByAffiliateCode(code: string): User | null {
  if (!code) return null
  if (_userCacheByCode.has(code)) return _userCacheByCode.get(code) ?? null
  fetchStoreUserByAffiliateCode(code).then(db => {
    _userCacheByCode.set(code, db ? dbRowToUser(db) : null)
  }).catch(() => {})
  return null
}

export function promoteStoreUserToAgent(email: string, discountRate: number) {
  fetchStoreUserByEmail(email).then(db => {
    if (!db) return
    patchUserById(db.id, { role: 'agent', discount_rate: discountRate })
    _userCacheByEmail.delete(email.trim().toLowerCase())
  }).catch(() => {})
}

export function demoteStoreUserFromAgent(email: string) {
  fetchStoreUserByEmail(email).then(db => {
    if (!db) return
    patchUserById(db.id, { role: 'customer', discount_rate: 0 })
    _userCacheByEmail.delete(email.trim().toLowerCase())
  }).catch(() => {})
}

export function approveStoreTopup(email: string, entryId: string) {
  const shopId = getShopId()
  fetchStoreUserByEmail(email).then(async (db) => {
    if (!db || !shopId) return
    // Update the wallet entry status to approved
    await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', table: 'store_user_wallet_entries', shopId, id: entryId, data: { status: 'approved' } }),
    })
    // Fetch the entry amount and credit it to the user balance
    const entryRes = await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'select_single', table: 'store_user_wallet_entries', shopId, filters: { id: entryId } }),
    })
    const entryData = await entryRes.json()
    if (entryData.data) {
      const amount = entryData.data.amount ?? 0
      const currentBalance = db.wallet_balance ?? 0
      const newBalance = currentBalance + amount
      await patchUserById(db.id, { wallet_balance: newBalance })
    }
    _userCacheByEmail.delete(email.trim().toLowerCase())
  }).catch(() => {})
}

export function rejectStoreTopup(email: string, entryId: string) {
  const shopId = getShopId()
  if (!shopId) return
  // Just update the wallet entry status to rejected — no balance change
  fetch('/api/db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'update', table: 'store_user_wallet_entries', shopId, id: entryId, data: { status: 'rejected' } }),
  }).catch(() => {})
  _userCacheByEmail.delete(email.trim().toLowerCase())
}

export function creditStoreUserWallet(email: string, entry: Omit<AgentWalletEntry, 'balance'>) {
  fetchStoreUserByEmail(email).then(db => {
    if (!db) return
    postWalletEntry(db.id, {
      type: 'credit',
      amount: entry.amount,
      category: entry.category || '',
      description: entry.description || '',
      reference: entry.reference || '',
      status: entry.status || 'completed',
    })
    _userCacheByEmail.delete(email.trim().toLowerCase())
  }).catch(() => {})
}

export function debitStoreUserWallet(email: string, entry: Omit<AgentWalletEntry, 'balance'>) {
  fetchStoreUserByEmail(email).then(db => {
    if (!db) return
    postWalletEntry(db.id, {
      type: 'debit',
      amount: entry.amount,
      category: entry.category || '',
      description: entry.description || '',
      reference: entry.reference || '',
      status: entry.status || 'completed',
    })
    _userCacheByEmail.delete(email.trim().toLowerCase())
  }).catch(() => {})
}

export function setStoreUserAffiliateCode(email: string, code: string | undefined) {
  fetchStoreUserByEmail(email).then(db => {
    if (!db) return
    patchUserById(db.id, { affiliate_code: code || null })
    _userCacheByEmail.delete(email.trim().toLowerCase())
    _userCacheByCode.clear()
  }).catch(() => {})
}

export function activateStoreMembership(email: string, tierId: string, tierName: string, discountRate: number, durationMonths: number) {
  fetchStoreUserByEmail(email).then(db => {
    if (!db) return
    const now = new Date()
    const expiry = new Date(now)
    expiry.setMonth(expiry.getMonth() + durationMonths)
    const membership: UserMembership = {
      tierId,
      tierName,
      discountRate,
      startDate: now.toISOString(),
      expiryDate: expiry.toISOString(),
      status: 'active',
    }
    patchUserById(db.id, { membership })
    _userCacheByEmail.delete(email.trim().toLowerCase())
  }).catch(() => {})
}

export function suspendStoreMembership(email: string) {
  fetchStoreUserByEmail(email).then(db => {
    if (!db || !db.membership) return
    const membership = { ...db.membership, status: 'suspended' }
    patchUserById(db.id, { membership })
    _userCacheByEmail.delete(email.trim().toLowerCase())
  }).catch(() => {})
}

export function deactivateStoreMembership(email: string) {
  fetchStoreUserByEmail(email).then(db => {
    if (!db || !db.membership) return
    const membership = { ...db.membership, status: 'inactive' }
    patchUserById(db.id, { membership })
    _userCacheByEmail.delete(email.trim().toLowerCase())
  }).catch(() => {})
}

export function deleteStoreMembership(email: string) {
  fetchStoreUserByEmail(email).then(db => {
    if (!db) return
    patchUserById(db.id, { membership: null, membership_purchases: [] })
    _userCacheByEmail.delete(email.trim().toLowerCase())
  }).catch(() => {})
}

export function completeStoreMembershipPurchases(email: string, tierId: string) {
  fetchStoreUserByEmail(email).then(db => {
    if (!db) return
    const purchases = (db.membership_purchases || []).map((p: any) =>
      p.tierId === tierId || p.tier_id === tierId ? { ...p, status: 'completed' } : p
    )
    patchUserById(db.id, { membership_purchases: purchases })
    _userCacheByEmail.delete(email.trim().toLowerCase())
  }).catch(() => {})
}

// ── Store type ──────────────────────────────────────────────────────────────

type AuthStore = {
  currentUser: User | null
  isHydrated: boolean

  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (name: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>

  // Rehydrate from Supabase session
  fetchUser: () => Promise<void>

  updateProfile: (updates: Partial<Pick<User, 'name' | 'phone' | 'company'>>) => void
  addAddress: (address: Address) => void
  updateAddress: (id: string, updates: Partial<Address>) => void
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  addSavedArtwork: (artwork: SavedArtwork) => void
  removeSavedArtwork: (id: string) => void
  addOrder: (order: Order) => void
  removeOrder: (orderId: string) => void
  updateOrderStatus: (orderId: string, updates: Partial<Order>) => void
  setCanvaTokens: (tokens: CanvaTokens) => void
  clearCanvaTokens: () => void

  setMembership: (membership: UserMembership) => void
  clearMembership: () => void
  addMembershipPurchase: (purchase: MembershipPurchase) => void

  creditWallet: (entry: AgentWalletEntry) => void
  debitWallet: (entry: AgentWalletEntry) => void
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>()((set, get) => ({
  currentUser: null,
  isHydrated: false,

  fetchUser: async () => {
    try {
      const shopId = getShopId()
      if (!shopId) { set({ isHydrated: true }); return }
      const res = await fetch(`/api/store/auth/me?shopId=${shopId}`)
      if (!res.ok) { set({ isHydrated: true }); return }
      const { user: db } = await res.json()
      if (!db) { set({ currentUser: null, isHydrated: true }); return }
      const user = mapDbToUser(db, db.walletEntries, db.orders)
      set({ currentUser: user, isHydrated: true })
    } catch {
      set({ isHydrated: true })
    }
  },

  signIn: async (email, password) => {
    try {
      const shopId = getShopId()
      const res = await fetch('/api/store/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, shopId }),
      })
      const data = await res.json()
      if (!res.ok) return { success: false, error: data.error || 'Login failed' }

      // Set session tokens in Supabase client
      if (data.session) {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
      }

      if (data.user) {
        const user = mapDbToUser(data.user, [], [])
        set({ currentUser: user })
        // Fetch full profile in background (with orders, wallet entries)
        get().fetchUser()
      }
      return { success: true }
    } catch {
      return { success: false, error: 'Login failed' }
    }
  },

  signUp: async (name, email, password, role = 'customer') => {
    try {
      const shopId = getShopId()
      const res = await fetch('/api/store/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, shopId }),
      })
      const data = await res.json()
      if (!res.ok) return { success: false, error: data.error || 'Signup failed' }

      // Set session tokens
      if (data.session) {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
      }

      if (data.user && !data.needsConfirmation) {
        const user = mapDbToUser(data.user, [], [])
        set({ currentUser: user })
      }
      return { success: true, needsConfirmation: data.needsConfirmation || false }
    } catch {
      return { success: false, error: 'Signup failed' }
    }
  },

  signOut: async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch { /* ignore */ }
    set({ currentUser: null })
  },

  // ── Profile mutations (optimistic update + async persist) ─────────────

  updateProfile: (updates) => {
    const u = get().currentUser
    if (!u) return
    const updated = { ...u, ...updates }
    set({ currentUser: updated })
    patchUser(u.id, { name: updates.name, phone: updates.phone, company: updates.company })
  },

  addAddress: (address) => {
    const u = get().currentUser
    if (!u) return
    const addresses = [...u.addresses, address]
    set({ currentUser: { ...u, addresses } })
    patchUser(u.id, { addresses })
  },

  updateAddress: (id, updates) => {
    const u = get().currentUser
    if (!u) return
    const addresses = u.addresses.map(a => a.id === id ? { ...a, ...updates } : a)
    set({ currentUser: { ...u, addresses } })
    patchUser(u.id, { addresses })
  },

  removeAddress: (id) => {
    const u = get().currentUser
    if (!u) return
    const addresses = u.addresses.filter(a => a.id !== id)
    set({ currentUser: { ...u, addresses } })
    patchUser(u.id, { addresses })
  },

  setDefaultAddress: (id) => {
    const u = get().currentUser
    if (!u) return
    const addresses = u.addresses.map(a => ({ ...a, isDefault: a.id === id }))
    set({ currentUser: { ...u, addresses } })
    patchUser(u.id, { addresses })
  },

  addSavedArtwork: (artwork) => {
    const u = get().currentUser
    if (!u) return
    const saved_artwork = [...u.savedArtwork, artwork]
    set({ currentUser: { ...u, savedArtwork: saved_artwork } })
    patchUser(u.id, { saved_artwork })
  },

  removeSavedArtwork: (id) => {
    const u = get().currentUser
    if (!u) return
    const saved_artwork = u.savedArtwork.filter(a => a.id !== id)
    set({ currentUser: { ...u, savedArtwork: saved_artwork } })
    patchUser(u.id, { saved_artwork })
  },

  // Orders live in Supabase orders table — these are no-ops for backward compat
  addOrder: (_order) => {},
  removeOrder: (_orderId) => {},
  updateOrderStatus: (_orderId, _updates) => {},

  setCanvaTokens: (tokens) => {
    const u = get().currentUser
    if (!u) return
    set({ currentUser: { ...u, canvaTokens: tokens } })
    patchUser(u.id, { canva_tokens: tokens })
  },

  clearCanvaTokens: () => {
    const u = get().currentUser
    if (!u) return
    set({ currentUser: { ...u, canvaTokens: undefined } })
    patchUser(u.id, { canva_tokens: {} })
  },

  // ── Membership ───────────────────────────────────────────────────────

  setMembership: (membership) => {
    const u = get().currentUser
    if (!u || u.role === 'agent') return
    set({ currentUser: { ...u, membership } })
    patchUser(u.id, { membership })
  },

  clearMembership: () => {
    const u = get().currentUser
    if (!u) return
    set({ currentUser: { ...u, membership: undefined } })
    patchUser(u.id, { membership: null })
  },

  addMembershipPurchase: (purchase) => {
    const u = get().currentUser
    if (!u) return
    const purchases = [...(u.membershipPurchases ?? []), purchase]
    set({ currentUser: { ...u, membershipPurchases: purchases } })
    patchUser(u.id, { membership_purchases: purchases })
  },

  // ── Wallet ───────────────────────────────────────────────────────────

  creditWallet: (entry) => {
    const u = get().currentUser
    if (!u) return
    const newBalance = (u.walletBalance ?? 0) + entry.amount
    const entryWithBalance = { ...entry, balance: newBalance }
    set({
      currentUser: {
        ...u,
        walletBalance: newBalance,
        walletEntries: [...(u.walletEntries ?? []), entryWithBalance],
      },
    })
    // Persist via wallet entry API
    fetch('/api/store/auth/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId: getShopId(), userId: u.id, type: 'credit', amount: entry.amount, category: entry.category, description: entry.description, reference: entry.reference, status: entry.status }),
    }).catch(() => {})
  },

  debitWallet: (entry) => {
    const u = get().currentUser
    if (!u) return
    const newBalance = (u.walletBalance ?? 0) - entry.amount
    const entryWithBalance = { ...entry, balance: newBalance }
    set({
      currentUser: {
        ...u,
        walletBalance: newBalance,
        walletEntries: [...(u.walletEntries ?? []), entryWithBalance],
      },
    })
    fetch('/api/store/auth/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId: getShopId(), userId: u.id, type: 'debit', amount: entry.amount, category: entry.category, description: entry.description, reference: entry.reference, status: entry.status }),
    }).catch(() => {})
  },
}))
