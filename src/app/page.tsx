'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

/* ── CSS Animations ──────────────────────────────────── */
const LANDING_CSS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes float1 {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(3deg); }
  }
  @keyframes float2 {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(-2deg); }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .landing * { box-sizing: border-box; }
  .landing a { text-decoration: none; color: inherit; }
  .landing button { cursor: pointer; border: none; background: none; font-family: inherit; }
  .fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }
  .landing-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .landing-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,106,255,0.25); }
  .landing-btn-primary { background: #006AFF; color: #fff; }
  .landing-btn-secondary { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(8px); }
  .landing-btn-secondary:hover { background: rgba(255,255,255,0.15); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
  .landing-btn-outline { background: #fff; color: #0f172a; border: 1px solid #e2e8f0; }
  .landing-btn-outline:hover { border-color: #006AFF; box-shadow: 0 8px 24px rgba(0,106,255,0.1); }
  .landing-section { padding: 100px 24px; max-width: 1200px; margin: 0 auto; }
  @media (max-width: 768px) {
    .landing-section { padding: 60px 16px; }
    .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
    .hero-visual { display: none !important; }
    .feature-grid { grid-template-columns: 1fr !important; }
    .pricing-grid { grid-template-columns: 1fr !important; }
    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .footer-grid { grid-template-columns: 1fr !important; text-align: center; }
    .hero-buttons { justify-content: center; }
    .cta-buttons { flex-direction: column; align-items: center; }
  }
`

/* ── Scroll Animation Hook ───────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function FadeUp({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`, ...style }}>
      {children}
    </div>
  )
}

/* ── Icons ────────────────────────────────────────────── */
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const ArrowRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const StarIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>

/* ── Feature Data ────────────────────────────────────── */
const FEATURES = [
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006AFF" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    title: 'Smart Dashboard',
    desc: 'Real-time revenue, orders, and performance metrics at a glance. Everything you need to run your shop.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006AFF" strokeWidth="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
    title: 'Order Management',
    desc: 'Create, track, and fulfill orders with auto-generated IDs. From quote to delivery in one flow.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006AFF" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    title: 'Production Board',
    desc: 'Kanban-style board with 12 production stages. Drag cards from artwork to delivery.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006AFF" strokeWidth="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
    title: 'Online Store',
    desc: 'Your own branded e-commerce store. Customers browse, upload artwork, and order 24/7.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006AFF" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    title: 'Finance Suite',
    desc: 'Invoices, payments, wallet top-ups, and financial reports — all connected to your orders.',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006AFF" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    title: 'Team Management',
    desc: 'Invite team members with role-based permissions. Everyone sees only what they need.',
  },
]

const PLANS = [
  { name: 'Starter', price: 29, desc: 'For small print shops', features: ['1 team member', '100 orders/mo', 'Basic dashboard', 'Online store', 'Email support'] },
  { name: 'Pro', price: 79, desc: 'For growing businesses', features: ['5 team members', 'Unlimited orders', 'Advanced analytics', 'Custom domain', 'Priority support'], popular: true },
  { name: 'Business', price: 149, desc: 'For large operations', features: ['Unlimited members', 'Unlimited orders', 'Revenue reports', 'API access', 'Dedicated support'] },
]

const TESTIMONIALS = [
  { name: 'Ahmad R.', role: 'Owner, PrintHub KL', text: 'Onsprint transformed how we manage orders. The production board alone saved us hours every week.', avatar: 'AR' },
  { name: 'Siti N.', role: 'Manager, QuickPrint JB', text: 'Our customers love the online store. We get orders 24/7 now without any phone calls.', avatar: 'SN' },
  { name: 'Lee M.', role: 'Owner, DesignWorks PJ', text: 'The best print shop management tool in Malaysia. Simple, fast, and everything is connected.', avatar: 'LM' },
]

/* ── Page ─────────────────────────────────────────────── */
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const [mobileMenu, setMobileMenu] = useState(false)

  useEffect(() => {
    const handle = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <div className="landing" style={{ fontFamily: "'Fira Sans', 'Inter', system-ui, -apple-system, sans-serif", color: '#0f172a', background: '#fff', overflowX: 'hidden' }}>
      <style>{LANDING_CSS}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 50 ? 'rgba(255,255,255,0.85)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(16px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: '#006AFF', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="white"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.4"/></svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }}>Onsprint</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ display: 'flex', gap: 28, fontSize: 14, fontWeight: 500, color: '#64748b' }} className="nav-links">
              <a href="#features" style={{ transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = '#0f172a')} onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>Features</a>
              <a href="#pricing" style={{ transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = '#0f172a')} onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>Pricing</a>
              <a href="#testimonials" style={{ transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = '#0f172a')} onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>Testimonials</a>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link href="/login" style={{ padding: '8px 18px', fontSize: 13, fontWeight: 600, color: '#64748b', borderRadius: 8, transition: 'color 0.15s' }}>Log In</Link>
              <Link href="/register" className="landing-btn landing-btn-primary" style={{ padding: '8px 22px', fontSize: 13 }}>Get Started Free</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a1628 0%, #0f2044 30%, #132d5e 60%, #0a1628 100%)',
      }}>
        {/* Animated gradient orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,106,255,0.15) 0%, transparent 70%)', animation: 'float1 8s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', animation: 'float2 10s ease-in-out infinite', pointerEvents: 'none' }} />
        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div className="landing-section hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1, paddingTop: 120 }}>
          <div>
            <div style={{ animation: 'fadeUp 0.8s ease both' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,106,255,0.15)', border: '1px solid rgba(0,106,255,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#60a5fa', letterSpacing: '0.02em' }}>Now available in Malaysia</span>
              </div>
            </div>
            <h1 style={{ fontSize: 56, fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-1.5px', margin: '0 0 20px', animation: 'fadeUp 0.8s ease 0.1s both' }}>
              Run your print shop<br />
              <span style={{ background: 'linear-gradient(90deg, #006AFF, #60a5fa, #a78bfa)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', backgroundSize: '200% auto', animation: 'gradientShift 4s ease infinite' }}>
                like a pro.
              </span>
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: '0 0 36px', maxWidth: 480, animation: 'fadeUp 0.8s ease 0.2s both' }}>
              Orders, production, payments, and your own online store — all in one platform built for Malaysian print shops.
            </p>
            <div className="hero-buttons" style={{ display: 'flex', gap: 12, animation: 'fadeUp 0.8s ease 0.3s both' }}>
              <Link href="/register" className="landing-btn landing-btn-primary" style={{ fontSize: 16, padding: '16px 36px' }}>
                Start Free Trial <ArrowRight />
              </Link>
              <a href="#features" className="landing-btn landing-btn-secondary">
                See Features
              </a>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 40, animation: 'fadeUp 0.8s ease 0.4s both' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}><span style={{ fontWeight: 700, color: '#fff', fontSize: 18 }}>500+</span><br />Print shops</div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}><span style={{ fontWeight: 700, color: '#fff', fontSize: 18 }}>50K+</span><br />Orders processed</div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}><span style={{ fontWeight: 700, color: '#fff', fontSize: 18 }}>4.9</span><br /><span style={{ display: 'flex', gap: 2 }}><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></span></div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hero-visual" style={{ animation: 'scaleIn 0.8s ease 0.3s both' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', padding: 20, backdropFilter: 'blur(12px)' }}>
              {/* Mini dashboard mockup */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[{ label: 'Revenue', value: 'RM 48,250', color: '#4ade80' }, { label: 'Orders', value: '156', color: '#60a5fa' }, { label: 'Customers', value: '89', color: '#fbbf24' }].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              {/* Mini chart */}
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Revenue Trend</div>
                <svg width="100%" height="60" viewBox="0 0 300 60">
                  <polyline points="0,50 30,40 60,45 90,30 120,35 150,20 180,25 210,15 240,18 270,8 300,5" fill="none" stroke="#006AFF" strokeWidth="2" strokeLinecap="round" />
                  <polyline points="0,50 30,40 60,45 90,30 120,35 150,20 180,25 210,15 240,18 270,8 300,5" fill="url(#grad)" stroke="none" />
                  <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#006AFF" stopOpacity="0.3" /><stop offset="100%" stopColor="#006AFF" stopOpacity="0" /></linearGradient></defs>
                </svg>
              </div>
              {/* Mini order list */}
              {[{ id: 'ORD-0042', name: 'Ahmad R.', status: 'Printing', color: '#60a5fa' }, { id: 'ORD-0041', name: 'Siti N.', status: 'Ready', color: '#4ade80' }, { id: 'ORD-0040', name: 'Lee M.', status: 'Design', color: '#fbbf24' }].map(o => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{o.id}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{o.name}</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: o.color, background: o.color + '22', padding: '2px 8px', borderRadius: 10 }}>{o.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted By (Marquee) ── */}
      <section style={{ background: '#f8fafc', borderTop: '1px solid #f0f0f2', borderBottom: '1px solid #f0f0f2', padding: '32px 0', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
          Trusted by print shops across Malaysia
        </div>
        <div style={{ display: 'flex', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[...Array(2)].map((_, rep) => (
            <div key={rep} style={{ display: 'flex', gap: 60, paddingRight: 60 }}>
              {['PrintHub KL', 'QuickPrint JB', 'DesignWorks PJ', 'MegaPrint Penang', 'ArtPress Melaka', 'ProPrint Ipoh', 'Digital Works KK', 'CreativePrint Shah Alam'].map(name => (
                <div key={name + rep} style={{ fontSize: 16, fontWeight: 700, color: '#cbd5e1', whiteSpace: 'nowrap' }}>{name}</div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ background: '#fff' }}>
        <div className="landing-section">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#006AFF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Features</span>
              <h2 style={{ fontSize: 40, fontWeight: 900, margin: '12px 0 16px', letterSpacing: '-1px' }}>Everything you need to run your shop</h2>
              <p style={{ fontSize: 17, color: '#64748b', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                From order intake to delivery, Onsprint handles your entire workflow so you can focus on printing.
              </p>
            </div>
          </FadeUp>
          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.1}>
                <div style={{
                  padding: 28, borderRadius: 16, border: '1px solid #f0f0f2', background: '#fff',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s',
                  cursor: 'default',
                }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#006AFF' }}
                   onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f0f0f2' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.3px' }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: '#0f172a', color: '#fff' }}>
        <div className="landing-section">
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center' }}>
            {[{ value: '500+', label: 'Print Shops' }, { value: 'RM 2M+', label: 'Revenue Processed' }, { value: '50K+', label: 'Orders Managed' }, { value: '99.9%', label: 'Uptime' }].map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.1}>
                <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-1px', background: 'linear-gradient(135deg, #fff, #60a5fa)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>{s.value}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{s.label}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" style={{ background: '#f8fafc' }}>
        <div className="landing-section">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#006AFF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Testimonials</span>
              <h2 style={{ fontSize: 36, fontWeight: 900, margin: '12px 0', letterSpacing: '-0.5px' }}>Loved by print shops</h2>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="feature-grid">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div style={{ padding: 28, borderRadius: 16, background: '#fff', border: '1px solid #f0f0f2' }}>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, margin: '0 0 20px' }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#006AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ background: '#fff' }}>
        <div className="landing-section">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#006AFF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pricing</span>
              <h2 style={{ fontSize: 36, fontWeight: 900, margin: '12px 0', letterSpacing: '-0.5px' }}>Simple, transparent pricing</h2>
              <p style={{ fontSize: 16, color: '#64748b' }}>No hidden fees. Cancel anytime.</p>
            </div>
          </FadeUp>
          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 960, margin: '0 auto' }}>
            {PLANS.map((p, i) => (
              <FadeUp key={p.name} delay={i * 0.1}>
                <div style={{
                  padding: 32, borderRadius: 20,
                  background: p.popular ? 'linear-gradient(135deg, #0f172a, #1e293b)' : '#fff',
                  color: p.popular ? '#fff' : '#0f172a',
                  border: p.popular ? 'none' : '1px solid #e2e8f0',
                  position: 'relative', overflow: 'hidden',
                  transform: p.popular ? 'scale(1.05)' : 'none',
                  boxShadow: p.popular ? '0 24px 48px rgba(0,0,0,0.15)' : 'none',
                }}>
                  {p.popular && (
                    <div style={{ position: 'absolute', top: 16, right: -28, background: '#006AFF', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 32px', transform: 'rotate(45deg)', letterSpacing: '0.05em' }}>POPULAR</div>
                  )}
                  <div style={{ fontSize: 13, fontWeight: 600, color: p.popular ? '#60a5fa' : '#006AFF', marginBottom: 4 }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                    <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-1px' }}>RM {p.price}</span>
                    <span style={{ fontSize: 14, color: p.popular ? 'rgba(255,255,255,0.5)' : '#94a3b8' }}>/mo</span>
                  </div>
                  <p style={{ fontSize: 13, color: p.popular ? 'rgba(255,255,255,0.5)' : '#94a3b8', margin: '0 0 24px' }}>{p.desc}</p>
                  <Link href="/register" className={`landing-btn ${p.popular ? 'landing-btn-primary' : 'landing-btn-outline'}`} style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14 }}>
                    Get Started
                  </Link>
                  <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {p.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: p.popular ? 'rgba(255,255,255,0.7)' : '#475569' }}>
                        <CheckIcon /> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: 'linear-gradient(135deg, #006AFF 0%, #0055d4 50%, #3b82f6 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="landing-section" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: '#fff', margin: '0 0 16px', letterSpacing: '-0.5px' }}>
              Ready to modernize your print shop?
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Join hundreds of print shops already using Onsprint. Start free, no credit card required.
            </p>
            <div className="cta-buttons" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link href="/register" className="landing-btn" style={{ background: '#fff', color: '#006AFF', fontSize: 16, padding: '16px 40px' }}>
                Start Free Trial <ArrowRight />
              </Link>
              <Link href="/login" className="landing-btn landing-btn-secondary" style={{ fontSize: 16, padding: '16px 32px' }}>
                Log In
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,0.6)', padding: '64px 24px 32px' }}>
        <div className="footer-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 30, height: 30, background: '#006AFF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="white"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.4"/></svg>
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Onsprint</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>
              The all-in-one platform for print shop management. Built in Malaysia, for Malaysia.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Product</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <Link href="/register">Get Started</Link>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Company</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Legal</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span>Copyright &copy; 2026 Onsprint. All rights reserved.</span>
          <span>Made in Malaysia</span>
        </div>
      </footer>
    </div>
  )
}
