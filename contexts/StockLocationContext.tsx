'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

export const STOCK_LOCATIONS = [
  { value: 'all',      label: 'All Stock',      flag: '🌍' },
  { value: 'UK',       label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'Zimbabwe', label: 'Zimbabwe',        flag: '🇿🇼' },
] as const

export type StockLocationValue = 'all' | 'UK' | 'Zimbabwe'

const COOKIE_KEY = 'sn_stock_location'
const LS_KEY     = 'sn_stock_location'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`
}

function isValid(v: string | null): v is StockLocationValue {
  return v === 'all' || v === 'UK' || v === 'Zimbabwe'
}

interface StockLocationContextValue {
  stockLocation:    StockLocationValue
  setStockLocation: (val: StockLocationValue) => void
}

const StockLocationContext = createContext<StockLocationContextValue>({
  stockLocation:    'all',
  setStockLocation: () => {},
})

export function StockLocationProvider({ children }: { children: ReactNode }) {
  const [stockLocation, setLocationState] = useState<StockLocationValue>('all')

  // Resolve on mount: cookie is source of truth (fast, survives navigation), localStorage as fallback
  useEffect(() => {
    const fromCookie = getCookie(COOKIE_KEY)
    const fromLS     = localStorage.getItem(LS_KEY)
    const resolved   = isValid(fromCookie) ? fromCookie : isValid(fromLS) ? fromLS : 'all'
    setLocationState(resolved)
    // Sync both stores to the resolved value
    setCookie(COOKIE_KEY, resolved)
    localStorage.setItem(LS_KEY, resolved)
  }, [])

  const setStockLocation = useCallback((val: StockLocationValue) => {
    // Instant UI update first (mirrors CyberCP switchOrg pattern)
    setLocationState(val)
    setCookie(COOKIE_KEY, val)
    localStorage.setItem(LS_KEY, val)
    // Notify other tabs/windows
    window.dispatchEvent(new CustomEvent('sn-stock-location-change', { detail: val }))
  }, [])

  // Keep in sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === LS_KEY && e.newValue && isValid(e.newValue)) {
        setLocationState(e.newValue)
        setCookie(COOKIE_KEY, e.newValue)
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  return (
    <StockLocationContext.Provider value={{ stockLocation, setStockLocation }}>
      {children}
    </StockLocationContext.Provider>
  )
}

export function useStockLocation() {
  return useContext(StockLocationContext)
}
