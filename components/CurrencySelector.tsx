'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCurrency } from '@/contexts/CurrencyContext'

export default function CurrencySelector() {
  const { currency, setCurrency, currencies, currenciesLoaded, currencySymbol } = useCurrency()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50)
    else setSearch('')
  }, [open])

  // Show a subtle loading skeleton until backend responds
  if (!currenciesLoaded) {
    return (
      <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs text-ink-muted">
        <span className="w-6 h-3 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  const filtered = search.trim()
    ? currencies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.symbol.toLowerCase().includes(search.toLowerCase())
      )
    : currencies

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
          open ? 'bg-primary-subtle text-ink' : 'text-ink-muted hover:text-ink hover:bg-primary-subtle'
        }`}
      >
        <span>{currencySymbol}</span>
        <span className="hidden sm:inline">{currency}</span>
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 8,  scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-1 w-60 bg-white border border-edge rounded-2xl overflow-hidden shadow-lg z-50"
          >
            <div className="p-2 border-b border-edge-light">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search currency..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="max-h-64 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">No currencies found</p>
              ) : (
                filtered.map(opt => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => { setCurrency(opt.code); setOpen(false) }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-left ${
                      opt.code === currency
                        ? 'bg-primary text-white'
                        : 'hover:bg-primary-subtle text-ink'
                    }`}
                  >
                    <span className="text-xs font-semibold">{opt.name}</span>
                    <span className="text-xs opacity-70 ml-2 shrink-0">{opt.symbol} {opt.code}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
