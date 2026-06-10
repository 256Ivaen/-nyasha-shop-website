'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ChevronRight, ChevronDown, Search, ShoppingBag, User } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { ShopContext } from '@/contexts/ShopContext'
import { useContext } from 'react'
import { assets } from '@/assets/assets'
import CurrencySelector from '@/components/CurrencySelector'
import axios from 'axios'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

// ── Dropdown data ────────────────────────────────────────────────────────────
const shopLinks = [
  { label: 'All Products',  href: '/collection',                   desc: 'Browse everything we carry' },
  { label: 'New Arrivals',  href: '/new-arrivals',                 desc: 'Just landed in store' },
  { label: 'Best Sellers',  href: '/bestsellers',                  desc: 'Most loved by customers' },
  { label: 'Discounted',    href: '/discounted',                   desc: 'Special deals and offers' },
]

const infoLinks = [
  { label: 'About Us', href: '/about',   desc: 'Our story and mission' },
  { label: 'Contact',  href: '/contact', desc: 'Get in touch with us' },
  { label: 'FAQs',     href: '/faq',     desc: 'Common questions answered' },
]

const accountLoggedIn = [
  { label: 'My Profile', href: '/profile' },
  { label: 'My Orders',  href: '/orders'  },
]

// ── Shared helper ────────────────────────────────────────────────────────────
function isActive(pathname: string, href: string) {
  const path = href.split('?')[0]
  if (path === '/') return pathname === '/'
  return pathname === path || pathname.startsWith(path + '/')
}

// ── Desktop dropdown ─────────────────────────────────────────────────────────
type DropItem = { label: string; href: string; desc?: string }

function NavDropdown({ label, items, open, onEnter, onLeave, loading }: {
  label: string; items: DropItem[]; open: boolean; loading?: boolean
  onEnter: () => void; onLeave: () => void
}) {
  return (
    <div className="relative py-2" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        type="button"
        className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
          open ? 'text-ink bg-primary-subtle' : 'text-ink-muted hover:text-ink hover:bg-primary-subtle'
        }`}
      >
        {label}
        <ChevronDown size={13} className={`transition-transform duration-250 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 8,  scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-52 bg-white border border-edge rounded-2xl overflow-hidden p-1 z-50"
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-4 py-2.5 rounded-xl">
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                </div>
              ))
            ) : items.length > 0 ? (
              items.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-start justify-between px-4 py-2.5 rounded-xl hover:bg-primary-subtle transition-colors group"
                >
                  <div>
                    <p className="text-xs font-semibold text-ink group-hover:text-primary transition-colors">{item.label}</p>
                    {item.desc && <p className="text-[10px] text-ink-light mt-0.5">{item.desc}</p>}
                  </div>
                  <ChevronRight size={11} className="text-edge-dark group-hover:text-primary transition-colors mt-0.5 flex-shrink-0" />
                </Link>
              ))
            ) : (
              <Link href="/collection" className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-primary-subtle transition-colors group">
                <p className="text-xs font-semibold text-ink group-hover:text-primary">All Products</p>
                <ChevronRight size={11} className="text-edge-dark group-hover:text-primary" />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const ctx = useContext(ShopContext)!
  const { setShowSearch, getCartCount, token, logout, userData } = ctx
  const pathname = usePathname()
  const router   = useRouter()

  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled,     setScrolled]     = useState(false)
  const [annoIdx,      setAnnoIdx]      = useState(0)

  // Dynamic categories from backend
  const [categoryLinks,    setCategoryLinks]    = useState<DropItem[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<string[]>([])

  // Mobile accordion state
  const [mShop,       setMShop]       = useState(false)
  const [mCategories, setMCategories] = useState(false)
  const [mInfo,       setMInfo]       = useState(false)
  const [mAccount,    setMAccount]    = useState(false)

  useEffect(() => {
    axios.get(`${BACKEND}/api/v1/announcements`)
      .then(r => { if (Array.isArray(r.data.announcements)) setAnnouncements(r.data.announcements) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    axios.get(`${BACKEND}/api/v1/categories`)
      .then(r => {
        const raw = Array.isArray(r.data.categories) ? r.data.categories : Array.isArray(r.data) ? r.data : []
        setCategoryLinks(raw.map((c: { name?: string; slug?: string } | string) => {
          const name = typeof c === 'string' ? c : (c.name ?? '')
          const slug = typeof c === 'string' ? name.toLowerCase().replace(/\s+/g, '-') : (c.slug ?? name.toLowerCase().replace(/\s+/g, '-'))
          return { label: name, href: `/category/${slug}`, desc: `Shop all ${name}` }
        }))
      })
      .catch(() => {})
      .finally(() => setCategoriesLoading(false))
  }, [])

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 10)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setAnnoIdx(i => i + 1), 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const open  = (key: string) => setOpenDropdown(key)
  const close = () => setOpenDropdown(null)

  const handleLogout = useCallback(() => {
    logout()
    router.push('/login')
    setMobileOpen(false)
    toast.success('Logged out successfully')
  }, [logout, router])

  const cartCount = getCartCount()

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {(mobileOpen || openDropdown) && (
          <motion.div
            key="nav-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => { setMobileOpen(false); setOpenDropdown(null) }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300`}>

        {/* ── Announcement Bar ───────────────────────────────────────── */}
        {announcements.length > 0 && (
          <div className="bg-primary text-primary-foreground text-xs text-center py-2 px-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={annoIdx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="font-medium tracking-wide"
              >
                {announcements[annoIdx % announcements.length]}
              </motion.span>
            </AnimatePresence>
          </div>
        )}

        {/* ── Main header ────────────────────────────────────────────── */}
        <div className={`bg-white transition-all duration-300 relative overflow-visible ${scrolled ? 'border-b border-edge' : ''}`}>
          <div className="px-4 sm:px-8 lg:px-16 h-16 flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">

            {/* LEFT — desktop nav dropdowns */}
            <nav className="hidden lg:flex items-center gap-0.5">
              <Link
                href="/"
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-colors duration-200 ${
                  isActive(pathname, '/')
                    ? 'text-ink bg-primary-subtle'
                    : 'text-ink-muted hover:text-ink hover:bg-primary-subtle'
                }`}
              >
                Home
              </Link>
              <NavDropdown
                label="Shop"
                items={shopLinks}
                open={openDropdown === 'shop'}
                onEnter={() => open('shop')}
                onLeave={close}
              />
              <NavDropdown
                label="Categories"
                items={categoryLinks}
                loading={categoriesLoading}
                open={openDropdown === 'categories'}
                onEnter={() => open('categories')}
                onLeave={close}
              />
              <NavDropdown
                label="Info"
                items={infoLinks}
                open={openDropdown === 'info'}
                onEnter={() => open('info')}
                onLeave={close}
              />
            </nav>

            {/* CENTER — Logo (overflows bottom of navbar by half its height) */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 top-0 z-20 hover:opacity-90 transition-opacity">
              <Image src={assets.logo} alt="SN Luxe Africa" width={128} height={128} className="h-32 w-32 object-contain drop-shadow-md" priority />
            </Link>

            {/* RIGHT — icons + account dropdown */}
            <div className="hidden lg:flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => setShowSearch(true)}
                aria-label="Search"
                className="p-2 rounded-full text-ink-muted hover:text-ink hover:bg-primary-subtle transition-colors"
              >
                <Search className="w-[17px] h-[17px]" />
              </button>

              {/* Account dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => open('account')}
                onMouseLeave={close}
              >
                <button
                  type="button"
                  aria-label="Account"
                  className={`flex items-center gap-1 p-2 rounded-full text-xs font-semibold transition-colors duration-200 ${
                    openDropdown === 'account' ? 'text-ink bg-primary-subtle' : 'text-ink-muted hover:text-ink hover:bg-primary-subtle'
                  }`}
                >
                  <User className="w-[17px] h-[17px]" />
                </button>
                <AnimatePresence>
                  {openDropdown === 'account' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0,  scale: 1    }}
                      exit={{    opacity: 0, y: 8,  scale: 0.97 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-1 w-48 bg-white border border-edge rounded-2xl overflow-hidden p-1 z-50"
                    >
                      {token ? (
                        <>
                          {userData && (
                            <div className="px-4 py-2.5 border-b border-edge-light mb-1">
                              <p className="text-[10px] text-ink-light">Signed in as</p>
                              <p className="text-xs font-bold text-ink truncate">{userData.name}</p>
                            </div>
                          )}
                          {accountLoggedIn.map(item => (
                            <Link key={item.label} href={item.href}
                              className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-primary-subtle transition-colors group">
                              <span className="text-xs font-semibold text-ink group-hover:text-primary transition-colors">{item.label}</span>
                              <ChevronRight size={11} className="text-edge-dark group-hover:text-primary transition-colors" />
                            </Link>
                          ))}
                          <div className="mx-3 border-t border-edge-light my-1" />
                          <button type="button" onClick={handleLogout}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-danger-light transition-colors group">
                            <span className="text-xs font-semibold text-danger">Logout</span>
                            <ChevronRight size={11} className="text-danger" />
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href="/login"
                            className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-primary-subtle transition-colors group">
                            <span className="text-xs font-semibold text-ink group-hover:text-primary">Login</span>
                            <ChevronRight size={11} className="text-edge-dark group-hover:text-primary" />
                          </Link>
                          <Link href="/login"
                            className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-primary-subtle transition-colors group">
                            <span className="text-xs font-semibold text-ink group-hover:text-primary">Sign Up</span>
                            <ChevronRight size={11} className="text-edge-dark group-hover:text-primary" />
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Currency selector */}
              <CurrencySelector />

              {/* Cart */}
              <Link
                href="/cart"
                aria-label={`Cart (${cartCount} items)`}
                className="relative p-2 rounded-full text-ink-muted hover:text-ink hover:bg-primary-subtle transition-colors"
              >
                <ShoppingBag className="w-[17px] h-[17px]" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-[14px] h-[14px] bg-primary text-primary-foreground text-[9px] rounded-full flex items-center justify-center font-bold leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile right: search + cart + hamburger */}
            <div className="flex items-center gap-1 lg:hidden ml-auto">
              <button type="button" onClick={() => setShowSearch(true)} aria-label="Search"
                className="p-2 text-ink-muted hover:text-ink transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <Link href="/cart" className="relative p-2 text-ink-muted hover:text-ink transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-[14px] h-[14px] bg-primary text-primary-foreground text-[9px] rounded-full flex items-center justify-center font-bold leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              <button type="button" onClick={() => setMobileOpen(v => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="p-2 rounded-full bg-primary-subtle text-ink hover:bg-edge transition-colors ml-1">
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen
                    ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90,  opacity: 0 }} transition={{ duration: 0.18 }} className="flex"><X    size={18} /></motion.span>
                    : <motion.span key="menu" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }} className="flex"><Menu size={18} /></motion.span>
                  }
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile accordion menu ───────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden mx-4 mt-1 rounded-2xl bg-white border border-edge overflow-hidden"
            >
              <nav className="px-2 pt-2 pb-1 flex flex-col gap-0.5">

                {/* Home */}
                <Link href="/" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-ink hover:bg-primary-subtle">
                  Home <ChevronRight size={13} />
                </Link>

                {/* Shop accordion */}
                <button type="button" onClick={() => setMShop(v => !v)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-ink hover:bg-primary-subtle w-full">
                  Shop <ChevronDown size={13} className={`transition-transform ${mShop ? 'rotate-180' : ''}`} />
                </button>
                {mShop && shopLinks.map(l => (
                  <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-6 py-2.5 rounded-xl text-xs font-medium text-ink-muted hover:text-primary hover:bg-primary-subtle transition-colors">
                    <span>{l.label}</span><ChevronRight size={11} />
                  </Link>
                ))}

                {/* Categories accordion */}
                <button type="button" onClick={() => setMCategories(v => !v)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-ink hover:bg-primary-subtle w-full">
                  Categories <ChevronDown size={13} className={`transition-transform ${mCategories ? 'rotate-180' : ''}`} />
                </button>
                {mCategories && (
                  categoriesLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="px-6 py-2.5 rounded-xl">
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                      </div>
                    ))
                  ) : categoryLinks.length > 0 ? (
                    categoryLinks.map(l => (
                      <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between px-6 py-2.5 rounded-xl text-xs font-medium text-ink-muted hover:text-primary hover:bg-primary-subtle transition-colors">
                        <span>{l.label}</span><ChevronRight size={11} />
                      </Link>
                    ))
                  ) : (
                    <Link href="/collection" onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-6 py-2.5 rounded-xl text-xs font-medium text-ink-muted hover:text-primary hover:bg-primary-subtle transition-colors">
                      <span>All Products</span><ChevronRight size={11} />
                    </Link>
                  )
                )}

                {/* Info accordion */}
                <button type="button" onClick={() => setMInfo(v => !v)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-ink hover:bg-primary-subtle w-full">
                  Info <ChevronDown size={13} className={`transition-transform ${mInfo ? 'rotate-180' : ''}`} />
                </button>
                {mInfo && infoLinks.map(l => (
                  <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-6 py-2.5 rounded-xl text-xs font-medium text-ink-muted hover:text-primary hover:bg-primary-subtle transition-colors">
                    <span>{l.label}</span><ChevronRight size={11} />
                  </Link>
                ))}

                {/* Account accordion */}
                <button type="button" onClick={() => setMAccount(v => !v)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-ink hover:bg-primary-subtle w-full">
                  Account <ChevronDown size={13} className={`transition-transform ${mAccount ? 'rotate-180' : ''}`} />
                </button>
                {mAccount && (
                  token ? (
                    <>
                      {accountLoggedIn.map(l => (
                        <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between px-6 py-2.5 rounded-xl text-xs font-medium text-ink-muted hover:text-primary hover:bg-primary-subtle transition-colors">
                          <span>{l.label}</span><ChevronRight size={11} />
                        </Link>
                      ))}
                      <button type="button" onClick={handleLogout}
                        className="flex items-center justify-between px-6 py-2.5 rounded-xl text-xs font-medium text-danger hover:bg-danger-light w-full transition-colors">
                        Logout <ChevronRight size={11} />
                      </button>
                    </>
                  ) : (
                    <Link href="/login" onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-6 py-2.5 rounded-xl text-xs font-medium text-ink-muted hover:text-primary hover:bg-primary-subtle transition-colors">
                      <span>Login / Sign Up</span><ChevronRight size={11} />
                    </Link>
                  )
                )}

              </nav>

              <div className="mx-4 border-t border-edge-light my-1" />
              <div className="px-4 py-3">
                <Link href="/cart" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white hover:bg-primary-hover transition-colors">
                  View Cart ({cartCount} items) <ChevronRight size={15} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
