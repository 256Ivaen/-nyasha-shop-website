'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'

const DEVICE_TOKEN_KEY = 'sn_device_token'
const PREF_KEY         = 'sn_preferred_currency'
const BACKEND          = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''
const API              = `${BACKEND}/api/v1`

export interface CurrencyOption {
  currency:     string   // e.g. "GBP"
  country_code: string   // e.g. "GB"
  flag_url:     string   // e.g. "https://flagsapi.com/GB/flat/64.png"
}

interface CurrencyContextValue {
  currency:         string
  setCurrency:      (code: string) => Promise<void>
  currencies:       CurrencyOption[]
  currenciesLoaded: boolean
  deviceToken:      string
  currencySymbol:   string
  formatAmount:     (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency:         'GBP',
  setCurrency:      async () => {},
  currencies:       [],
  currenciesLoaded: false,
  deviceToken:      '',
  currencySymbol:   'GBP',
  formatAmount:     (n) => `GBP ${n.toFixed(2)}`,
})

function generateDeviceToken(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

// Country code → ISO currency code mapping (most common countries)

// Currencies that display as whole numbers (no decimals)
const NO_DECIMALS = new Set(['UGX', 'TZS', 'RWF', 'NGN', 'KES', 'BIF', 'GNF', 'MGA', 'CLP', 'PYG', 'VND', 'KRW', 'JPY', 'IDR'])

function formatAmount(amount: number, code: string): string {
  if (NO_DECIMALS.has(code)) {
    return `${code} ${Math.round(amount).toLocaleString()}`
  }
  return `${code} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency,         setCurrencyState] = useState('GBP')
  const [currencies,       setCurrencies]    = useState<CurrencyOption[]>([])
  const [currenciesLoaded, setLoaded]        = useState(false)
  const [deviceToken,      setDeviceToken]   = useState('')

  useEffect(() => {
    let token = localStorage.getItem(DEVICE_TOKEN_KEY) ?? ''
    if (!token) {
      token = generateDeviceToken()
      localStorage.setItem(DEVICE_TOKEN_KEY, token)
    }
    setDeviceToken(token)

    const saved = localStorage.getItem(PREF_KEY)

    fetch(`${API}/exchange/currencies`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const list: CurrencyOption[] = Array.isArray(d.data) ? d.data : []
        if (list.length > 0) {
          setCurrencies(list)
          setLoaded(true)
        }
      })
      .catch(() => setLoaded(true))

    // If saved, set state immediately — ShopContext already fetched with this currency
    if (saved) {
      setCurrencyState(saved)
      return
    }

    // No saved preference — wait for ShopContext to resolve and write to localStorage,
    // then pick it up. Poll localStorage briefly since ShopContext runs concurrently.
    const poll = setInterval(() => {
      const resolved = localStorage.getItem(PREF_KEY)
      if (resolved) {
        clearInterval(poll)
        setCurrencyState(resolved)
      }
    }, 200)
    // Give up after 8s and fall back to GBP
    setTimeout(() => clearInterval(poll), 8000)
  }, [])

  const setCurrency = useCallback(async (code: string) => {
    const token = localStorage.getItem(DEVICE_TOKEN_KEY) ?? deviceToken
    setCurrencyState(code)
    localStorage.setItem(PREF_KEY, code)
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

  const currencySymbol = currency
  const fmt = useCallback(
    (amount: number) => formatAmount(amount, currency),
    [currency]
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
