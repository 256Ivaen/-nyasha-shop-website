'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useCurrency } from '@/contexts/CurrencyContext'

export default function CurrencySelector() {
  const { currency, setCurrency, currencies, currenciesLoaded } = useCurrency()
  const [open, setOpen]     = useState(false)
  const [search, setSearch] = useState('')
  const ref       = useRef<HTMLDivElement>(null)
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

  if (!currenciesLoaded) {
    return (
      <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs text-ink-muted">
        <span className="w-6 h-3 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  const selected = currencies.find(c => c.currency === currency)

  const filtered = search.trim()
    ? currencies.filter(c => c.currency.toLowerCase().includes(search.toLowerCase()))
    : currencies

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
          open ? 'bg-primary-subtle text-ink' : 'text-ink-muted hover:text-ink hover:bg-primary-subtle'
        }`}
      >
        {selected?.flag_url && (
          <Image
            src={selected.flag_url}
            alt={selected.country_code}
            width={18}
            height={13}
            className="rounded-sm object-cover shrink-0"
            unoptimized
          />
        )}
        <span>{currency}</span>
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 8,  scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-1 w-56 bg-white border border-edge rounded-2xl overflow-hidden shadow-lg z-50"
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
                    key={opt.currency}
                    type="button"
                    onClick={() => { setCurrency(opt.currency); setOpen(false) }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors text-left ${
                      opt.currency === currency
                        ? 'bg-primary text-white'
                        : 'hover:bg-primary-subtle text-ink'
                    }`}
                  >
                    <Image
                      src={opt.flag_url}
                      alt={opt.country_code}
                      width={20}
                      height={14}
                      className="rounded-sm object-cover shrink-0"
                      unoptimized
                    />
                    <span className="text-xs font-semibold flex-1">{opt.currency}</span>
                    <span className={`text-xs shrink-0 ${opt.currency === currency ? 'opacity-80' : 'opacity-40'}`}>{opt.country_code}</span>
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
