// @ts-nocheck
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
const stagger = (i: number) => ({ ...fadeUp, transition: { ...fadeUp.transition, delay: i * 0.08 } })

const ff = "'Fira Sans', -apple-system, sans-serif"

/* ── Icons (outline) ── */
const Arrow = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const Chk = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const ChkDark = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const Shield = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>

/* feature grid icons */
const I = {
  orders: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
  production: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="11" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>,
  store: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  payments: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  customers: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  reports: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  stock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
  agents: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  membership: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  upload: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  proofing: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  realtime: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
}

const GRID = [
  { icon: I.orders, label: 'Orders' }, { icon: I.production, label: 'Production' }, { icon: I.store, label: 'Online Store' },
  { icon: I.payments, label: 'Payments' }, { icon: I.customers, label: 'Customers' }, { icon: I.reports, label: 'Reports' },
  { icon: I.stock, label: 'Stock' }, { icon: I.agents, label: 'Agents' }, { icon: I.membership, label: 'Membership' },
  { icon: I.upload, label: 'File Upload' }, { icon: I.proofing, label: 'Proofing' }, { icon: I.realtime, label: 'Real-time' },
]

const SOLUTIONS = [
  { tab: 'Print Shops', title: 'Manage orders,\ndeliver on time', subtitle: 'every time', desc: 'Track orders from intake to collection with a production board built for printing workflows.', bullets: ['Accept orders online or walk-in', 'Track production across 12 stages', 'Auto-notify customers on status'], features: ['Order tracking from day one', 'Kanban production board', 'Customer auto-notifications', 'Payment collection via Billplz'] },
  { tab: 'Design Studios', title: 'Streamline your\ncreative workflow', subtitle: 'effortlessly', desc: 'Manage design projects, proofing, and client communication in one place.', bullets: ['Upload and proof artwork', 'Client approval workflow', 'Version control for designs'], features: ['Artwork proofing system', 'Client feedback portal', 'File storage on R2', 'Project timeline tracking'] },
  { tab: 'Print & Design', title: 'Run both sides\nof your business', subtitle: 'seamlessly', desc: 'Combine print production with design services — one dashboard for everything.', bullets: ['Design + print in one flow', 'Unified customer database', 'Combined invoicing'], features: ['Full production pipeline', 'Online store with specs', 'Agent & membership system', 'Advanced reporting'] },
]

const PLANS = [
  { name: 'Starter', price: 99, annual: 990, fee: '1.00', features: ['1 team member', '19 standard products', 'Basic online store', 'Order & production board', 'Email support'] },
  { name: 'Growth', price: 249, annual: 2490, fee: '0.60', popular: true, features: ['5 team members', 'All 55 products', 'Online store + tracking', 'Agent & membership', 'Priority support', 'Custom permissions'] },
  { name: 'Pro', price: 499, annual: 4990, fee: '0.20', features: ['Unlimited team', 'All 55 products', 'Full website builder', 'Custom domain', 'Advanced analytics', 'API access', 'Dedicated support'] },
]

const mx = { maxWidth: 1140, margin: '0 auto', padding: '0 24px' } as const

export default function LandingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [activeTab, setActiveTab] = useState(0)
  const sol = SOLUTIONS[activeTab]

  return (
    <div style={{ fontFamily: ff, color: '#1a1a1a', background: '#fff' }}>

      {/* ═══ NAV ═══ */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ ...mx, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#1a1a1a' }}>
            <div style={{ width: 28, height: 28, background: '#7c3aed', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="white"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.4"/></svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Onsprint</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {['Features', 'Pricing'].map(i => <a key={i} href={`#${i.toLowerCase()}`} style={{ fontSize: 14, fontWeight: 500, color: '#666', textDecoration: 'none' }}>{i}</a>)}
            <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', textDecoration: 'none', border: '1px solid #e0e0e0', padding: '6px 16px', borderRadius: 8 }}>Login</Link>
            <Link href="/register" style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: '#1a1a1a', padding: '6px 18px', borderRadius: 8, textDecoration: 'none' }}>Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO — white, split layout ═══ */}
      <section style={{ padding: '80px 24px 0' }}>
        <motion.div {...fadeUp} style={{ ...mx, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center' }}>
          {/* Left — headline */}
          <div>
            <h1 style={{ fontSize: 'clamp(42px, 5.5vw, 68px)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 28px', color: '#1a1a1a' }}>
              Every order.<br />Every job.<br /><span style={{ color: '#999' }}>One platform.</span>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/register" style={{ fontSize: 15, fontWeight: 600, color: '#fff', background: '#1a1a1a', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Get started. It&apos;s FREE!
              </Link>
              <span style={{ fontSize: 13, color: '#999' }}>Free forever.<br />No credit card.</span>
            </div>
          </div>
          {/* Right — bullets */}
          <div>
            <div style={{ display: 'inline-block', background: '#f5f0ff', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 600, color: '#7c3aed', marginBottom: 20 }}>
              🚀 Built for Print Shops
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Replace spreadsheets & WhatsApp', 'Manage orders, production & payments', 'Launch your online store instantly'].map(b => (
                <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 500, color: '#374151' }}>
                  <ChkDark />{b}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Product screenshot */}
        <div style={{ ...mx, marginTop: 56 }}>
          <motion.div {...fadeUp} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 4px 40px rgba(0,0,0,0.06)' }}>
            {/* Browser chrome */}
            <div style={{ background: '#f1f1f1', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: '4px 12px', fontSize: 11, color: '#999', fontWeight: 400, border: '1px solid #e5e7eb' }}>onsprint.my/dashboard</div>
            </div>
            {/* Dashboard body */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', background: '#fff' }}>
              {/* Sidebar */}
              <div style={{ background: '#fafafa', borderRight: '1px solid #f0f0f0', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ padding: '0 16px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, background: '#7c3aed', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="white"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.4"/></svg>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>Onsprint</span>
                </div>
                {[
                  { label: 'Dashboard', active: true },
                  { label: 'Orders', active: false },
                  { label: 'Customers', active: false },
                  { label: 'Payments', active: false },
                  { label: 'Products', active: false },
                  { label: 'Production', active: false },
                ].map(nav => (
                  <div key={nav.label} style={{ padding: '8px 16px', fontSize: 12, fontWeight: nav.active ? 600 : 400, color: nav.active ? '#7c3aed' : '#666', background: nav.active ? '#f3f0ff' : 'transparent', borderRight: nav.active ? '2px solid #7c3aed' : '2px solid transparent' }}>{nav.label}</div>
                ))}
              </div>
              {/* Main content */}
              <div style={{ padding: '24px 28px' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 20 }}>Dashboard</div>
                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                  {[
                    { label: 'Revenue', value: 'RM 12,450', color: '#22c55e', bg: '#f0fdf4' },
                    { label: 'Orders', value: '48', color: '#3b82f6', bg: '#eff6ff' },
                    { label: 'Pending', value: '12', color: '#f59e0b', bg: '#fffbeb' },
                    { label: 'Active', value: '8', color: '#7c3aed', bg: '#f5f3ff' },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '14px 16px', borderRadius: 10, background: s.bg, border: '1px solid #f0f0f0' }}>
                      <div style={{ fontSize: 10, fontWeight: 500, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                {/* Orders table */}
                <div style={{ border: '1px solid #f0f0f0', borderRadius: 10, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: '#fafafa' }}>
                        {['Order', 'Customer', 'Total', 'Status', 'Production'].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#888', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { order: '#1042', customer: 'Restoran Ali', total: 'RM 450', status: 'Paid', statusColor: '#22c55e', statusBg: '#f0fdf4', prod: 'Printing', prodColor: '#3b82f6', prodBg: '#eff6ff' },
                        { order: '#1041', customer: 'Kedai Kopi Lim', total: 'RM 280', status: 'Pending', statusColor: '#f59e0b', statusBg: '#fffbeb', prod: 'Designing', prodColor: '#7c3aed', prodBg: '#f5f3ff' },
                        { order: '#1040', customer: 'SK Taman Ria', total: 'RM 1,200', status: 'Paid', statusColor: '#22c55e', statusBg: '#f0fdf4', prod: 'Ready to Print', prodColor: '#f59e0b', prodBg: '#fffbeb' },
                        { order: '#1039', customer: 'Suria Printing', total: 'RM 680', status: 'Paid', statusColor: '#22c55e', statusBg: '#f0fdf4', prod: 'QC', prodColor: '#22c55e', prodBg: '#f0fdf4' },
                      ].map(r => (
                        <tr key={r.order} style={{ borderBottom: '1px solid #f7f7f7' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1a1a1a' }}>{r.order}</td>
                          <td style={{ padding: '10px 14px', color: '#555' }}>{r.customer}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1a1a1a' }}>{r.total}</td>
                          <td style={{ padding: '10px 14px' }}><span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, color: r.statusColor, background: r.statusBg }}>{r.status}</span></td>
                          <td style={{ padding: '10px 14px' }}><span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, color: r.prodColor, background: r.prodBg }}>{r.prod}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TRUSTED BY ═══ */}
      <section style={{ padding: '48px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ ...mx, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Trusted by the best</span>
          {['Kinabalu Print', 'EastPrint', 'PrintWorks KL', 'Sabah Design', 'MYPrint Hub'].map(n => (
            <span key={n} style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', opacity: 0.25 }}>{n}</span>
          ))}
        </div>
      </section>

      {/* ═══ PROBLEM — big centered headline ═══ */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={mx}>
          <motion.div {...fadeUp}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-1.5px', margin: '0 0 16px' }}>
              60% of print shop time is lost in <span style={{ color: '#bbb' }}>manual work</span>
            </h2>
            <p style={{ fontSize: 17, color: '#888', fontWeight: 400, maxWidth: 520, margin: '0 auto 56px' }}>WhatsApp orders, Excel tracking, and paper invoices are destroying your productivity.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { title: 'Order Chaos', stat: '3+ hours daily', desc: 'wasted on WhatsApp order management' },
              { title: 'No Visibility', stat: '80% of shops', desc: 'can\'t track production in real-time' },
              { title: 'Lost Revenue', stat: 'RM 2,000+/mo', desc: 'lost to missed follow-ups and errors' },
            ].map((p, i) => (
              <motion.div key={p.title} {...stagger(i)} style={{ textAlign: 'center', padding: '32px 24px' }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>{p.title}</h3>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>{p.stat}</div>
                <div style={{ fontSize: 14, color: '#999', fontWeight: 400 }}>{p.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURE GRID — ClickUp style ═══ */}
      <section id="features" style={{ padding: '80px 24px 100px', background: '#fff' }}>
        <div style={mx}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 600, letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 12px' }}>
              Everything you need in <span style={{ color: '#bbb' }}>one</span><br />print shop platform
            </h2>
            <p style={{ fontSize: 16, color: '#888', fontWeight: 400 }}>12+ features to run your entire business.</p>
          </div>

          <motion.div {...fadeUp} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #e8e8e8' }}>
            {/* Row 1 — 7 items */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {GRID.slice(0, 7).map(g => (
                <div key={g.label} style={{ padding: '28px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, borderRight: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ color: '#444' }}>{g.icon}</div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{g.label}</span>
                </div>
              ))}
            </div>
            {/* Row 2 — 5 items + 2 featured cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {GRID.slice(7).map(g => (
                <div key={g.label} style={{ padding: '28px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, borderRight: '1px solid #f0f0f0' }}>
                  <div style={{ color: '#444' }}>{g.icon}</div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{g.label}</span>
                </div>
              ))}
              {/* Featured card spanning 2 columns */}
              <div style={{ gridColumn: 'span 2', background: '#f5f5f5', borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <div style={{ textAlign: 'center' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8, color: '#1a1a1a' }}>Coming Soon</div>
                  <div style={{ fontSize: 12, color: '#999', fontWeight: 400, marginTop: 2 }}>WhatsApp Integration, Invoicing & more</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ PLATFORM — Lark style ═══ */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #f5f0ff 0%, #fce4ec 50%, #fff3e0 100%)', borderRadius: 20, margin: '0 16px' }}>
        <div style={mx}>
          <motion.div {...fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginBottom: 64 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 600, letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 16px', color: '#1a1a1a' }}>
                One platform.<br />Built for print shops.<br /><span style={{ color: '#7c3aed' }}>Web-to-print.</span>
              </h2>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.7, fontWeight: 400, margin: '0 0 24px', maxWidth: 400 }}>Onsprint replaces scattered tools with one unified platform — from customer orders to finished products.</p>
              <Link href="/register" style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: '#7c3aed', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Get started for free
              </Link>
            </div>
            <div style={{ position: 'relative', height: 280 }}>
              {/* Floating icons */}
              {[
                { top: '5%', left: '20%', bg: '#7c3aed', icon: I.orders },
                { top: '10%', right: '10%', bg: '#006AFF', icon: I.store },
                { top: '40%', left: '5%', bg: '#22c55e', icon: I.payments },
                { top: '35%', right: '25%', bg: '#f59e0b', icon: I.production },
                { top: '65%', left: '25%', bg: '#ec4899', icon: I.customers },
                { top: '70%', right: '5%', bg: '#06b6d4', icon: I.proofing },
                { top: '25%', left: '45%', bg: '#1a1a1a', icon: I.reports },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  style={{ position: 'absolute', ...item, width: 48, height: 48, borderRadius: 14, background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.bg }}>
                  {item.icon}
                </motion.div>
              ))}
              {/* Center circle */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 200, height: 200, borderRadius: '50%', border: '1px dashed rgba(124,58,237,0.2)' }} />
            </div>
          </motion.div>

          {/* Feature cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { icon: I.store, title: 'Online Store', desc: 'Customers order and pay online 24/7' },
              { icon: I.production, title: 'Production Board', desc: 'Kanban workflow with 12 stages' },
              { icon: I.proofing, title: 'Artwork Proofing', desc: 'Upload, review, approve artwork' },
              { icon: I.orders, title: 'Order Management', desc: 'Track every order from start to finish' },
              { icon: I.upload, title: 'File Upload', desc: 'Customers upload files to R2 storage' },
              { icon: I.payments, title: 'Online Payments', desc: 'FPX, cards, e-wallets via Billplz' },
              { icon: I.agents, title: 'Agent System', desc: 'Resellers with prepaid wallets' },
              { icon: I.membership, title: 'Membership', desc: 'Tiered pricing for loyal customers' },
              { icon: I.realtime, title: 'Real-time Updates', desc: 'Instant order notifications' },
              { icon: I.reports, title: 'Reports', desc: 'Revenue, orders, production metrics' },
            ].map((c, i) => (
              <motion.div key={c.title} {...stagger(i)} style={{ background: '#fff', borderRadius: 14, padding: '24px 20px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div style={{ color: '#555', marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: '#888', fontWeight: 400, lineHeight: 1.5 }}>{c.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOLUTIONS — tabbed ═══ */}
      <section style={{ padding: '100px 24px' }}>
        <div style={mx}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 600, letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 12px' }}>
              Solutions for every <span style={{ color: '#bbb' }}>team</span>
            </h2>
            <p style={{ fontSize: 16, color: '#888', fontWeight: 400, marginBottom: 24 }}>Your key workflows, powered by Onsprint.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              {SOLUTIONS.map((s, i) => (
                <button key={s.tab} onClick={() => setActiveTab(i)} style={{
                  padding: '7px 18px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: ff,
                  border: activeTab === i ? '2px solid #1a1a1a' : '1px solid #e0e0e0',
                  background: activeTab === i ? '#fff' : '#fff', color: '#1a1a1a',
                }}>{s.tab}</button>
              ))}
            </div>
          </div>

          <motion.div {...fadeUp} style={{ border: '1px solid #e8e8e8', borderRadius: 16, padding: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div>
              <h3 style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.5px', margin: '0 0 8px', whiteSpace: 'pre-line' }}>
                {sol.title},<br /><span style={{ color: '#bbb' }}>{sol.subtitle}</span>
              </h3>
              <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, margin: '0 0 20px', fontWeight: 400 }}>{sol.desc}</p>
              <ul style={{ margin: '0 0 24px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sol.bullets.map(b => <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#555', fontWeight: 400 }}><ChkDark />{b}</li>)}
              </ul>
              <Link href="/register" style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #1a1a1a', padding: '8px 18px', borderRadius: 8 }}>
                Explore solution <Arrow />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sol.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 10, background: '#f8f9fb', border: '1px solid #f0f0f0' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eee', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS — photo cards ═══ */}
      <section style={{ padding: '80px 24px 100px', background: '#fff' }}>
        <div style={mx}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 600, letterSpacing: '-1px', lineHeight: 1.1, margin: '0 0 48px' }}>
            Loved by print shops,<br />backed by results
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { quote: 'Onsprint cut our order processing time by 60%. Finally a system built for print shops.', name: 'Ahmad Z.', role: 'Owner', company: 'Kinabalu Print' },
              { quote: 'The production board changed everything. We see exactly where every job is.', name: 'Sarah L.', role: 'Production Mgr', company: 'PrintWorks KL' },
              { quote: 'Our customers order online at 2am. We just process in the morning. Game changer.', name: 'Hafiz R.', role: 'Director', company: 'EastPrint' },
            ].map((t, i) => (
              <motion.div key={t.name} {...stagger(i)} style={{ borderRadius: 14, overflow: 'hidden', background: '#1a1a1a', color: '#fff', padding: '0 0 24px', display: 'flex', flexDirection: 'column', minHeight: 320 }}>
                <div style={{ flex: 1, background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 700, color: '#333' }}>
                  {t.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div style={{ padding: '20px 24px 0' }}>
                  <p style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 16px', fontWeight: 400, color: 'rgba(255,255,255,0.85)' }}>&ldquo;{t.quote}&rdquo;</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>{t.role}</div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.05em' }}>{t.company.toUpperCase()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" style={{ padding: '100px 24px' }}>
        <div style={mx}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 600, letterSpacing: '-1.5px', margin: '0 0 12px' }}>
              Simple, transparent <span style={{ color: '#bbb' }}>pricing</span>
            </h2>
            <p style={{ fontSize: 16, color: '#888', fontWeight: 400, marginBottom: 24 }}>14-day free trial. No credit card required.</p>
            <div style={{ display: 'inline-flex', background: '#f0f0f0', borderRadius: 10, padding: 3 }}>
              {(['monthly', 'annual'] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)} style={{ padding: '7px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: ff, background: billing === b ? '#fff' : 'transparent', color: '#1a1a1a', boxShadow: billing === b ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}>
                  {b === 'monthly' ? 'Monthly' : 'Annual'}{b === 'annual' && <span style={{ color: '#22c55e', fontSize: 11, marginLeft: 4 }}>-17%</span>}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {PLANS.map((p, i) => (
              <motion.div key={p.name} {...stagger(i)} style={{ padding: '36px 28px', borderRadius: 16, border: p.popular ? '2px solid #1a1a1a' : '1px solid #e5e7eb', background: '#fff', position: 'relative' }}>
                {p.popular && <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 12px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Most Popular</div>}
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 4px' }}>{p.name}</h3>
                <p style={{ fontSize: 12, color: '#999', margin: '0 0 20px', fontWeight: 400 }}>RM {p.fee} per transaction</p>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-2px' }}>RM {billing === 'annual' ? Math.round(p.annual / 12) : p.price}</span>
                  <span style={{ fontSize: 14, color: '#999', fontWeight: 400 }}>/mo</span>
                  {billing === 'annual' && <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 500, marginTop: 2 }}>RM {p.annual}/yr billed annually</div>}
                </div>
                <Link href="/register" style={{ display: 'block', textAlign: 'center', padding: '11px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', marginBottom: 24, background: p.popular ? '#1a1a1a' : '#f5f5f5', color: p.popular ? '#fff' : '#374151' }}>
                  Start Free Trial
                </Link>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.features.map(fe => <li key={fe} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#555', fontWeight: 400 }}><Chk />{fe}</li>)}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECURITY ═══ */}
      <section style={{ padding: '60px 24px', background: '#fff', textAlign: 'center' }}>
        <div style={mx}>
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 20px' }}>Enterprise-grade security</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
            {['SSL Encrypted', 'Supabase Auth', 'Cloudflare CDN', 'R2 Storage', 'Daily Backups'].map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: '#666' }}><Shield />{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <motion.div {...fadeUp} style={mx}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 600, letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 16px' }}>
            Save 6-7 hours<br /><span style={{ color: '#bbb' }}>every week.</span>
          </h2>
          <p style={{ fontSize: 17, color: '#888', fontWeight: 400, marginBottom: 32 }}>Join hundreds of Malaysian print shops on Onsprint.</p>
          <Link href="/register" style={{ fontSize: 16, fontWeight: 600, color: '#fff', background: '#1a1a1a', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Get started FREE <Arrow />
          </Link>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: '48px 24px 20px', background: '#1a1a1a', color: '#777' }}>
        <div style={mx}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32, marginBottom: 36 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 24, height: 24, background: '#7c3aed', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="white"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.4"/></svg>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Onsprint</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, fontWeight: 400, maxWidth: 220 }}>Print shop management for Malaysian businesses.</p>
            </div>
            {[
              { t: 'Product', l: ['Features', 'Pricing', 'Online Store', 'Production'] },
              { t: 'Company', l: ['About', 'Blog', 'Contact'] },
              { t: 'Support', l: ['Help Center', 'Status', 'Security'] },
            ].map(c => (
              <div key={c.t}>
                <h4 style={{ fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>{c.t}</h4>
                {c.l.map(l => <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: '#666', textDecoration: 'none', marginBottom: 7, fontWeight: 400 }}>{l}</a>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 400 }}>© 2026 Onsprint</span>
            <div style={{ display: 'flex', gap: 16 }}>
              {['Privacy', 'Terms'].map(l => <a key={l} href="#" style={{ fontSize: 12, color: '#666', textDecoration: 'none' }}>{l}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
