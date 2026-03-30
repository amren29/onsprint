// ── Scroll reveal (supports .reveal, .reveal-left, .reveal-right, .reveal-scale) ──
const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale']
const allReveals = document.querySelectorAll(revealClasses.join(','))
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const parent = entry.target.parentElement
      const selector = revealClasses.join(',')
      const siblings = parent ? Array.from(parent.querySelectorAll(':scope > ' + revealClasses.map(c => c).join(', :scope > '))) : []
      const idx = siblings.indexOf(entry.target)
      setTimeout(() => entry.target.classList.add('visible'), idx * 100)
      observer.unobserve(entry.target)
    }
  })
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
allReveals.forEach(el => observer.observe(el))

// ── FAQ accordion ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement
    const isOpen = item.classList.contains('open')
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'))
    if (!isOpen) item.classList.add('open')
  })
})

// ── Performance tabs ──
document.querySelectorAll('.perf-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.perf-tab').forEach(t => t.classList.remove('active'))
    tab.classList.add('active')
    // Switch panel
    const key = tab.dataset.tab
    document.querySelectorAll('.perf-panel').forEach(p => p.classList.remove('active'))
    const panel = document.querySelector(`.perf-panel[data-panel="${key}"]`)
    if (panel) panel.classList.add('active')
  })
})

// ── Pricing plan selector ──
const plans = {
  starter: { name: 'Starter', price: 'RM 29', desc: 'Ideal for small print shops who need core features to move forward.', features: ['Access to core features', 'Basic performance reporting', 'Email support', 'Online store included', 'Production board'] },
  growth: { name: 'Growth', price: 'RM 79', desc: 'For growing businesses that need advanced analytics and team collaboration.', features: ['Everything in Starter', 'Advanced analytics', 'Custom domain', '5 team members', 'Priority support'] },
  scale: { name: 'Scale', price: 'RM 149', desc: 'For large operations with enterprise-level needs and dedicated support.', features: ['Everything in Growth', 'Unlimited team members', 'Revenue reports', 'API access', 'Dedicated support'] },
}

document.querySelectorAll('.pricing-plan').forEach(plan => {
  plan.addEventListener('click', () => {
    document.querySelectorAll('.pricing-plan').forEach(p => p.classList.remove('active'))
    plan.classList.add('active')

    const key = plan.dataset.plan
    const data = plans[key]
    const card = document.getElementById('pricing-card')
    if (data && card) {
      card.querySelector('.pricing-card-name').textContent = data.name
      card.querySelector('.pricing-card-price').innerHTML = data.price + ' <span>/ mo</span>'
      card.querySelector('.pricing-card-desc').textContent = data.desc
      const ul = card.querySelector('.pricing-card-features')
      ul.innerHTML = data.features.map(f => `<li>✓ ${f}</li>`).join('')
    }
  })
})

// ── Billing toggle ──
let isAnnual = false
function toggleBilling() {
  isAnnual = !isAnnual
  const sw = document.getElementById('billing-switch')
  const mLabel = document.getElementById('billing-monthly-label')
  const aLabel = document.getElementById('billing-annual-label')

  if (isAnnual) {
    sw.classList.add('annual')
    mLabel.classList.remove('active')
    aLabel.classList.add('active')
  } else {
    sw.classList.remove('annual')
    mLabel.classList.add('active')
    aLabel.classList.remove('active')
  }

  document.querySelectorAll('.price-card-amount[data-monthly]').forEach(el => {
    const price = isAnnual ? el.dataset.annual : el.dataset.monthly
    const sub = isAnnual ? el.dataset.annualSub : el.dataset.monthlySub
    const yearlyTotal = el.dataset.annualTotal || ''
    if (isAnnual && yearlyTotal) {
      el.innerHTML = yearlyTotal + ' <span>/ yr</span>'
      // Add per-month below as sibling
      let perMonth = el.parentElement.querySelector('.price-per-month')
      if (!perMonth) {
        perMonth = document.createElement('div')
        perMonth.className = 'price-per-month'
        el.insertAdjacentElement('afterend', perMonth)
      }
      perMonth.textContent = price + '/mo'
      perMonth.style.display = ''
    } else {
      el.innerHTML = price + ' <span>' + sub + '</span>'
      const perMonth = el.parentElement.querySelector('.price-per-month')
      if (perMonth) perMonth.style.display = 'none'
    }
  })
}
// Set initial state
document.getElementById('billing-monthly-label')?.classList.add('active')

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href')
    if (href === '#') return
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  })
})

// ── Parallax on hero cards (subtle mouse follow) ──
const heroVisual = document.querySelector('.hero-visual')
if (heroVisual) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12
    const y = (e.clientY / window.innerHeight - 0.5) * 8
    const main = heroVisual.querySelector('.hero-card-main')
    const stats = heroVisual.querySelector('.hero-card-stats')
    if (main) main.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`
    if (stats) stats.style.transform = `translate(${-x * 0.8}px, ${-y * 0.8}px)`
  })
}

// ── Navbar shadow on scroll ──
const navPill = document.querySelector('.nav-pill')
if (navPill) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navPill.style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)'
    } else {
      navPill.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'
    }
  }, { passive: true })
}

// ── Counter animation for stats ──
document.querySelectorAll('.stats-number').forEach(el => {
  const target = el.textContent
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      // Simple typewriter effect
      el.style.opacity = '0'
      setTimeout(() => {
        el.style.transition = 'opacity 0.5s ease'
        el.style.opacity = '1'
      }, 100)
      obs.disconnect()
    }
  }, { threshold: 0.5 })
  obs.observe(el)
})
