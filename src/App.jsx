import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Scissors, Clock, MapPin, Phone, Mail, Star, ChevronDown,
  ArrowRight, Calendar, User, Check, X, ChevronLeft, ChevronRight,
  Globe, Menu,
} from 'lucide-react'
import { LangProvider, useLang } from './i18n/index.jsx'
import { useCalendar } from './hooks/useCalendar'

gsap.registerPlugin(ScrollTrigger)

// ─── Hero image (Unsplash – classic barbershop) ─────────────────────────────
const HERO_IMG = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80'
const BARBER_IMG = 'https://images.unsplash.com/photo-1521490683712-35a1cb235d1c?auto=format&fit=crop&w=800&q=80'
const MAPS_URL = 'https://maps.app.goo.gl/Fbg5HwMb2peHSMv19'
const MAPS_EMBED = 'https://maps.google.com/maps?q=37.971011,23.7019171&z=16&output=embed'

// ─── Scissors particles ──────────────────────────────────────────────────────
function ScissorsParticles() {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: 10 + i * 11,
    delay: i * 0.6,
    duration: 3 + (i % 3) * 0.8,
    size: 14 + (i % 3) * 6,
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="scissors-particle text-gold opacity-20"
          style={{
            left: `${p.left}%`,
            top: '-10%',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <Scissors size={p.size} />
        </div>
      ))}
    </div>
  )
}

// ─── Barber pole decoration ──────────────────────────────────────────────────
function BarberPole({ className = '' }) {
  return (
    <div className={`w-4 rounded-full overflow-hidden ${className}`} style={{ height: '80px' }}>
      <div className="barber-pole w-full h-full" />
    </div>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Navbar({ onBook }) {
  const { t, lang, setLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = id => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'py-5'}`}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <BarberPole className="h-8 w-3" style={{ height: '32px' }} />
            <span className="font-display font-bold text-lg text-cream tracking-wide">
              Barbershop
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {[['services','services'],['about','barber'],['hours','hours'],['location','location']].map(([key, id]) => (
              <button key={key} onClick={() => scrollTo(id)}
                className="text-muted hover:text-cream text-sm font-body transition-colors duration-200 tracking-wide">
                {t.nav[key]}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === 'el' ? 'en' : 'el')}
              className="flex items-center gap-1.5 text-muted hover:text-gold text-xs font-mono tracking-widest transition-colors">
              <Globe size={13} />
              {lang === 'el' ? 'EN' : 'ΕΛ'}
            </button>
            <button onClick={onBook}
              className="hidden md:block btn-gold text-xs px-5 py-2.5">
              {t.nav.book}
            </button>
            <button onClick={() => setMenuOpen(o => !o)} className="md:hidden text-cream p-1">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 bg-charcoal transition-transform duration-300 flex flex-col justify-center items-center gap-8
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {[['services','services'],['about','barber'],['hours','hours'],['location','location']].map(([key, id]) => (
          <button key={key} onClick={() => scrollTo(id)}
            className="text-cream text-2xl font-display font-semibold tracking-wide">
            {t.nav[key]}
          </button>
        ))}
        <button onClick={() => { setMenuOpen(false); onBook() }} className="btn-gold mt-4 px-8 py-4 text-sm">
          {t.nav.book}
        </button>
      </div>
    </>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onBook }) {
  const { t } = useLang()
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-label', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.3 })
      gsap.fromTo('.hero-h1', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.5, stagger: 0.15 })
      gsap.fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.9 })
      gsap.fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 1.1 })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="Barbershop" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/60 to-charcoal" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 to-transparent" />
      </div>

      {/* Scissors particles */}
      <ScissorsParticles />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="hero-label section-label mb-6 opacity-0">{t.hero.label}</p>

        <h1 className="hero-h1 font-display font-bold leading-none mb-3 opacity-0"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
          <span className="text-cream">{t.hero.headline1}</span>
        </h1>
        <h1 className="hero-h1 font-display font-bold italic leading-none mb-8 opacity-0"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
          <span className="text-shimmer">{t.hero.headline2}</span>
        </h1>

        <p className="hero-sub font-body text-muted text-lg mb-10 opacity-0 max-w-md mx-auto">
          {t.hero.sub}
        </p>

        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
          <button onClick={onBook} className="btn-gold px-8 py-4 text-sm w-full sm:w-auto">
            <Calendar size={16} />
            {t.hero.cta}
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted animate-bounce">
        <ChevronDown size={18} />
      </div>
    </section>
  )
}

// ─── Services ────────────────────────────────────────────────────────────────
const SERVICE_ICONS = [Scissors, User, Star, ArrowRight, Star, Scissors, Star]

function Services({ onBook }) {
  const { t } = useLang()
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.service-card', { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={ref} className="py-24 px-4 bg-charcoal">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label mb-4">{t.services.label}</p>
          <div className="divider-gold mb-6" />
          <h2 className="font-display font-bold text-cream mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            {t.services.title}
          </h2>
          <p className="text-muted font-body max-w-md mx-auto">{t.services.sub}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
          {t.services.items.map((svc, i) => {
            const Icon = SERVICE_ICONS[i] || Scissors
            return (
              <div key={i} className="service-card opacity-0 bg-surface p-8 group relative overflow-hidden
                hover:bg-surface-2 transition-all duration-300 cursor-pointer"
                onClick={() => onBook(svc)}>
                {/* Gold accent line */}
                <div className="absolute top-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-500" />

                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center
                    group-hover:bg-gold/20 transition-colors">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <span className="font-display font-bold text-gold text-2xl">{svc.price}€</span>
                </div>

                <h3 className="font-display font-semibold text-cream text-lg mb-2 group-hover:text-gold transition-colors">
                  {svc.name}
                </h3>
                <p className="text-muted text-sm font-body mb-6 leading-relaxed">{svc.desc}</p>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted text-xs font-mono">
                    <Clock size={12} />
                    {svc.duration} {t.services.min}
                  </span>
                  <span className="text-gold text-xs font-mono tracking-widest uppercase
                    opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    {t.services.book} <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Barber / About ───────────────────────────────────────────────────────────
function BarberSection() {
  const { t } = useLang()
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.barber-content > *', { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: 'top 75%' } })
      gsap.fromTo('.barber-img', { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.9,
          scrollTrigger: { trigger: ref.current, start: 'top 75%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  const { barber: b } = t

  return (
    <section id="barber" ref={ref} className="py-24 px-4 bg-surface relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #c8a96e 0, #c8a96e 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="barber-img opacity-0 relative">
            <div className="relative rounded-sm overflow-hidden aspect-[4/5] max-w-sm mx-auto lg:mx-0">
              <img src={BARBER_IMG} alt={b.name} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
              {/* Name tag */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-display font-bold text-cream text-xl">{b.name}</p>
                <p className="font-mono text-gold text-xs tracking-widest uppercase mt-1">{b.role}</p>
              </div>
            </div>
            {/* Barber poles decoration */}
            <div className="absolute -left-4 top-1/4 hidden lg:block">
              <BarberPole className="h-24" />
            </div>
          </div>

          {/* Content */}
          <div className="barber-content space-y-6">
            <p className="section-label opacity-0">{b.label}</p>
            <div className="divider-gold opacity-0" style={{ marginLeft: 0 }} />
            <h2 className="font-display font-bold text-cream opacity-0"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              {b.title}
            </h2>
            <p className="text-muted font-body leading-relaxed opacity-0">{b.bio}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 opacity-0 pt-4">
              {[b.stat1, b.stat2, b.stat3].map((s, i) => (
                <div key={i} className="text-center border border-white/5 p-4 rounded-sm bg-charcoal">
                  <p className="font-display font-bold text-gold text-xl">{s.value}</p>
                  <p className="text-muted text-xs font-body mt-1 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Hours ────────────────────────────────────────────────────────────────────
function Hours() {
  const { t } = useLang()
  const ref = useRef(null)
  const today = new Date().getDay() // 0=Sun, 1=Mon...
  // Map JS day to array index (array is Mon-Sun, index 0-6)
  const todayIdx = today === 0 ? 6 : today - 1

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hours-row', { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.07,
          scrollTrigger: { trigger: ref.current, start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  const isOpen = () => {
    if (todayIdx === 6) return false
    const now = new Date()
    const h = now.getHours()
    const endHour = todayIdx === 4 ? 21 : todayIdx === 5 ? 18 : 20
    return h >= 9 && h < endHour
  }

  return (
    <section id="hours" ref={ref} className="py-24 px-4 bg-charcoal">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-4">{t.hours.label}</p>
          <div className="divider-gold mb-6" />
          <h2 className="font-display font-bold text-cream"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            {t.hours.title}
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border
            border-white/10 bg-surface text-xs font-mono tracking-widest">
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen() ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
            <span className={isOpen() ? 'text-green-400' : 'text-red-400'}>
              {isOpen() ? t.hours.open : t.hours.closed}
            </span>
          </div>
        </div>

        <div className="border border-white/5 overflow-hidden">
          {t.hours.days.map((row, i) => (
            <div key={i} className={`hours-row opacity-0 flex justify-between items-center px-6 py-4
              border-b border-white/5 last:border-0 transition-colors
              ${i === todayIdx ? 'bg-gold/10 border-l-2 border-l-gold' : 'bg-surface hover:bg-surface-2'}`}>
              <span className={`font-body text-sm ${i === todayIdx ? 'text-gold font-semibold' : 'text-muted'}`}>
                {i === todayIdx && <span className="font-mono text-xs mr-2 text-gold/60">▶</span>}
                {row.day}
              </span>
              <span className={`font-mono text-sm ${i === todayIdx ? 'text-cream' : row.hours.includes('Κλειστά') || row.hours === 'Closed' ? 'text-red-400/70' : 'text-cream'}`}>
                {row.hours}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Location / Map ───────────────────────────────────────────────────────────
function Location() {
  const { t } = useLang()
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.loc-col', { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15,
          scrollTrigger: { trigger: ref.current, start: 'top 75%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="location" ref={ref} className="py-24 px-4 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-4">{t.location.label}</p>
          <div className="divider-gold mb-6" />
          <h2 className="font-display font-bold text-cream"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            {t.location.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left — address info */}
          <div className="loc-col lg:col-span-2 space-y-4">
            <div className="card-dark p-6 rounded-sm space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-muted text-xs font-mono tracking-widest uppercase mb-1">Διεύθυνση</p>
                  <p className="text-cream font-body">{t.location.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-muted text-xs font-mono tracking-widest uppercase mb-1">Τηλέφωνο</p>
                  <a href={`tel:${t.location.phone.replace(/\s/g, '')}`}
                    className="text-cream font-body hover:text-gold transition-colors">
                    {t.location.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-muted text-xs font-mono tracking-widest uppercase mb-1">Email</p>
                  <a href={`mailto:${t.location.email}`}
                    className="text-cream font-body hover:text-gold transition-colors">
                    {t.location.email}
                  </a>
                </div>
              </div>
            </div>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
              className="btn-gold w-full justify-center py-4 text-sm">
              <MapPin size={16} />
              {t.location.cta}
            </a>
          </div>

          {/* Right — map */}
          <div className="loc-col lg:col-span-3">
            <div className="rounded-sm overflow-hidden border border-white/5" style={{ height: '380px' }}>
              <iframe
                title="Χάρτης"
                width="100%"
                height="100%"
                style={{ display: 'block', filter: 'grayscale(0.5) contrast(1.1) brightness(0.8)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={MAPS_EMBED}
              />
            </div>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 text-muted hover:text-gold
                text-xs font-mono tracking-widest uppercase transition-colors py-2">
              <MapPin size={12} />
              {t.location.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Booking Modal ────────────────────────────────────────────────────────────
function BookingModal({ open, onClose, preSelected }) {
  const { t } = useLang()
  const { slots, loading, error: calError, fetchSlots, bookSlot } = useCalendar()

  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [bookError, setBookError] = useState('')
  const [success, setSuccess] = useState(false)

  // Date picker: today + 30 days, excluding Sundays
  const getAvailDates = () => {
    const dates = []
    const d = new Date()
    for (let i = 0; i < 40 && dates.length < 15; i++) {
      d.setDate(d.getDate() + 1)
      if (d.getDay() !== 0) {
        dates.push(new Date(d).toISOString().split('T')[0])
      }
    }
    return dates
  }
  const availDates = getAvailDates()

  // Pre-select service if passed
  useEffect(() => {
    if (preSelected) {
      setSelectedService(preSelected)
      setStep(2)
    } else {
      setStep(1)
      setSelectedService(null)
    }
    setSelectedDate('')
    setSelectedTime('')
    setSuccess(false)
    setBookError('')
  }, [open, preSelected])

  // Fetch slots when date changes
  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchSlots(selectedDate, selectedService.duration)
    }
  }, [selectedDate, selectedService, fetchSlots])

  const formatDate = iso => {
    const d = new Date(iso + 'T12:00:00')
    return d.toLocaleDateString(t.lang === 'el' ? 'el-GR' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const handleBook = async () => {
    if (!name.trim() || !phone.trim()) { setBookError(t.booking.requiredFields); return }
    setSubmitting(true)
    setBookError('')
    try {
      await bookSlot({
        name: name.trim(),
        phone: phone.trim(),
        service: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        duration: selectedService.duration,
      })
      setSuccess(true)
    } catch {
      setBookError(t.booking.errorBooking)
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setStep(1); setSelectedService(null); setSelectedDate(''); setSelectedTime('')
    setName(''); setPhone(''); setSuccess(false); setBookError('')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/90 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-lg bg-surface border border-white/10 rounded-t-2xl sm:rounded-sm
        max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 sticky top-0 bg-surface z-10">
          <div>
            <h3 className="font-display font-bold text-cream text-lg">{t.booking.title}</h3>
            {!success && (
              <div className="flex items-center gap-2 mt-1">
                {[1,2,3].map(s => (
                  <div key={s} className={`h-1 rounded-full transition-all duration-300
                    ${s <= step ? 'bg-gold w-6' : 'bg-white/10 w-4'}`} />
                ))}
              </div>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-muted hover:text-cream transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            /* Success screen */
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check size={28} className="text-green-400" />
              </div>
              <h4 className="font-display font-bold text-cream text-xl mb-3">{t.booking.success}</h4>
              <p className="text-muted font-body mb-2">{t.booking.successSub}</p>
              <div className="mt-4 text-sm text-muted border border-white/5 rounded-sm p-4 text-left space-y-1">
                <p><span className="text-gold font-mono text-xs mr-2">SVC</span>{selectedService?.name}</p>
                <p><span className="text-gold font-mono text-xs mr-2">DATE</span>{formatDate(selectedDate)} · {selectedTime}</p>
                <p><span className="text-gold font-mono text-xs mr-2">NAME</span>{name}</p>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={reset} className="btn-outline flex-1 py-3 text-xs">{t.booking.bookAnother}</button>
                <button onClick={onClose} className="btn-gold flex-1 py-3 text-xs">{t.booking.close}</button>
              </div>
            </div>
          ) : step === 1 ? (
            /* Step 1: Service */
            <div>
              <p className="text-muted text-sm font-body mb-6">{t.booking.step1}</p>
              <div className="space-y-2">
                {t.services.items.map((svc, i) => {
                  const Icon = SERVICE_ICONS[i] || Scissors
                  return (
                    <button key={i} onClick={() => { setSelectedService(svc); setStep(2) }}
                      className="w-full flex items-center justify-between p-4 border border-white/5
                        hover:border-gold/40 bg-charcoal hover:bg-gold/5 transition-all duration-200 group text-left">
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="text-gold flex-shrink-0" />
                        <div>
                          <p className="text-cream text-sm font-body font-medium group-hover:text-gold transition-colors">{svc.name}</p>
                          <p className="text-muted text-xs mt-0.5">{svc.duration} {t.services.min}</p>
                        </div>
                      </div>
                      <span className="text-gold font-display font-semibold text-lg">{svc.price}€</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : step === 2 ? (
            /* Step 2: Date & time */
            <div>
              <p className="text-muted text-sm font-body mb-1">{t.booking.step2}</p>
              <p className="text-gold text-xs font-mono mb-6">{selectedService?.name} · {selectedService?.price}€ · {selectedService?.duration}{t.services.min}</p>

              {/* Date selector */}
              <div className="mb-6">
                <p className="text-muted text-xs font-mono tracking-widest uppercase mb-3">{t.booking.selectDate}</p>
                <div className="grid grid-cols-5 gap-2">
                  {availDates.map(d => (
                    <button key={d} onClick={() => { setSelectedDate(d); setSelectedTime('') }}
                      className={`p-2 text-center border transition-all duration-150 text-xs rounded-sm
                        ${selectedDate === d
                          ? 'border-gold bg-gold/20 text-gold'
                          : 'border-white/5 bg-charcoal text-muted hover:border-gold/40 hover:text-cream'}`}>
                      <span className="block font-display font-semibold text-sm">
                        {new Date(d + 'T12:00:00').getDate()}
                      </span>
                      <span className="block font-mono text-[10px] mt-0.5">
                        {new Date(d + 'T12:00:00').toLocaleDateString(t.lang === 'el' ? 'el-GR' : 'en-GB', { weekday: 'short' })}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div>
                  <p className="text-muted text-xs font-mono tracking-widest uppercase mb-3">Ώρα</p>
                  {loading ? (
                    <p className="text-muted text-sm text-center py-6 animate-pulse">{t.booking.loading}</p>
                  ) : slots.length === 0 ? (
                    <p className="text-muted text-sm text-center py-6">{t.booking.noSlots}</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {slots.map(slot => (
                        <button key={slot} onClick={() => setSelectedTime(slot)}
                          className={`py-2.5 text-xs font-mono border transition-all rounded-sm
                            ${selectedTime === slot
                              ? 'border-gold bg-gold/20 text-gold'
                              : 'border-white/5 bg-charcoal text-muted hover:border-gold/40 hover:text-cream'}`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {calError && <p className="text-red-400 text-xs mt-4 font-body">{calError}</p>}

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(1)} className="btn-outline flex-1 py-3 text-xs">
                  <ChevronLeft size={14} /> {t.booking.back}
                </button>
                <button onClick={() => setStep(3)} disabled={!selectedDate || !selectedTime}
                  className="btn-gold flex-1 py-3 text-xs disabled:opacity-30 disabled:cursor-not-allowed">
                  {t.booking.next} <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            /* Step 3: Details */
            <div>
              <p className="text-muted text-sm font-body mb-1">{t.booking.step3}</p>
              <p className="text-gold text-xs font-mono mb-6">
                {selectedService?.name} · {formatDate(selectedDate)} · {selectedTime}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-muted text-xs font-mono tracking-widest uppercase mb-2">
                    {t.booking.name}
                  </label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder={t.booking.namePlaceholder}
                    className="w-full bg-charcoal border border-white/10 text-cream font-body text-sm
                      px-4 py-3 rounded-sm focus:outline-none focus:border-gold/60 transition-colors
                      placeholder:text-muted/50" />
                </div>
                <div>
                  <label className="block text-muted text-xs font-mono tracking-widest uppercase mb-2">
                    {t.booking.phone}
                  </label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder={t.booking.phonePlaceholder}
                    className="w-full bg-charcoal border border-white/10 text-cream font-body text-sm
                      px-4 py-3 rounded-sm focus:outline-none focus:border-gold/60 transition-colors
                      placeholder:text-muted/50" />
                </div>
              </div>

              {bookError && <p className="text-red-400 text-xs mt-4 font-body">{bookError}</p>}

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(2)} className="btn-outline flex-1 py-3 text-xs">
                  <ChevronLeft size={14} /> {t.booking.back}
                </button>
                <button onClick={handleBook} disabled={submitting}
                  className="btn-gold flex-1 py-3 text-xs disabled:opacity-50">
                  {submitting ? '…' : <><Check size={14} /> {t.booking.confirm}</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Reviews ─────────────────────────────────────────────────────────────────
const PLACEHOLDER_REVIEWS = [
  { author: 'Νίκος Π.', rating: 5, text: 'Εξαιρετική δουλειά! Ο καλύτερος κουρέας που έχω πάει. Ακριβώς αυτό που ζήτησα.', time: '2 εβδομάδες πριν' },
  { author: 'Δημήτρης Κ.', rating: 5, text: 'Πολύ επαγγελματικός χώρος, φιλικό περιβάλλον και τέλειο αποτέλεσμα. Σίγουρα θα ξαναπάω!', time: '1 μήνας πριν' },
  { author: 'Γιώργος Μ.', rating: 5, text: 'Το καλύτερο fade που έχω κάνει ποτέ. Προτείνω ανεπιφύλακτα σε όλους.', time: '3 εβδομάδες πριν' },
  { author: 'Αλέξης Τ.', rating: 4, text: 'Πολύ καλή δουλειά, άνετος χώρος και γρήγορη εξυπηρέτηση. Σίγουρα θα επιστρέψω.', time: '2 μήνες πριν' },
  { author: 'Κώστας Λ.', rating: 5, text: 'Άψογο κούρεμα και ξύρισμα. Το ραντεβού ήταν εύκολο και ο χρόνος τηρήθηκε πιστά.', time: '1 εβδομάδα πριν' },
]

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= rating ? '#c8a96e' : 'none'}
          stroke={i <= rating ? '#c8a96e' : '#8a8070'} strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  )
}

function Reviews() {
  const { t } = useLang()
  const [current, setCurrent] = useState(0)
  const [reviews, setReviews] = useState(PLACEHOLDER_REVIEWS)
  const [isReal, setIsReal] = useState(false)
  const ref = useRef(null)
  const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

  useEffect(() => {
    if (!APPS_SCRIPT_URL) return
    fetch(`${APPS_SCRIPT_URL}?action=reviews`)
      .then(r => r.json())
      .then(data => {
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews)
          setIsReal(true)
        }
      })
      .catch(() => {})
  }, [APPS_SCRIPT_URL])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.review-card', { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % reviews.length), 5000)
    return () => clearInterval(id)
  }, [reviews.length])

  const prev = () => setCurrent(c => (c - 1 + reviews.length) % reviews.length)
  const next = () => setCurrent(c => (c + 1) % reviews.length)

  // Show 3 at a time on desktop, 1 on mobile
  const visible = [0,1,2].map(offset => reviews[(current + offset) % reviews.length])

  return (
    <section id="reviews" ref={ref} className="py-24 px-4 bg-charcoal overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-4">{t.reviews.label}</p>
          <div className="divider-gold mb-6" />
          <h2 className="font-display font-bold text-cream mb-3"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            {t.reviews.title}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <StarRating rating={5} />
            <span className="text-gold font-mono text-sm ml-1">5.0</span>
            <span className="text-muted text-sm font-body">
              {isReal ? t.reviews.fromGoogle : t.reviews.placeholder}
            </span>
          </div>
        </div>

        {/* Desktop: 3 cards */}
        <div className="hidden md:grid grid-cols-3 gap-4 mb-8">
          {visible.map((review, i) => (
            <div key={i} className="review-card opacity-0 card-dark p-6 rounded-sm flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-gold text-sm">
                      {review.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-cream text-sm font-body font-medium">{review.author}</p>
                    <p className="text-muted text-xs font-mono mt-0.5">{review.time}</p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <StarRating rating={review.rating} />
              <p className="text-muted text-sm font-body leading-relaxed flex-1">"{review.text}"</p>
            </div>
          ))}
        </div>

        {/* Mobile: 1 card */}
        <div className="md:hidden mb-8">
          <div className="card-dark p-6 rounded-sm flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-gold text-sm">
                    {reviews[current].author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-cream text-sm font-body font-medium">{reviews[current].author}</p>
                  <p className="text-muted text-xs font-mono mt-0.5">{reviews[current].time}</p>
                </div>
              </div>
            </div>
            <StarRating rating={reviews[current].rating} />
            <p className="text-muted text-sm font-body leading-relaxed">"{reviews[current].text}"</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={prev} className="w-9 h-9 border border-white/10 hover:border-gold/40
            flex items-center justify-center text-muted hover:text-gold transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-1.5">
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'bg-gold w-6' : 'bg-white/20 w-3'}`} />
            ))}
          </div>
          <button onClick={next} className="w-9 h-9 border border-white/10 hover:border-gold/40
            flex items-center justify-center text-muted hover:text-gold transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Link to Google reviews */}
        <div className="text-center mt-8">
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
            className="btn-outline text-xs px-6 py-3">
            {t.reviews.seeAll}
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ onBook }) {
  const { t } = useLang()
  return (
    <footer className="bg-charcoal border-t border-white/5 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-3">
            <BarberPole />
            <div>
              <p className="font-display font-bold text-cream text-xl">Barbershop</p>
              <p className="text-muted text-xs font-mono tracking-widest uppercase mt-1">Athens · Est. 2010</p>
            </div>
          </div>
          <button onClick={onBook} className="btn-gold px-8 py-4 text-sm">
            <Calendar size={16} /> {t.nav.book}
          </button>
        </div>
        <div className="divider-gold mb-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-muted text-xs font-body">
          <p>{t.footer.tagline}</p>
          <p>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function AppInner() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [preSelected, setPreSelected] = useState(null)

  const openBook = useCallback((svc = null) => {
    setPreSelected(svc?.duration ? svc : null)
    setBookingOpen(true)
  }, [])

  return (
    <>
      <Navbar onBook={openBook} />
      <Hero onBook={openBook} />
      <Services onBook={openBook} />
      <BarberSection />
      <Hours />
      <Reviews />
      <Location />
      <Footer onBook={openBook} />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} preSelected={preSelected} />
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  )
}
