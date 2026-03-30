'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

/* ── Animations ──────────────────────────────────────── */
const CSS = `
  @keyframes fadeUp { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) } }
  @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px) rotate(-1deg)} }
  @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
  .lp * { box-sizing:border-box; margin:0; padding:0 }
  .lp a { text-decoration:none; color:inherit }
  .lp button { cursor:pointer; border:none; background:none; font-family:inherit; font-size:inherit }
  .lp img { max-width:100%; display:block }
  .lp-section { max-width:1140px; margin:0 auto; padding:100px 24px }
  .lp-btn { display:inline-flex; align-items:center; gap:8px; font-weight:600; border-radius:10px; transition:transform .2s,box-shadow .2s,background .2s }
  .lp-btn:hover { transform:translateY(-2px) }
  .lp-btn-p { background:#006AFF; color:#fff; padding:13px 30px; font-size:14px }
  .lp-btn-p:hover { box-shadow:0 8px 24px rgba(0,106,255,.25) }
  .lp-btn-s { background:rgba(255,255,255,.08); color:#fff; border:1px solid rgba(255,255,255,.15); padding:13px 28px; font-size:14px; backdrop-filter:blur(6px) }
  .lp-btn-s:hover { background:rgba(255,255,255,.14) }
  .lp-btn-o { background:#fff; color:#0f172a; border:1.5px solid #e2e8f0; padding:13px 28px; font-size:14px }
  .lp-btn-o:hover { border-color:#006AFF; box-shadow:0 6px 20px rgba(0,106,255,.08) }
  .lp-tag { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; padding:5px 14px; border-radius:100px }
  .fade-section { opacity:0; transform:translateY(28px); transition:opacity .7s ease,transform .7s ease }
  .fade-section.vis { opacity:1; transform:translateY(0) }
  @media(max-width:820px){
    .hero-g{grid-template-columns:1fr!important;text-align:center}
    .hero-v{display:none!important}
    .hero-btns{justify-content:center}
    .feat-g,.price-g,.testi-g,.stories-g,.footer-g{grid-template-columns:1fr!important}
    .num-g{grid-template-columns:1fr!important}
    .stats-g{grid-template-columns:repeat(2,1fr)!important}
    .cta-btns{flex-direction:column;align-items:center}
    .lp-section{padding:64px 16px}
    .faq-cols{grid-template-columns:1fr!important}
  }
`

/* ── Scroll reveal hook ──────────────────────────────── */
function useFade(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect() } }, { threshold })
    o.observe(el); return () => o.disconnect()
  }, [threshold])
  return { ref, cls: vis ? 'fade-section vis' : 'fade-section' }
}
function Fade({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, cls } = useFade()
  return <div ref={ref} className={cls} style={{ transitionDelay: `${delay}s`, ...style }}>{children}</div>
}

/* ── Icons ────────────────────────────────────────────── */
const Arrow = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const Check = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#006AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const Star = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const ChevDown = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>

/* ── Data ─────────────────────────────────────────────── */
const NUM_FEATURES = [
  { num: '01', title: 'Easy setup', desc: 'Get started in minutes. Import your products, invite your team, and start managing orders right away.' },
  { num: '02', title: 'Collaborate', desc: 'Assign jobs, track progress, and keep everyone aligned with real-time production updates.' },
  { num: '03', title: 'Track growth', desc: 'Revenue reports, order analytics, and customer insights to help you scale your business.' },
]

const PERF_FEATURES = [
  { title: 'Production Pipeline', desc: 'Kanban-style board with 12 stages. Drag orders from artwork checking to delivery.' },
  { title: 'Automated Invoicing', desc: 'Auto-generate invoices, track payments, and manage customer wallets in one place.' },
  { title: 'Online Storefront', desc: 'Your own branded store where customers browse products, upload artwork, and order 24/7.' },
  { title: 'Team Permissions', desc: 'Role-based access control. Each team member sees only what they need to do their job.' },
]

const INTEGRATIONS = ['Stripe', 'Billplz', 'Google', 'WhatsApp', 'Supabase', 'Cloudflare']

const PLANS = [
  { name: 'Starter', price: 29, desc: 'For small print shops just getting started', features: ['1 team member', '100 orders/mo', 'Online store', 'Basic dashboard', 'Email support'] },
  { name: 'Growth', price: 79, desc: 'For growing businesses ready to scale', features: ['5 team members', 'Unlimited orders', 'Advanced analytics', 'Custom domain', 'Priority support'], popular: true },
  { name: 'Scale', price: 149, desc: 'For large operations and enterprises', features: ['Unlimited members', 'Unlimited orders', 'Revenue reports', 'API access', 'Dedicated support'] },
]

const STORIES = [
  { title: 'Helped PrintHub KL scale their production team', year: '2025', desc: 'Reduced order processing time by 60% with automated workflows.' },
  { title: 'QuickPrint JB grew online revenue by 3x', year: '2025', desc: 'Launched an online store that now handles 40% of all orders.' },
  { title: 'DesignWorks PJ streamlined their billing', year: '2024', desc: 'Eliminated manual invoicing and cut payment delays by 80%.' },
  { title: 'MegaPrint Penang unified their 3 branches', year: '2024', desc: 'One dashboard for all locations with real-time production tracking.' },
]

const TESTIMONIALS = [
  { name: 'Ahmad Razali', role: 'Owner, PrintHub KL', text: 'Onsprint transformed how we manage orders. The production board alone saved us hours every week. I can finally focus on growing the business.' },
  { name: 'Siti Nurhaliza', role: 'Manager, QuickPrint JB', text: 'Our customers love the online store. We get orders at 2am now. Revenue is up 3x since we started using Onsprint.' },
  { name: 'Lee Min Wei', role: 'Owner, DesignWorks PJ', text: 'The best print shop management tool in Malaysia. Simple, fast, and everything is connected. No more spreadsheets.' },
]

const FAQS = [
  { q: 'How long does it take to set up?', a: 'Most shops are fully set up within 30 minutes. Import your products, invite your team, and you\'re ready to go. Our onboarding checklist guides you through every step.' },
  { q: 'Can I migrate from my current system?', a: 'Yes. We can help you import existing customer data, products, and orders. Contact our support team and we\'ll walk you through the migration process.' },
  { q: 'Is there a free trial?', a: 'Yes! Every plan comes with a 14-day free trial. No credit card required. You can explore all features before committing.' },
  { q: 'What payment methods do you support?', a: 'We support FPX (online banking), credit/debit cards via Stripe, and Billplz for Malaysian bank transfers. Your customers can pay however they prefer.' },
  { q: 'Can I customize my online store?', a: 'Absolutely. You can set your own branding, colors, logo, domain, and choose which products to display. The store editor gives you full control.' },
]

/* ── FAQ Accordion ───────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #e2e8f0' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
        {q}
        <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s ease', color: '#94a3b8', flexShrink: 0, marginLeft: 16 }}><ChevDown /></span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height .3s ease' }}>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, paddingBottom: 20 }}>{a}</p>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <div className="lp" style={{ fontFamily: "'Fira Sans', system-ui, -apple-system, sans-serif", color: '#0f172a', background: '#fff', overflowX: 'hidden' }}>
      <style>{CSS}</style>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,.05)' : '1px solid transparent',
        transition: 'all .35s ease',
      }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#006AFF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="white"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity=".7"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity=".7"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity=".4"/></svg>
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-.4px', color: scrolled ? '#0f172a' : '#fff' }}>Onsprint</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 13.5, fontWeight: 500 }}>
            {['Features', 'Pricing', 'Case Studies', 'FAQ'].map(t => (
              <a key={t} href={`#${t.toLowerCase().replace(' ', '-')}`} style={{ color: scrolled ? '#64748b' : 'rgba(255,255,255,.65)', transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = scrolled ? '#0f172a' : '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = scrolled ? '#64748b' : 'rgba(255,255,255,.65)')}>{t}</a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link href="/login" style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, color: scrolled ? '#64748b' : 'rgba(255,255,255,.7)', borderRadius: 8 }}>Log In</Link>
            <Link href="/register" className="lp-btn lp-btn-p" style={{ padding: '9px 20px', fontSize: 13 }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(160deg, #0a1525 0%, #0d1f3c 40%, #11285a 70%, #0a1525 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '8%', left: '12%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,106,255,.12) 0%, transparent 70%)', animation: 'float1 9s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '8%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,.08) 0%, transparent 70%)', animation: 'float2 11s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)', backgroundSize: '56px 56px', pointerEvents: 'none' }} />

        <div className="lp-section hero-g" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 56, alignItems: 'center', paddingTop: 110, position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ animation: 'fadeUp .7s ease both' }}>
              <span className="lp-tag" style={{ background: 'rgba(0,106,255,.12)', border: '1px solid rgba(0,106,255,.25)', color: '#60a5fa', marginBottom: 24, display: 'inline-flex' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
                Now available in Malaysia
              </span>
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 900, color: '#fff', lineHeight: 1.08, letterSpacing: '-1.5px', marginBottom: 20, animation: 'fadeUp .7s ease .08s both' }}>
              The modern way to<br />manage your print shop
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.55)', lineHeight: 1.75, maxWidth: 460, marginBottom: 36, animation: 'fadeUp .7s ease .16s both' }}>
              Orders, production, payments, and your own online store — all in one platform built for Malaysian print shops.
            </p>
            <div className="hero-btns" style={{ display: 'flex', gap: 10, animation: 'fadeUp .7s ease .24s both' }}>
              <Link href="/register" className="lp-btn lp-btn-p" style={{ padding: '14px 32px', fontSize: 15 }}>Start free trial <Arrow /></Link>
              <a href="#features" className="lp-btn lp-btn-s">See how it works</a>
            </div>
            {/* Rating badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 40, animation: 'fadeUp .7s ease .32s both' }}>
              <div style={{ display: 'flex', gap: 2 }}><Star /><Star /><Star /><Star /><Star /></div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>4.9 / 5 Rated · <strong style={{ color: 'rgba(255,255,255,.7)' }}>Over 500 shops</strong></span>
            </div>
          </div>
          {/* Dashboard mockup */}
          <div className="hero-v" style={{ animation: 'fadeUp .8s ease .2s both' }}>
            <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 18, border: '1px solid rgba(255,255,255,.08)', padding: 18, backdropFilter: 'blur(10px)', animation: 'float1 7s ease-in-out infinite' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[{ l: 'Revenue', v: 'RM 48,250', c: '#4ade80' }, { l: 'Orders', v: '156', c: '#60a5fa' }, { l: 'Customers', v: '89', c: '#fbbf24' }].map(s => (
                  <div key={s.l} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 10, padding: '11px 13px' }}>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,.35)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>{s.l}</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: 10, padding: '11px 13px', marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.35)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>Revenue Trend</div>
                <svg width="100%" height="50" viewBox="0 0 300 50" preserveAspectRatio="none">
                  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#006AFF" stopOpacity=".25"/><stop offset="100%" stopColor="#006AFF" stopOpacity="0"/></linearGradient></defs>
                  <path d="M0,42 Q30,38 60,36 T120,28 T180,22 T240,14 T300,6" fill="none" stroke="#006AFF" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M0,42 Q30,38 60,36 T120,28 T180,22 T240,14 T300,6 L300,50 L0,50Z" fill="url(#g)"/>
                </svg>
              </div>
              {[{ id: 'ORD-0042', n: 'Ahmad R.', s: 'Printing', c: '#60a5fa' }, { id: 'ORD-0041', n: 'Siti N.', s: 'Ready', c: '#4ade80' }, { id: 'ORD-0040', n: 'Lee M.', s: 'Design', c: '#fbbf24' }].map((o, i) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderTop: i === 0 ? '1px solid rgba(255,255,255,.05)' : 'none', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,.85)' }}>{o.id}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>{o.n}</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: o.c, background: o.c + '1a', padding: '2px 8px', borderRadius: 8 }}>{o.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ NUMBERED FEATURES (01 02 03) ══ */}
      <section id="features" style={{ background: '#fff', borderBottom: '1px solid #f0f0f2' }}>
        <div className="lp-section">
          <div className="num-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
            {NUM_FEATURES.map((f, i) => (
              <Fade key={f.num} delay={i * .1}>
                <div>
                  <div style={{ fontSize: 48, fontWeight: 900, color: '#f0f0f2', letterSpacing: '-2px', lineHeight: 1, marginBottom: 14 }}>{f.num}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, letterSpacing: '-.3px' }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BUILT FOR HIGH PERFORMANCE ══ */}
      <section style={{ background: '#fafbfc' }}>
        <div className="lp-section">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="feat-g">
            <Fade>
              <div>
                <span className="lp-tag" style={{ background: '#eff6ff', color: '#006AFF', marginBottom: 20 }}>Performance</span>
                <h2 style={{ fontSize: 36, fontWeight: 900, lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 16 }}>Built for high performance</h2>
                <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, marginBottom: 32 }}>
                  Onsprint gives your team everything it needs to stay aligned, track performance, and scale with confidence — all in one place.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {PERF_FEATURES.map(f => (
                    <div key={f.title} style={{ display: 'flex', gap: 12 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}><Check /></div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{f.title}</div>
                        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Fade>
            <Fade delay={.15}>
              <div style={{ background: '#0f172a', borderRadius: 18, padding: 24, color: '#fff' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16 }}>Centralized access for teams</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[{ l: 'Active Jobs', v: '34', c: '#60a5fa' }, { l: 'Completed', v: '128', c: '#4ade80' }, { l: 'Revenue', v: 'RM 48K', c: '#fbbf24' }, { l: 'Team', v: '8', c: '#a78bfa' }].map(s => (
                    <div key={s.l} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', marginBottom: 3 }}>{s.l}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* ══ INTEGRATIONS ══ */}
      <section style={{ background: '#fff', borderTop: '1px solid #f0f0f2', borderBottom: '1px solid #f0f0f2' }}>
        <div className="lp-section" style={{ textAlign: 'center' }}>
          <Fade>
            <span className="lp-tag" style={{ background: '#eff6ff', color: '#006AFF', marginBottom: 20 }}>Integrations</span>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-.8px', marginBottom: 10 }}>Powerful integrations</h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
              Seamlessly integrate with your favorite tools to streamline workflows and keep everything in sync.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>
              {INTEGRATIONS.map(name => (
                <div key={name} style={{ width: 100, height: 56, background: '#f8fafc', border: '1px solid #f0f0f2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#64748b', transition: 'border-color .2s, transform .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#006AFF'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f2'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  {name}
                </div>
              ))}
            </div>
            <Link href="/register" className="lp-btn lp-btn-p">Get started <Arrow /></Link>
          </Fade>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="pricing" style={{ background: '#fafbfc' }}>
        <div className="lp-section">
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <span className="lp-tag" style={{ background: '#eff6ff', color: '#006AFF', marginBottom: 20 }}>Pricing</span>
              <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px', marginBottom: 10 }}>Flexible pricing</h2>
              <p style={{ fontSize: 15, color: '#64748b' }}>Simple, transparent pricing with no hidden fees.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                <div style={{ display: 'flex', gap: 2 }}><Star /><Star /><Star /><Star /><Star /></div>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>4.9 / 5 Rated · Over 500 shops</span>
              </div>
            </div>
          </Fade>
          <div className="price-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 940, margin: '0 auto' }}>
            {PLANS.map((p, i) => (
              <Fade key={p.name} delay={i * .08}>
                <div style={{
                  padding: 32, borderRadius: 18,
                  background: p.popular ? '#0f172a' : '#fff',
                  color: p.popular ? '#fff' : '#0f172a',
                  border: p.popular ? 'none' : '1px solid #e2e8f0',
                  boxShadow: p.popular ? '0 20px 48px rgba(0,0,0,.12)' : 'none',
                  position: 'relative', overflow: 'hidden',
                  transform: p.popular ? 'scale(1.04)' : 'none',
                }}>
                  {p.popular && <div style={{ position: 'absolute', top: 14, right: -30, background: '#006AFF', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 32px', transform: 'rotate(45deg)', letterSpacing: '.04em' }}>POPULAR</div>}
                  <div style={{ fontSize: 12, fontWeight: 700, color: p.popular ? '#60a5fa' : '#006AFF', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 4 }}>
                    <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-1px' }}>RM {p.price}</span>
                    <span style={{ fontSize: 13, color: p.popular ? 'rgba(255,255,255,.45)' : '#94a3b8' }}>/mo</span>
                  </div>
                  <p style={{ fontSize: 13, color: p.popular ? 'rgba(255,255,255,.45)' : '#94a3b8', marginBottom: 24, lineHeight: 1.5 }}>{p.desc}</p>
                  <Link href="/register" className={`lp-btn ${p.popular ? 'lp-btn-p' : 'lp-btn-o'}`} style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 13.5, marginBottom: 24 }}>
                    Schedule a demo
                  </Link>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {p.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: p.popular ? 'rgba(255,255,255,.65)' : '#475569' }}>
                        <Check /> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SUCCESS STORIES ══ */}
      <section id="case-studies" style={{ background: '#fff' }}>
        <div className="lp-section">
          <Fade>
            <div style={{ marginBottom: 48 }}>
              <span className="lp-tag" style={{ background: '#eff6ff', color: '#006AFF', marginBottom: 20 }}>Case Studies</span>
              <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px', marginBottom: 10 }}>Success stories</h2>
              <p style={{ fontSize: 15, color: '#64748b', maxWidth: 560, lineHeight: 1.7 }}>
                Onsprint has partnered with growing businesses to build foundations for sustainable success. Explore real stories of transformation.
              </p>
            </div>
          </Fade>
          <div className="stories-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {STORIES.map((s, i) => (
              <Fade key={s.title} delay={i * .08}>
                <div style={{
                  padding: 28, borderRadius: 16, border: '1px solid #f0f0f2', background: '#fff',
                  transition: 'border-color .2s, transform .2s, box-shadow .2s', cursor: 'default',
                }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#006AFF'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,.06)' }}
                   onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f2'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>{s.year}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, letterSpacing: '-.2px', lineHeight: 1.35 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, marginBottom: 14 }}>{s.desc}</p>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#006AFF', display: 'inline-flex', alignItems: 'center', gap: 4 }}>Read more <Arrow /></span>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ background: '#fafbfc' }}>
        <div className="lp-section">
          <div className="testi-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <Fade key={t.name} delay={i * .08}>
                <div style={{ padding: 28, borderRadius: 16, background: '#fff', border: '1px solid #f0f0f2' }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}><Star /><Star /><Star /><Star /><Star /></div>
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid #f0f0f2', paddingTop: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#006AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>
                      {t.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section id="faq" style={{ background: '#fff' }}>
        <div className="lp-section">
          <div className="faq-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }}>
            <Fade>
              <div>
                <span className="lp-tag" style={{ background: '#eff6ff', color: '#006AFF', marginBottom: 20 }}>FAQ</span>
                <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-.8px', marginBottom: 12 }}>Your questions, answered</h2>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 24 }}>
                  Get quick answers to the most common questions about our platform and services.
                </p>
                <Link href="/register" className="lp-btn lp-btn-p" style={{ fontSize: 13 }}>Contact us <Arrow /></Link>
              </div>
            </Fade>
            <Fade delay={.1}>
              <div style={{ borderTop: '1px solid #e2e8f0' }}>
                {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ background: '#0f172a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,106,255,.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="lp-section" style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '80px 24px' }}>
          <Fade>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: '#fff', marginBottom: 14, letterSpacing: '-1px' }}>Start your journey</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.5)', maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.7 }}>
              Let&apos;s start building something great together.
            </p>
            <div className="cta-btns" style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Link href="/register" className="lp-btn lp-btn-p" style={{ padding: '14px 36px', fontSize: 15 }}>Get started free <Arrow /></Link>
              <Link href="/login" className="lp-btn lp-btn-s" style={{ padding: '14px 28px', fontSize: 15 }}>Log in</Link>
            </div>
          </Fade>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#080e1a', color: 'rgba(255,255,255,.5)', padding: '56px 24px 28px' }}>
        <div className="footer-g" style={{ maxWidth: 1140, margin: '0 auto', display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, background: '#006AFF', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="white"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity=".7"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity=".7"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity=".4"/></svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>Onsprint</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>The all-in-one platform for print shop management. Built in Malaysia, for Malaysia.</p>
          </div>
          {[
            { label: 'Product', links: [['Features', '#features'], ['Pricing', '#pricing'], ['Case Studies', '#case-studies'], ['Get Started', '/register']] },
            { label: 'Company', links: [['About', '#'], ['Blog', '#'], ['Contact', '#'], ['Careers', '#']] },
            { label: 'Legal', links: [['Privacy Policy', '#'], ['Terms of Service', '#'], ['Cookie Policy', '#']] },
          ].map(col => (
            <div key={col.label}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>{col.label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                {col.links.map(([text, href]) => (
                  <a key={text} href={href} style={{ transition: 'color .15s' }} onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.5)')}>{text}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1140, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,.3)' }}>
          <span>Copyright &copy; 2026 Onsprint. All rights reserved.</span>
          <span>Made with care in Malaysia</span>
        </div>
      </footer>
    </div>
  )
}
