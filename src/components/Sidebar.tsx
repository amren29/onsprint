// @ts-nocheck
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useShop } from '@/providers/shop-provider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type DbBoard,
} from '@/lib/db/production'
import { getBoards as dbGetBoards, getStockItems, getUnreadCount } from '@/lib/db/client'

// Production board CRUD via API proxy
async function dbCreateBoard(shopId: string, data: Record<string, unknown>) {
  const res = await fetch('/api/db', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'insert', table: 'boards', shopId, data }) })
  return (await res.json()).data
}
async function dbDeleteBoard(shopId: string, id: string) {
  await fetch('/api/db', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', table: 'boards', shopId, id }) })
}
async function dbRenameBoard(shopId: string, id: string, name: string) {
  const res = await fetch('/api/db', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', table: 'boards', shopId, id, data: { name } }) })
  return (await res.json()).data
}
async function seedPrintingProductionBoard(shopId: string) {
  // Create the board
  const res = await fetch('/api/db', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'insert', table: 'boards', shopId, data: { name: 'Printing Production', team_space_id: 'ts-default', type: 'production', is_renameable: false, is_system: true } }),
  })
  const board = (await res.json()).data
  if (!board?.id) return null

  // Seed the 12 locked columns
  const columns = [
    { name: 'New Order', system_key: 'new_order', tone: 'neutral', position: 0 },
    { name: 'Artwork Checking', system_key: 'artwork_checking', tone: 'info', position: 1 },
    { name: 'Designing', system_key: 'designing', tone: 'info', position: 2 },
    { name: 'Refine', system_key: 'refine', tone: 'info', position: 3 },
    { name: 'Waiting Customer Feedback', system_key: 'waiting_feedback', tone: 'warning', position: 4 },
    { name: 'Ready to Print', system_key: 'ready_to_print', tone: 'info', position: 5 },
    { name: 'Printing', system_key: 'printing', tone: 'warning', position: 6 },
    { name: 'Finishing', system_key: 'finishing', tone: 'warning', position: 7 },
    { name: 'QC', system_key: 'qc', tone: 'warning', position: 8 },
    { name: 'Ready to Pickup', system_key: 'ready_to_pickup', tone: 'success', position: 9 },
    { name: 'Collected', system_key: 'collected', tone: 'success', position: 10 },
    { name: 'Done', system_key: 'done', tone: 'success', position: 11 },
  ]
  for (const col of columns) {
    await fetch('/api/db', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'insert', table: 'board_columns', shopId, data: { board_id: board.id, name: col.name, position: col.position, is_locked: true, system_key: col.system_key, tone: col.tone, visible_to_roles: [] } }),
    })
  }
  return board
}
import { createClient } from '@/lib/supabase/client'

/* ── ICONS ─────────────────────────────────────────── */
const Icon = {
  Dashboard: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Orders: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>
    </svg>
  ),
  Reports: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10M12 20V4M6 20v-6"/>
    </svg>
  ),
  Bell: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  Payments: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"/>
    </svg>
  ),
  Wallet: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4h-4z"/>
    </svg>
  ),
  Customers: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Agents: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  Stock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  Suppliers: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  Deliveries: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12H3l4-8h10l4 8h-2"/><path d="M3 12v6a1 1 0 001 1h1m14-7v6a1 1 0 01-1 1h-1M9 19a2 2 0 104 0 2 2 0 00-4 0z"/>
    </svg>
  ),
  Catalog: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  ),
  Production: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="5" height="19" rx="1"/><rect x="10" y="3" width="5" height="11" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/>
    </svg>
  ),
  Activity: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Settings: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Moon: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  ),
  Collapse: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  Expand: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Chevrons: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="7 15 12 20 17 15"/><polyline points="7 9 12 4 17 9"/>
    </svg>
  ),
  Storefront: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Membership: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  TopUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  Affiliate: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
    </svg>
  ),
}

/* ── Small icons for board items ── */
const ChevRight = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)
const PlusSm = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const PencilSm = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const TrashSm = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
)
const DotsSm = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
  </svg>
)

/* ── NAV DATA ─────────────────────────────────────── */
const NAV = [
  { label: 'Dashboard',     href: '/dashboard',           icon: Icon.Dashboard,   key: 'dashboard' },
  { label: 'Orders',        href: '/orders',              icon: Icon.Orders,      key: 'orders' },
  { label: 'Customers',     href: '/customers',           icon: Icon.Customers,   key: 'customers' },
  { label: 'Payments',      href: '/payments',            icon: Icon.Payments,    key: 'payments' },
  { label: 'Stock',         href: '/stock',               icon: Icon.Stock,       key: 'stock' },
  { label: 'Suppliers',     href: '/suppliers',            icon: Icon.Suppliers,  key: 'suppliers' },
  { label: 'Agents',        href: '/agents',              icon: Icon.Agents,      key: 'agents' },
  { label: 'Membership',    href: '/membership-approvals', icon: Icon.Membership, key: 'membership' },
  { label: 'Products',      href: '/catalog',             icon: Icon.Catalog,     key: 'products' },
  { label: 'Reports',       href: '/reports',             icon: Icon.Reports,     key: 'reports' },
]

// All permission keys
export const ALL_PERMISSIONS = ['dashboard', 'orders', 'customers', 'payments', 'stock', 'suppliers', 'agents', 'membership', 'products', 'reports', 'production', 'store', 'settings'] as const
export type PermissionKey = typeof ALL_PERMISSIONS[number]

/* ── Component ─────────────────────────────────────── */
export default function Sidebar() {
  const pathname    = usePathname()
  const router      = useRouter()
  const searchParams = useSearchParams()
  const urlBoardId  = searchParams.get('board') ?? ''
  const { shopId, shop } = useShop()
  const qc = useQueryClient()

  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState('owner')
  const [userPermissions, setUserPermissions] = useState<string[]>([])
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          setUserName(data.user.user_metadata?.name || '')
          setUserEmail(data.user.email || '')
          // Fetch permissions from shop_members
          if (shopId) {
            fetch('/api/db', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'select_single', table: 'shop_members', shopId, filters: { user_id: data.user.id } }),
            }).then(r => r.json()).then(res => {
              if (res.data) {
                setUserRole(res.data.role || 'owner')
                setUserPermissions(res.data.permissions || [])
              }
            }).catch(() => {})
          }
        }
      }).catch(() => {})
    } catch { /* env vars not ready */ }
  }, [shopId])

  // Owner has all permissions. Others only see what's assigned.
  const isOwner = userRole === 'owner'
  const hasPermission = (key: string) => isOwner || userPermissions.includes(key)
  const filteredNav = NAV.filter(item => hasPermission(item.key))

  // Close user menu on outside click
  useEffect(() => {
    if (!showUserMenu) return
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showUserMenu])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
    } catch {
      router.push('/login')
    }
  }

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem('sidebar-collapsed') === '1'
  })
  useEffect(() => {
    sessionStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  // Low stock badge from DB
  const { data: stockItems = [] } = useQuery({
    queryKey: ['stock', shopId],
    queryFn: () => getStockItems(shopId),
    enabled: !!shopId,
    staleTime: 60_000,
  })
  const lowStockCount = stockItems.filter(s => s.status === 'Low' || s.status === 'Critical').length

  // Unread notification count from DB
  const { data: unreadNotifCount = 0 } = useQuery({
    queryKey: ['unread-notif-count', shopId],
    queryFn: () => getUnreadCount(shopId),
    enabled: !!shopId,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  /* ── Production accordion ── */
  const { data: boards = [], isFetched: boardsFetched } = useQuery({
    queryKey: ['boards', shopId],
    queryFn: () => dbGetBoards(shopId),
    enabled: !!shopId,
    staleTime: 30_000,
  })
  const [seedingBoard, setSeedingBoard] = useState(false)
  useEffect(() => {
    if (!boardsFetched || !shopId || seedingBoard) return
    if (boards.some(b => b.type === 'production')) return
    setSeedingBoard(true)
    seedPrintingProductionBoard(shopId)
      .then(() => qc.invalidateQueries({ queryKey: ['boards', shopId] }))
      .catch(() => {})
      .finally(() => setSeedingBoard(false))
  }, [boardsFetched, shopId, boards, seedingBoard, qc])
  const [productionOpen, setProductionOpen]       = useState(false)
  const [showAddBoard, setShowAddBoard]           = useState(false)
  const [newBoardName, setNewBoardName]           = useState('')
  const [renamingBoardId, setRenamingBoardId]     = useState<string | null>(null)
  const [renamingBoardName, setRenamingBoardName] = useState('')
  const [hoveredBoardId, setHoveredBoardId]       = useState<string | null>(null)
  const [openMenuBoardId, setOpenMenuBoardId]     = useState<string | null>(null)

  const newBoardInputRef    = useRef<HTMLInputElement>(null)
  const renameBoardInputRef = useRef<HTMLInputElement>(null)
  const boardMenuRef        = useRef<HTMLDivElement>(null)

  const isProductionActive = pathname.startsWith('/production')

  useEffect(() => {
    if (isProductionActive) setProductionOpen(true)
  }, [isProductionActive])

  useEffect(() => {
    if (showAddBoard) setTimeout(() => newBoardInputRef.current?.focus(), 10)
  }, [showAddBoard])

  useEffect(() => {
    if (renamingBoardId) setTimeout(() => renameBoardInputRef.current?.focus(), 10)
  }, [renamingBoardId])

  useEffect(() => {
    if (!openMenuBoardId) return
    const handler = (e: MouseEvent) => {
      if (boardMenuRef.current && !boardMenuRef.current.contains(e.target as Node)) {
        setOpenMenuBoardId(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openMenuBoardId])

  function reloadBoards() { qc.invalidateQueries({ queryKey: ['boards', shopId] }) }

  async function handleCreateBoard() {
    const trimmed = newBoardName.trim()
    if (!trimmed || !shopId) return
    const nb = await dbCreateBoard(shopId, { team_space_id: 'ts-default', type: 'general', name: trimmed })
    setNewBoardName('')
    setShowAddBoard(false)
    reloadBoards()
    router.push(`/production?board=${nb.id}`)
  }

  async function handleDeleteBoard(boardId: string) {
    if (!shopId) return
    try { await dbDeleteBoard(shopId, boardId) } catch {}
    reloadBoards()
    const next = boards.find(b => b.id !== boardId) ?? null
    if (urlBoardId === boardId || isProductionActive) {
      router.push(next ? `/production?board=${next.id}` : '/production')
    }
  }

  async function handleBoardRenameCommit() {
    if (!renamingBoardId || !shopId) return
    const trimmed = renamingBoardName.trim()
    if (trimmed) {
      try { await dbRenameBoard(shopId, renamingBoardId, trimmed) } catch {}
      reloadBoards()
    }
    setRenamingBoardId(null)
    setRenamingBoardName('')
  }

  /* ── Active board detection ── */
  const activeBoardId = urlBoardId || (isProductionActive && boards.length > 0 ? boards[0].id : '')

  /* ── Persist sidebar scroll position across page navigations ── */
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = navRef.current
    if (!el) return
    const saved = sessionStorage.getItem('sidebar-scroll')
    if (saved) el.scrollTop = Number(saved)
    const onScroll = () => sessionStorage.setItem('sidebar-scroll', String(el.scrollTop))
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header" style={collapsed ? { justifyContent: 'center', padding: 0 } : undefined}>
        {!collapsed && (
          <div className="sidebar-brand">
            <div className="brand-icon">OP</div>
            <span>Onsprint</span>
          </div>
        )}
        <button className="sidebar-collapse-btn" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? <Icon.Expand /> : <Icon.Collapse />}
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav" ref={navRef}>

        {/* Flat nav items — never shrink */}
        <div style={{ flexShrink: 0 }}>
        {filteredNav.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const badge = 0
          const stockBadge = item.label === 'Stock' && !collapsed && lowStockCount > 0 ? lowStockCount : 0
          return (
            <Link key={item.href} href={item.href} className={`nav-item${isActive ? ' active' : ''}`}>
              <span className="nav-icon"><item.icon /></span>
              <span className="nav-label">{item.label}</span>
              {badge > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--danger-text)', color: '#fff', borderRadius: 10, fontSize: 9.5, fontWeight: 700, minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', flexShrink: 0 }}>
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
              {stockBadge > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--warning)', color: '#fff', borderRadius: 10, fontSize: 9.5, fontWeight: 700, minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', flexShrink: 0 }}>
                  {stockBadge}
                </span>
              )}
            </Link>
          )
        })}
        </div>

        {/* Production */}
        {hasPermission('production') && (
        <div style={{ flexShrink: 0 }}>
          <Link
            href={boards.length > 0 ? `/production?board=${boards[0]?.id}` : '/production'}
            className={`nav-item${isProductionActive ? ' active' : ''}`}
          >
            <span className="nav-icon"><Icon.Production /></span>
            <span className="nav-label">Production</span>
          </Link>
        </div>
        )}

        {/* Bottom pinned items */}
        <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          {hasPermission('store') && (
          <Link href="/storefront" className={`nav-item${pathname === '/storefront' || pathname.startsWith('/storefront/') ? ' active' : ''}`}>
            <span className="nav-icon"><Icon.Storefront /></span>
            <span className="nav-label">My Store</span>
          </Link>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-profile" onClick={() => router.push('/settings')} style={{ cursor: 'pointer' }}>
          <div className="user-avatar">{(userName || userEmail || 'A').slice(0, 2).toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{userName || userEmail || 'User'}</div>
            <div className="user-email">{shop?.name || 'My Shop'}</div>
          </div>
          <span className="user-chevron"><Icon.Chevrons /></span>
        </div>
      </div>
    </aside>
  )
}
