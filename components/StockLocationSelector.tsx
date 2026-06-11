'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStockLocation, STOCK_LOCATIONS } from '@/contexts/StockLocationContext'

const LOCATION_FLAGS: Record<string, string> = {
  all: '',
  UK: '🇬🇧',
  Zimbabwe: '🇿🇼',
}

export default function StockLocationSelector() {
  const { stockLocation, setStockLocation } = useStockLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = STOCK_LOCATIONS.find(l => l.value === stockLocation) ?? STOCK_LOCATIONS[0]

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
          open ? 'bg-primary-subtle text-ink' : 'text-ink-muted hover:text-ink hover:bg-primary-subtle'
        }`}
      >
        {stockLocation === 'all'
          ? <MapPin size={14} className="shrink-0" />
          : <span className="text-sm leading-none">{LOCATION_FLAGS[stockLocation]}</span>
        }
        <span className="hidden sm:inline">
          {stockLocation === 'all' ? 'Location' : selected.label.split(' ')[0]}
        </span>
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 8,  scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-1 w-48 bg-white border border-edge rounded-2xl overflow-hidden shadow-lg z-50 p-1"
          >
            {STOCK_LOCATIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { setStockLocation(opt.value); setOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors text-left ${
                  opt.value === stockLocation
                    ? 'bg-primary text-white'
                    : 'hover:bg-primary-subtle text-ink'
                }`}
              >
                {opt.value === 'all'
                  ? <MapPin size={14} className="shrink-0" />
                  : <span className="text-base leading-none">{LOCATION_FLAGS[opt.value]}</span>
                }
                <span className="text-xs font-semibold flex-1">{opt.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
