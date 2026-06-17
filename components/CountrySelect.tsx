'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '@/contexts/ShopContext'

interface Country {
  name: string
  iso2: string
  unicodeFlag: string
}

interface CountrySelectProps {
  value: string                               // ISO2 code (e.g. "GB")
  onChange: (iso2: string, name: string) => void
  defaultIso2?: string
}

const CACHE_KEY = 'sn_countries_v1'
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 h

export default function CountrySelect({ value, onChange, defaultIso2 = 'GB' }: CountrySelectProps) {
  const { backendUrl } = useContext(ShopContext)!
  const [countries, setCountries] = useState<Country[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch from YOUR backend — never call third-party APIs from the frontend
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const { ts, data } = JSON.parse(cached)
        if (Date.now() - ts < CACHE_TTL) {
          setCountries(data)
          setLoading(false)
          if (!value) {
            const def = (data as Country[]).find(c => c.iso2 === defaultIso2)
            if (def) onChange(def.iso2, def.name)
          }
          return
        }
      } catch { /* stale — re-fetch */ }
    }

    axios
      .get(`${backendUrl}/api/v1/countries`)
      .then(res => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          const list: Country[] = res.data.data
          setCountries(list)
          localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: list }))
          if (!value) {
            const def = list.find(c => c.iso2 === defaultIso2)
            if (def) onChange(def.iso2, def.name)
          }
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [backendUrl])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = countries.find(c => c.iso2 === value)
  const filtered = search.trim()
    ? countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.iso2.toLowerCase().includes(search.toLowerCase())
      )
    : countries

  return (
    <div ref={dropdownRef} className="relative w-full" style={{ zIndex: 50 }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setSearch('') }}
        disabled={loading || error}
        className="w-full flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white text-left disabled:opacity-60"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {loading ? (
          <span className="text-gray-400">Loading countries…</span>
        ) : error ? (
          <span className="text-red-400">Could not load countries</span>
        ) : selected ? (
          <>
            <span className="text-lg leading-none">{selected.unicodeFlag}</span>
            <span className="text-gray-800 truncate">{selected.name}</span>
            <span className="ml-auto text-gray-400 text-[10px] font-mono">{selected.iso2}</span>
          </>
        ) : (
          <span className="text-gray-400">Select country</span>
        )}
        <svg
          className={`ml-auto w-3 h-3 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.085l3.71-3.755a.75.75 0 111.08 1.04l-4.24 4.29a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && !loading && !error && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          style={{ zIndex: 9999 }}
        >
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              placeholder="Search country or code…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Country list */}
          <ul role="listbox" className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-xs text-gray-400 text-center">No countries found</li>
            ) : (
              filtered.map(c => (
                <li
                  key={c.iso2}
                  role="option"
                  aria-selected={c.iso2 === value}
                  onClick={() => { onChange(c.iso2, c.name); setOpen(false); setSearch('') }}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-xs hover:bg-gray-50 transition-colors ${
                    c.iso2 === value ? 'bg-primary/5 font-semibold text-primary' : 'text-gray-700'
                  }`}
                >
                  <span className="text-base leading-none w-6 shrink-0">{c.unicodeFlag}</span>
                  <span className="truncate">{c.name}</span>
                  <span className="ml-auto text-gray-300 text-[10px] font-mono shrink-0">{c.iso2}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
