// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useShop } from '@/providers/shop-provider'
import { ALL_PERMISSIONS, type PermissionKey } from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/client'

const PERMISSION_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  customers: 'Customers',
  payments: 'Payments',
  stock: 'Stock',
  suppliers: 'Suppliers',
  agents: 'Agents',
  membership: 'Membership',
  products: 'Products',
  reports: 'Reports',
  production: 'Production',
  store: 'My Store',
  settings: 'Settings',
}

type Member = {
  id: string
  user_id: string
  role: string
  name: string
  email: string
  permissions: string[]
  created_at: string
}

export default function TeamSection() {
  const { shopId } = useShop()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitePermissions, setInvitePermissions] = useState<string[]>([...ALL_PERMISSIONS])
  const [saving, setSaving] = useState(false)

  async function loadMembers() {
    if (!shopId) return
    const res = await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'select', table: 'shop_members', shopId }),
    })
    const { data } = await res.json()
    setMembers(data || [])
    setLoading(false)
  }

  useEffect(() => { loadMembers() }, [shopId])

  async function updatePermissions(memberId: string, permissions: string[]) {
    setSaving(true)
    await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', table: 'shop_members', shopId, id: memberId, data: { permissions } }),
    })
    await loadMembers()
    setSaving(false)
  }

  async function handleInvite() {
    if (!inviteEmail.trim() || !shopId) return
    setSaving(true)

    // Create Supabase auth user for the team member
    const res = await fetch('/api/store/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: inviteName.trim() || inviteEmail.split('@')[0],
        email: inviteEmail.trim(),
        password: Math.random().toString(36).slice(2, 10) + 'A1!', // temp password
        role: 'shop_member',
        shopId,
      }),
    })

    // Also check if user already exists in auth
    const supabase = createClient()
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Add to shop_members with permissions
    // First get the auth user ID
    const signupData = await res.json()
    if (signupData.user?.auth_user_id || signupData.user?.id) {
      const userId = signupData.user.auth_user_id || signupData.user.id

      // Check if already a member
      const checkRes = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'select_single', table: 'shop_members', shopId, filters: { user_id: userId } }),
      })
      const { data: existing } = await checkRes.json()

      if (!existing) {
        await fetch('/api/db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'insert', table: 'shop_members', shopId,
            data: {
              user_id: userId,
              role: 'staff',
              name: inviteName.trim() || inviteEmail.split('@')[0],
              email: inviteEmail.trim(),
              permissions: invitePermissions,
            },
          }),
        })
      }
    }

    await loadMembers()
    setShowInvite(false)
    setInviteName('')
    setInviteEmail('')
    setInvitePermissions([...ALL_PERMISSIONS])
    setSaving(false)
  }

  async function removeMember(memberId: string) {
    if (!confirm('Remove this team member?')) return
    await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', table: 'shop_members', shopId, id: memberId }),
    })
    await loadMembers()
  }

  function togglePermission(memberId: string, member: Member, perm: string) {
    const current = member.permissions || []
    const updated = current.includes(perm)
      ? current.filter(p => p !== perm)
      : [...current, perm]
    updatePermissions(memberId, updated)
  }

  function toggleAllPermissions(checked: boolean) {
    setInvitePermissions(checked ? [...ALL_PERMISSIONS] : [])
  }

  if (loading) return <div style={{ padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>Loading team...</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Team Members</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>{members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" style={{ fontSize: 12, padding: '7px 14px' }} onClick={() => setShowInvite(true)}>
          + Add Member
        </button>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px' }}>Invite Team Member</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Name" className="form-input" style={{ fontSize: 13 }} />
            <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="Email" type="email" className="form-input" style={{ fontSize: 13 }} />
          </div>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>Permissions</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={invitePermissions.length === ALL_PERMISSIONS.length} onChange={e => toggleAllPermissions(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
              Select all
            </label>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {ALL_PERMISSIONS.map(perm => (
              <label key={perm} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', padding: '4px 8px', borderRadius: 6, background: invitePermissions.includes(perm) ? 'rgba(0,106,255,0.08)' : 'var(--bg-hover)', border: `1px solid ${invitePermissions.includes(perm) ? 'var(--accent)' : 'var(--border)'}` }}>
                <input type="checkbox" checked={invitePermissions.includes(perm)} onChange={() => setInvitePermissions(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm])} style={{ accentColor: 'var(--accent)', width: 13, height: 13 }} />
                {PERMISSION_LABELS[perm]}
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn-secondary" style={{ fontSize: 12, padding: '7px 14px' }} onClick={() => setShowInvite(false)}>Cancel</button>
            <button className="btn-primary" style={{ fontSize: 12, padding: '7px 14px' }} disabled={!inviteEmail.trim() || saving} onClick={handleInvite}>
              {saving ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </div>
      )}

      {/* Members list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {members.map(member => (
          <div key={member.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: editingId === member.id ? 12 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                  {(member.name || member.email || '?').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{member.name || member.email}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{member.email} · {member.role === 'owner' ? 'Owner' : 'Staff'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {member.role !== 'owner' && (
                  <>
                    <button onClick={() => setEditingId(editingId === member.id ? null : member.id)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: editingId === member.id ? 'var(--accent)' : 'var(--bg-card)', color: editingId === member.id ? '#fff' : 'var(--text-secondary)', cursor: 'pointer' }}>
                      {editingId === member.id ? 'Done' : 'Permissions'}
                    </button>
                    <button onClick={() => removeMember(member.id)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-card)', color: '#ef4444', cursor: 'pointer' }}>
                      Remove
                    </button>
                  </>
                )}
                {member.role === 'owner' && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '4px 8px' }}>Full access</span>
                )}
              </div>
            </div>

            {/* Permission toggles */}
            {editingId === member.id && member.role !== 'owner' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ALL_PERMISSIONS.map(perm => {
                  const active = (member.permissions || []).includes(perm)
                  return (
                    <label key={perm} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', padding: '4px 8px', borderRadius: 6, background: active ? 'rgba(0,106,255,0.08)' : 'var(--bg-hover)', border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`, transition: 'all 0.12s' }}>
                      <input type="checkbox" checked={active} onChange={() => togglePermission(member.id, member, perm)} style={{ accentColor: 'var(--accent)', width: 13, height: 13 }} />
                      {PERMISSION_LABELS[perm]}
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
