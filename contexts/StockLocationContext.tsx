'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export const STOCK_LOCATIONS = [
  { value: 'all',      label: 'All Locations', flag: '🌍' },
  { value: 'UK',       label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'Zimbabwe', label: 'Zimbabwe',        flag: '🇿🇼' },
] as const

export type StockLocationValue = 'all' | 'UK' | 'Zimbabwe'

const PREF_KEY = 'sn_stock_location'

interface StockLocationContextValue {
  stockLocation:    StockLocationValue
  setStockLocation: (val: StockLocationValue) => void
}

const StockLocationContext = createContext<StockLocationContextValue>({
  stockLocation:    'all',
  setStockLocation: () => {},
})

export function StockLocationProvider({ children }: { children: ReactNode }) {
  const [stockLocation, setLocationState] = useState<StockLocationValue>(() => {
    if (typeof window === 'undefined') return 'all'
    return (localStorage.getItem(PREF_KEY) as StockLocationValue) ?? 'all'
  })

  const setStockLocation = useCallback((val: StockLocationValue) => {
    localStorage.setItem(PREF_KEY, val)
    setLocationState(val)
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
