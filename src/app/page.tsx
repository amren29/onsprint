'use client'

import Link from 'next/link'
import { useState } from 'react'

const f = "'Fira Sans', -apple-system, BlinkMacSystemFont, sans-serif"

/* ── Outline Icons ─────────────────────────────────── */
const ArrowRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const Check = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const OrderIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
const ProductionIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="11" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>
const StoreIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const PaymentIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const UsersIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
const ChartIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>

/* ── Data ──────────────────────────────────────────── */
const FEATURES = [
  { icon: <OrderIcon />, title: 'Order Management', desc: 'Track every order from quotation to delivery with real-time status updates and customer notifications.', color: '#006AFF' },
  { icon: <ProductionIcon />, title: 'Production Board', desc: 'Kanban-style workflow. Drag orders through 12 stages from artwork checking to collection.', color: '#7c3aed' },
  { icon: <StoreIcon />, title: 'Online Store', desc: 'Customers browse products, configure specs, upload artwork, and pay — all from your branded storefront.', color: '#22c55e' },
  { icon: <PaymentIcon />, title: 'Payment Gateway', desc: 'Accept FPX, cards, e-wallets via Billplz. Automatic split payments between platform and shop.', color: '#f59e0b' },
  { icon: <UsersIcon />, title: 'Customer & Agent', desc: 'Manage customers, agents with prepaid wallets, membership tiers, and affiliate commissions.', color: '#ec4899' },
  { icon: <ChartIcon />, title: 'Reports & Analytics', desc: 'Revenue dashboards, order trends, top customers, stock alerts, and production metrics.', color: '#06b6d4' },
]

const PLANS = [
  { name: 'Starter', price: 99, annual: 990, fee: '1.00', features: ['1 team member', 'Standard products (19)', 'Basic online store', 'Order & production management', 'Email support'] },
  { name: 'Growth', price: 249, annual: 2490, fee: '0.60', popular: true, features: ['5 team members', 'All product groups (55)', 'Online store + tracking', 'Agent & membership system', 'Priority support', 'Custom permissions'] },
  { name: 'Pro', price: 499, annual: 4990, fee: '0.20', features: ['Unlimited team members', 'All product groups (55)', 'Full website + builder', 'Custom domain', 'Advanced analytics', 'API access', 'Dedicated support'] },
]

const TESTIMONIALS = [
  { quote: 'Finally, a system built specifically for print shops. We reduced order processing time by 60%.', name: 'Ahmad Zulkifli', role: 'Owner, Kinabalu Print Shop' },
  { quote: 'The production board changed everything. We can see exactly where every job is at a glance.', name: 'Sarah Lim', role: 'Production Manager, PrintWorks KL' },
  { quote: 'Our customers love the online store. They can order and upload artwork anytime.', name: 'Hafiz Rahman', role: 'Director, EastPrint Solutions' },
]

export default function LandingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div style={{ fontFamily: f, color: '#0f172a', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ═══ NAV ═══ */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, background: '#7c3aed', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="white"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.4"/></svg>
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>Onsprint</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {['Features', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{item}</a>
            ))}
            <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Log in</Link>
            <Link href="/register" style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #7c3aed, #006AFF)', padding: '8px 20px', borderRadius: 8, textDecoration: 'none' }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO — Dark ═══ */}
      <section style={{
        paddingTop: 140, paddingBottom: 100,
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #1a1040 0%, #0a0f1e 60%, #060a14 100%)',
        position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 60%)', pointerEvents: 'none', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', top: '20%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,106,255,0.1) 0%, transparent 60%)', pointerEvents: 'none', filter: 'blur(60px)' }} />

        <div style={{ maxWidth: 850, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 600, color: '#a78bfa', marginBottom: 28, background: 'rgba(124,58,237,0.08)' }}>
            Built for Malaysian Print Shops
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 24px', color: '#fff' }}>
            One app to run your<br />entire print shop
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px', fontWeight: 400 }}>
            Orders, production, payments, online store — everything in one place. Stop juggling spreadsheets and start growing.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{
              fontSize: 15, fontWeight: 700, color: '#fff',
              background: 'linear-gradient(135deg, #7c3aed, #006AFF)',
              padding: '14px 32px', borderRadius: 10, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 0 32px rgba(124,58,237,0.3)',
            }}>
              Get Started — It&apos;s Free <ArrowRight />
            </Link>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 16, fontWeight: 400 }}>
            Free 14-day trial · No credit card · Setup in 5 minutes
          </p>

          {/* Product screenshot placeholder */}
          <div style={{
            marginTop: 60, borderRadius: 16, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
            padding: 3,
          }}>
            <div style={{ borderRadius: 13, overflow: 'hidden', background: '#111827', height: 'clamp(200px, 30vw, 420px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 14, fontWeight: 500 }}>Dashboard Preview</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Logos ═══ */}
      <section style={{ padding: '36px 24px', background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>Trusted by print shops across Malaysia</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap', opacity: 0.3 }}>
            {['Kinabalu Print', 'EastPrint', 'PrintWorks KL', 'Sabah Design', 'MYPrint Hub'].map(n => (
              <span key={n} style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Features</p>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px', margin: '0 0 16px' }}>
              Everything you need,<br />nothing you don&apos;t
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 480, margin: '0 auto', fontWeight: 400 }}>
              From order intake to delivery — one platform, zero headaches.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {FEATURES.map(fe => (
              <div key={fe.title} style={{
                padding: '28px 24px', borderRadius: 14,
                border: '1px solid #f1f5f9', background: '#fafbfd',
                display: 'flex', gap: 16, alignItems: 'flex-start',
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${fe.color}10`, color: fe.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {fe.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px' }}>{fe.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>{fe.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" style={{ padding: '100px 24px', background: '#f8faff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px', margin: '0 0 16px' }}>
              Start free, scale as you grow
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', marginBottom: 28, fontWeight: 400 }}>14-day free trial on every plan. No credit card required.</p>
            <div style={{ display: 'inline-flex', background: '#e2e8f0', borderRadius: 10, padding: 3 }}>
              {(['monthly', 'annual'] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)} style={{
                  padding: '8px 22px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: f,
                  background: billing === b ? '#fff' : 'transparent', color: billing === b ? '#0f172a' : '#64748b',
                  boxShadow: billing === b ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                }}>
                  {b === 'monthly' ? 'Monthly' : 'Annual'} {b === 'annual' && <span style={{ color: '#22c55e', fontSize: 11 }}>Save 17%</span>}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, alignItems: 'start' }}>
            {PLANS.map(p => (
              <div key={p.name} style={{
                padding: '36px 28px', borderRadius: 16,
                border: p.popular ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                background: '#fff', position: 'relative',
                boxShadow: p.popular ? '0 8px 40px rgba(124,58,237,0.1)' : 'none',
              }}>
                {p.popular && <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#7c3aed', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most Popular</div>}
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>{p.name}</h3>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 20px', fontWeight: 500 }}>RM {p.fee} platform fee / transaction</p>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-2px' }}>RM {billing === 'annual' ? Math.round(p.annual / 12) : p.price}</span>
                  <span style={{ fontSize: 15, color: '#94a3b8', fontWeight: 500 }}>/mo</span>
                  {billing === 'annual' && <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 600, marginTop: 4 }}>RM {p.annual}/yr billed annually</div>}
                </div>
                <Link href="/register" style={{
                  display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', marginBottom: 24,
                  background: p.popular ? 'linear-gradient(135deg, #7c3aed, #006AFF)' : '#f1f5f9',
                  color: p.popular ? '#fff' : '#374151',
                }}>Start Free Trial</Link>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {p.features.map(fe => (
                    <li key={fe} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#475569', fontWeight: 400 }}>
                      <Check />{fe}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px' }}>Loved by print shop owners</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ padding: 28, borderRadius: 14, border: '1px solid #f1f5f9', background: '#fafbfd' }}>
                <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, margin: '0 0 20px', fontWeight: 400 }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #006AFF)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{t.name.split(' ').map(w => w[0]).join('')}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA — Dark ═══ */}
      <section style={{
        padding: '100px 24px',
        background: 'radial-gradient(ellipse 70% 50% at 50% 100%, #1a1040 0%, #0a0f1e 60%, #060a14 100%)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 60%)', pointerEvents: 'none', filter: 'blur(80px)' }} />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', margin: '0 0 16px', lineHeight: 1.1 }}>Ready to streamline your print shop?</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 36, fontWeight: 400, lineHeight: 1.6 }}>Join hundreds of Malaysian print shops already on Onsprint.</p>
          <Link href="/register" style={{
            fontSize: 15, fontWeight: 700, color: '#0f172a', background: '#fff',
            padding: '14px 36px', borderRadius: 10, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>Start Your Free Trial <ArrowRight /></Link>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginTop: 16, fontWeight: 400 }}>14 days free · No credit card · Cancel anytime</p>
        </div>
      </section>

      {/* ═══ FOOTER — Dark ═══ */}
      <footer style={{ padding: '48px 24px 24px', background: '#060a14', color: '#64748b' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 24, height: 24, background: '#7c3aed', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="white"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.4"/></svg>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Onsprint</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, fontWeight: 400 }}>Print shop management<br />for Malaysian businesses.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Online Store', 'Production'] },
              { title: 'Company', links: ['About', 'Blog', 'Contact'] },
              { title: 'Support', links: ['Help Center', 'Status', 'Security'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>{col.title}</h4>
                {col.links.map(l => <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: '#475569', textDecoration: 'none', marginBottom: 8, fontWeight: 400 }}>{l}</a>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, margin: 0, fontWeight: 400 }}>© 2026 Onsprint. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Privacy', 'Terms', 'Cookies'].map(l => <a key={l} href="#" style={{ fontSize: 12, color: '#475569', textDecoration: 'none', fontWeight: 400 }}>{l}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
