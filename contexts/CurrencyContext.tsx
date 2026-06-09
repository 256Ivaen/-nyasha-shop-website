'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'

const DEVICE_TOKEN_KEY = 'sn_device_token'
const PREF_KEY         = 'sn_preferred_currency'
const BACKEND          = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''
const API              = `${BACKEND}/api/v1`

export interface CurrencyOption {
  code: string
  name: string
  symbol: string
}

interface CurrencyContextValue {
  currency: string
  setCurrency: (code: string) => Promise<void>
  currencies: CurrencyOption[]
  currenciesLoaded: boolean
  deviceToken: string
  currencySymbol: string
  formatAmount: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'GBP',
  setCurrency: async () => {},
  currencies: [],
  currenciesLoaded: false,
  deviceToken: '',
  currencySymbol: '£',
  formatAmount: (n) => `£${n.toFixed(2)}`,
})

function generateDeviceToken(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function formatAmount(amount: number, code: string, symbol: string): string {
  // Currencies that display as whole numbers
  const noDecimals = ['UGX', 'TZS', 'RWF', 'NGN', 'KES']
  if (noDecimals.includes(code)) {
    return `${symbol} ${Math.round(amount).toLocaleString()}`
  }
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency,         setCurrencyState]  = useState('GBP')
  const [currencies,       setCurrencies]     = useState<CurrencyOption[]>([])
  const [currenciesLoaded, setLoaded]         = useState(false)
  const [deviceToken,      setDeviceToken]    = useState('')

  useEffect(() => {
    // Device token
    let token = localStorage.getItem(DEVICE_TOKEN_KEY) ?? ''
    if (!token) {
      token = generateDeviceToken()
      localStorage.setItem(DEVICE_TOKEN_KEY, token)
    }
    setDeviceToken(token)

    // Restore last-used currency from localStorage immediately (avoids flash)
    const saved = localStorage.getItem(PREF_KEY)
    if (saved) setCurrencyState(saved)

    // Fetch currencies from backend — this is the ONLY source of truth
    fetch(`${API}/exchange/currencies`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        if (Array.isArray(d.currencies) && d.currencies.length > 0) {
          setCurrencies(d.currencies)
          setLoaded(true)
        }
      })
      .catch(() => setLoaded(true)) // still mark loaded so UI doesn't spin forever

    // Sync preference from server via device token
    fetch(`${API}/exchange/preference`, { headers: { 'X-Device-Token': token } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.currency) {
          setCurrencyState(d.currency)
          localStorage.setItem(PREF_KEY, d.currency)
        }
      })
      .catch(() => {})
  }, [])

  const setCurrency = useCallback(async (code: string) => {
    const token = localStorage.getItem(DEVICE_TOKEN_KEY) ?? deviceToken
    setCurrencyState(code)
    localStorage.setItem(PREF_KEY, code)
    // Notify ShopContext (and anything else) that currency changed so they re-fetch
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sn-currency-change', { detail: code }))
    }
    try {
      await fetch(`${API}/exchange/preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Device-Token': token },
        body: JSON.stringify({ currency: code }),
      })
    } catch {}
  }, [deviceToken])

  const currencySymbol = currencies.find(c => c.code === currency)?.symbol ?? currency
  const fmt = useCallback(
    (amount: number) => formatAmount(amount, currency, currencies.find(c => c.code === currency)?.symbol ?? currency),
    [currency, currencies]
  )

  return (
    <CurrencyContext.Provider value={{
      currency, setCurrency, currencies, currenciesLoaded,
      deviceToken, currencySymbol, formatAmount: fmt,
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
