'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export interface Product {
  _id: string
  slug: string
  name: string
  description: string
  price: number
  image: string[]
  category: string
  subCategory?: string
  sizes?: string[]
  bestseller?: boolean
  new_arrival?: boolean
  discounted?: boolean
  discount_price?: number
  date?: number
}

export interface UserData {
  id: string
  name: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  street?: string
  city?: string
  country?: string
}

export interface CartItems {
  [productId: string]: {
    [size: string]: number
  }
}

interface ShopContextValue {
  products: Product[]
  currency: string
  displayPrice: (ugxAmount: number) => string
  delivery_fee: number
  search: string
  setSearch: (v: string) => void
  showSearch: boolean
  setShowSearch: (v: boolean) => void
  cartItems: CartItems
  addToCart: (itemId: string, size?: string) => Promise<void>
  setCartItems: (items: CartItems) => void
  getCartCount: () => number
  updateQuantity: (itemId: string, size: string, quantity: number) => Promise<void>
  getCartAmount: () => number
  navigate: ReturnType<typeof useRouter>
  backendUrl: string
  setToken: (t: string) => void
  token: string
  userData: UserData | null
  setUserData: (u: UserData | null) => void
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  getUserData: (token: string) => Promise<void>
  getUserProfile: () => Promise<unknown>
  updateUserProfile: (data: unknown) => Promise<{ success: boolean; message?: string }>
  currencyLoading: boolean
}

export const ShopContext = createContext<ShopContextValue | null>(null)

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within ShopContextProvider')
  return ctx
}

export default function ShopContextProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyLocal] = useState('')
  const [currencyLoading, setCurrencyLoading] = useState(false)
  const delivery_fee = 4.99
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [cartItems, setCartItems] = useState<CartItems>({})
  const [products, setProducts] = useState<Product[]>([])
  const [token, setToken] = useState('')
  const [userData, setUserData] = useState<UserData | null>(null)
  const navigate = useRouter()

  const authHeaders = (t?: string) => ({
    Authorization: `Bearer ${t ?? token}`,
  })

  const addToCart = async (itemId: string, size = 'default') => {
    if (!itemId) return
    const itemIdStr = String(itemId)
    const cartData = structuredClone(cartItems)
    if (!cartData[itemIdStr]) cartData[itemIdStr] = {}
    cartData[itemIdStr][size] = (cartData[itemIdStr][size] ?? 0) + 1
    setCartItems(cartData)
    if (token) {
      try {
        await axios.post(
          backendUrl + '/api/v1/user/cart',
          { cartData },
          { headers: authHeaders() },
        )
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } }
        toast.error(err.response?.data?.message ?? 'Failed to sync cart')
      }
    }
    toast.success('Product added to cart successfully!')
  }

  const getCartCount = () => {
    let total = 0
    for (const items of Object.values(cartItems)) {
      for (const qty of Object.values(items)) {
        if (qty > 0) total += qty
      }
    }
    return total
  }

  const updateQuantity = async (itemId: string, size: string, quantity: number) => {
    const itemIdStr = String(itemId)
    const cartData = structuredClone(cartItems)
    if (!cartData[itemIdStr]) cartData[itemIdStr] = {}
    if (quantity <= 0) {
      delete cartData[itemIdStr][size]
      if (Object.keys(cartData[itemIdStr]).length === 0) delete cartData[itemIdStr]
    } else {
      cartData[itemIdStr][size] = quantity
    }
    setCartItems(cartData)
    if (token) {
      try {
        await axios.post(
          backendUrl + '/api/v1/user/cart',
          { cartData },
          { headers: authHeaders() },
        )
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } }
        toast.error(err.response?.data?.message ?? 'Failed to update cart')
      }
    }
  }

  const getCartAmount = () => {
    let total = 0
    for (const [id, sizes] of Object.entries(cartItems)) {
      const product = products.find(p => String(p._id) === String(id))
      if (!product) continue
      for (const qty of Object.values(sizes)) {
        if (qty > 0) total += product.price * qty
      }
    }
    return total
  }

  const displayPrice = (amount: number): string => {
    if (!currency) return amount.toLocaleString()
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        maximumFractionDigits: amount >= 100 ? 0 : 2,
      }).format(amount)
    } catch {
      return `${currency} ${amount.toLocaleString()}`
    }
  }

  const getProductsData = async (currencyCode?: string) => {
    setCurrencyLoading(true)
    try {
      const deviceToken = typeof window !== 'undefined' ? localStorage.getItem('sn_device_token') ?? '' : ''
      const headers: Record<string, string> = { 'X-Device-Token': deviceToken }
      if (currencyCode) headers['X-Currency'] = currencyCode
      const res = await axios.get(backendUrl + '/api/v1/products', { headers })
      if (res.data.success) {
        const mapped = res.data.products.map((p: Product & { id?: string }) => ({ ...p, _id: String(p.id ?? p._id) })).reverse()
        setProducts(mapped)
        if (res.data.currency) setCurrencyLocal(res.data.currency)
      } else {
        toast.error(res.data.message ?? 'Failed to fetch products')
      }
    } catch {
      toast.error('Failed to fetch products')
    } finally {
      setCurrencyLoading(false)
    }
  }

  const getUserCart = async (t: string) => {
    try {
      const res = await axios.get(backendUrl + '/api/v1/user/cart', { headers: authHeaders(t) })
      if (res.data.success) setCartItems(res.data.cartData ?? {})
    } catch { /* silent — user may not be logged in */ }
  }

  const getUserData = async (t: string) => {
    try {
      const res = await axios.get(backendUrl + '/api/v1/auth/me', { headers: authHeaders(t) })
      if (res.data.success) {
        setUserData(res.data.data?.user ?? res.data.user ?? null)
      } else {
        toast.error(res.data.message ?? 'Failed to fetch user data')
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } }
      if (err.response?.status === 401) logout()
    }
  }

  const getUserProfile = async () => {
    if (!token) return null
    try {
      const res = await axios.get(backendUrl + '/api/v1/user/profile', { headers: authHeaders() })
      return res.data.success ? (res.data.user ?? res.data.data?.user ?? null) : null
    } catch {
      return null
    }
  }

  const updateUserProfile = async (profileData: unknown) => {
    if (!token) return { success: false, message: 'No authentication token' }
    try {
      const res = await axios.put(backendUrl + '/api/v1/user/profile', profileData, { headers: authHeaders() })
      if (res.data.success) {
        toast.success('Profile updated successfully!')
        getUserData(token)
        return { success: true }
      }
      toast.error(res.data.message ?? 'Failed to update profile')
      return { success: false, message: res.data.message }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      const msg = err.response?.data?.message ?? 'Please try again later'
      toast.error(msg)
      return { success: false, message: msg }
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    setUserData(null)
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(backendUrl + '/api/v1/auth/login', { email, password })
      if (res.data.success) {
        const payload = res.data.data ?? res.data
        const t = payload.token
        const user = payload.user
        setToken(t)
        setUserData(user)
        if (typeof window !== 'undefined') localStorage.setItem('token', t)
        toast.success('Login successful!')
        return { success: true }
      }
      toast.error(res.data.message ?? 'Login failed')
      return { success: false, message: res.data.message }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      const msg = err.response?.data?.message ?? 'Login failed'
      toast.error(msg)
      return { success: false, message: msg }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post(backendUrl + '/api/v1/auth/register', { name, email, password })
      if (res.data.success) {
        const payload = res.data.data ?? res.data
        const t = payload.token
        const user = payload.user
        setToken(t)
        setUserData(user)
        if (typeof window !== 'undefined') localStorage.setItem('token', t)
        toast.success('Registration successful!')
        return { success: true }
      }
      toast.error(res.data.message ?? 'Registration failed')
      return { success: false, message: res.data.message }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      const msg = err.response?.data?.message ?? 'Registration failed'
      toast.error(msg)
      return { success: false, message: msg }
    }
  }

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('sn_preferred_currency') : null
    if (saved) setCurrencyLocal(saved)
    getProductsData(saved ?? undefined)

    const handleCurrencyChange = (e: Event) => {
      const code = (e as CustomEvent<string>).detail
      if (code) {
        setCurrencyLocal(code)
        getProductsData(code)
      }
    }
    window.addEventListener('sn-currency-change', handleCurrencyChange)
    return () => window.removeEventListener('sn-currency-change', handleCurrencyChange)
  }, [])

  useEffect(() => {
    if (!token && typeof window !== 'undefined') {
      const stored = localStorage.getItem('token')
      if (stored) {
        setToken(stored)
        getUserCart(stored)
        getUserData(stored)
      }
    }
    if (token) {
      getUserCart(token)
      getUserData(token)
    }
  }, [token])

  return (
    <ShopContext.Provider
      value={{
        products, currency, displayPrice, currencyLoading, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, userData, setUserData,
        login, register, logout, getUserData,
        getUserProfile, updateUserProfile,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}
