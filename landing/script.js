// ── Navbar scroll effect ──
const nav = document.getElementById('nav')
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled')
  } else {
    nav.classList.remove('scrolled')
  }
}, { passive: true })

// ── Mobile menu toggle ──
const hamburger = document.getElementById('hamburger')
const mobileMenu = document.getElementById('mobile-menu')

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open')
  // Animate hamburger lines
  const spans = hamburger.querySelectorAll('span')
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)'
    spans[1].style.opacity = '0'
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)'
  } else {
    spans[0].style.transform = 'none'
    spans[1].style.opacity = '1'
    spans[2].style.transform = 'none'
  }
})

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open')
    const spans = hamburger.querySelectorAll('span')
    spans[0].style.transform = 'none'
    spans[1].style.opacity = '1'
    spans[2].style.transform = 'none'
  })
})

// ── Scroll reveal animations ──
const reveals = document.querySelectorAll('.reveal')

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const parent = entry.target.parentElement
      const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : []
      const siblingIndex = siblings.indexOf(entry.target)

      setTimeout(() => {
        entry.target.classList.add('visible')
      }, siblingIndex * 80)

      observer.unobserve(entry.target)
    }
  })
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
})

reveals.forEach(el => observer.observe(el))

// ── FAQ accordion ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement
    const isOpen = item.classList.contains('open')

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'))

    // Open clicked (if it wasn't open)
    if (!isOpen) {
      item.classList.add('open')
    }
  })
})

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href')
    if (href === '#') return

    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      const navHeight = 68
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }
  })
})
