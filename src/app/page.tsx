'use client'

import Link from 'next/link'
import { useState } from 'react'

/* ── Icons ─────────────────────────────────────────── */
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const ArrowRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>

/* ── Data ──────────────────────────────────────────── */
const FEATURES = [
  { icon: '📋', title: 'Order Management', desc: 'Track every order from quotation to delivery. Real-time status updates, production tracking, and customer notifications.' },
  { icon: '🏭', title: 'Production Board', desc: 'Kanban-style production workflow. Drag orders through 12 customizable stages from artwork checking to collection.' },
  { icon: '🛒', title: 'Online Store', desc: 'Built-in e-commerce storefront. Customers browse products, configure options, upload artwork, and pay online.' },
  { icon: '💳', title: 'Payment Gateway', desc: 'Accept FPX, cards, e-wallets via Billplz. Auto-split payments between platform and shop owner.' },
  { icon: '👥', title: 'Customer & Agent', desc: 'Manage customers, agents with prepaid wallets, membership tiers, and affiliate tracking.' },
  { icon: '📊', title: 'Reports & Analytics', desc: 'Revenue dashboards, order trends, top customers, stock alerts, and production efficiency metrics.' },
]

const PLANS = [
  { name: 'Starter', price: 99, annual: 990, fee: '1.00', features: ['1 team member', 'Standard products (19)', 'Basic online store', 'Order & production management', 'Email support'], color: '#64748b' },
  { name: 'Growth', price: 249, annual: 2490, fee: '0.60', features: ['5 team members', 'All product groups (55)', 'Online store + tracking', 'Agent & membership system', 'Priority support', 'Custom permissions'], color: '#7c3aed', popular: true },
  { name: 'Pro', price: 499, annual: 4990, fee: '0.20', features: ['Unlimited team members', 'All product groups (55)', 'Full website + builder', 'Custom domain', 'Advanced analytics', 'API access', 'Dedicated support'], color: '#006AFF' },
]

const TESTIMONIALS = [
  { quote: 'Finally, a system built specifically for print shops. We reduced order processing time by 60%.', name: 'Ahmad Zulkifli', role: 'Owner, Kinabalu Print Shop', avatar: 'AZ' },
  { quote: 'The production board changed everything. We can see exactly where every job is at a glance.', name: 'Sarah Lim', role: 'Production Manager, PrintWorks KL', avatar: 'SL' },
  { quote: 'Our customers love the online store. They can order and upload artwork anytime, even at 2am.', name: 'Hafiz Rahman', role: 'Director, EastPrint Solutions', avatar: 'HR' },
]

/* ── Page ──────────────────────────────────────────── */
export default function LandingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: '#0f172a', overflow: 'hidden' }}>

      {/* ── Navbar ─────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: '#006AFF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="white"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.4"/></svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Onsprint</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {['Features', 'Pricing', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ fontSize: 14, fontWeight: 500, color: '#64748b', textDecoration: 'none', display: 'none' }} className="md-show">{item}</a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: '#64748b', textDecoration: 'none', padding: '8px 16px' }}>Log in</Link>
            <Link href="/register" style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#006AFF', padding: '8px 20px', borderRadius: 8, textDecoration: 'none' }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section style={{
        paddingTop: 140, paddingBottom: 80,
        background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,106,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', padding: '0 24px', position: 'relative' }}>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #006AFF15, #7c3aed15)', borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 600, color: '#006AFF', marginBottom: 24 }}>
            🚀 Built for Malaysian Print Shops
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1.5px', margin: '0 0 20px', color: '#0f172a' }}>
            One app to run your<br />
            <span style={{ background: 'linear-gradient(135deg, #006AFF, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>entire print shop</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#64748b', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 36px' }}>
            Orders, production, payments, online store — everything in one place. Stop juggling spreadsheets and start growing your business.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{
              fontSize: 16, fontWeight: 700, color: '#fff', background: '#006AFF',
              padding: '14px 32px', borderRadius: 10, textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,106,255,0.3)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Get Started Free <ArrowRight />
            </Link>
            <a href="#features" style={{
              fontSize: 16, fontWeight: 600, color: '#374151',
              padding: '14px 32px', borderRadius: 10, textDecoration: 'none',
              border: '1.5px solid #e2e8f0', background: '#fff',
            }}>
              See How It Works
            </a>
          </div>

          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 16 }}>
            Free 14-day trial · No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── Trusted by ──────────────────────────────── */}
      <section style={{ padding: '40px 24px', background: '#fff', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Trusted by print shops across Malaysia</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', opacity: 0.4 }}>
            {['Kinabalu Print', 'EastPrint', 'PrintWorks KL', 'Sabah Design', 'MYPrint Hub'].map(name => (
              <span key={name} style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────── */}
      <section id="features" style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-1px', margin: '0 0 12px' }}>
              Everything you need to run a print shop
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 500, margin: '0 auto' }}>
              From order intake to delivery — one platform, zero headaches.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ padding: 28, borderRadius: 16, border: '1px solid #f1f5f9', background: '#fafbfc' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────── */}
      <section id="pricing" style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #f8faff 0%, #fff 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-1px', margin: '0 0 12px' }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', marginBottom: 24 }}>
              Start free for 14 days. No credit card required.
            </p>
            <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: 10, padding: 4 }}>
              <button onClick={() => setBilling('monthly')} style={{
                padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                background: billing === 'monthly' ? '#fff' : 'transparent', color: billing === 'monthly' ? '#0f172a' : '#64748b',
                boxShadow: billing === 'monthly' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}>Monthly</button>
              <button onClick={() => setBilling('annual')} style={{
                padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                background: billing === 'annual' ? '#fff' : 'transparent', color: billing === 'annual' ? '#0f172a' : '#64748b',
                boxShadow: billing === 'annual' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}>Annual <span style={{ color: '#22c55e', fontSize: 11 }}>Save 17%</span></button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'start' }}>
            {PLANS.map(p => (
              <div key={p.name} style={{
                padding: 32, borderRadius: 16,
                border: p.popular ? `2px solid ${p.color}` : '1px solid #e2e8f0',
                background: '#fff', position: 'relative',
                boxShadow: p.popular ? `0 8px 32px ${p.color}15` : 'none',
              }}>
                {p.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: p.color, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most Popular</div>
                )}
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px', color: p.color }}>{p.name}</h3>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px' }}>Platform fee: RM {p.fee}/transaction</p>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-1px' }}>RM {billing === 'annual' ? Math.round(p.annual / 12) : p.price}</span>
                  <span style={{ fontSize: 14, color: '#94a3b8' }}>/mo</span>
                  {billing === 'annual' && <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>RM {p.annual}/year billed annually</div>}
                </div>
                <Link href="/register" style={{
                  display: 'block', textAlign: 'center', padding: '12px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', marginBottom: 20,
                  background: p.popular ? p.color : '#f8fafc', color: p.popular ? '#fff' : '#374151',
                  border: p.popular ? 'none' : '1px solid #e2e8f0',
                }}>Start Free Trial</Link>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#475569' }}>
                      <span style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }}><CheckIcon /></span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────── */}
      <section id="testimonials" style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-1px', margin: '0 0 12px' }}>Loved by print shop owners</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ padding: 28, borderRadius: 16, border: '1px solid #f1f5f9', background: '#fafbfc' }}>
                <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, margin: '0 0 20px', fontStyle: 'italic' }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#006AFF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #0a1628 0%, #0f2847 50%, #0a1628 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,106,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', margin: '0 0 16px' }}>Ready to streamline your print shop?</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>Join hundreds of Malaysian print shops already using Onsprint.</p>
          <Link href="/register" style={{
            fontSize: 16, fontWeight: 700, color: '#0f172a', background: '#fff',
            padding: '14px 36px', borderRadius: 10, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>Start Your Free Trial <ArrowRight /></Link>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 16 }}>14 days free · No credit card · Setup in 5 minutes</p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer style={{ padding: '48px 24px 24px', background: '#0f172a', color: '#94a3b8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, background: '#006AFF', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="white"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.4"/></svg>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Onsprint</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6 }}>Print shop management platform built for Malaysian businesses.</p>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Product</h4>
              {['Features', 'Pricing', 'Online Store', 'Production Board'].map(l => (
                <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 8 }}>{l}</a>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Company</h4>
              {['About', 'Blog', 'Contact'].map(l => (
                <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 8 }}>{l}</a>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Support</h4>
              {['Help Center', 'Status', 'Security'].map(l => (
                <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 8 }}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, margin: 0 }}>© 2026 Onsprint. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Privacy', 'Terms', 'Cookies'].map(l => (
                <a key={l} href="#" style={{ fontSize: 12, color: '#64748b', textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
