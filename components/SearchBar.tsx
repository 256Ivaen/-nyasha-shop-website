'use client'

import { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ShopContext } from '@/contexts/ShopContext'
import { motion, AnimatePresence } from 'framer-motion'
import { assets } from '@/assets/assets'
import { Search, X } from 'lucide-react'
import axios from 'axios'

interface SearchProduct {
  _id?: string
  id?: string | number
  name: string
  price: number
  image: string[]
  category: string
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

export default function SearchBar() {
  const ctx = useContext(ShopContext)!
  const { search, setSearch, showSearch, setShowSearch, backendUrl, displayPrice } = ctx
  const router   = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [suggestions, setSuggestions] = useState<SearchProduct[]>([])
  const [loading,     setLoading]     = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (showSearch) inputRef.current?.focus()
  }, [showSearch])

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setSuggestions([]); return }
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('sn_device_token') ?? '' : ''
      const res = await axios.get(`${BACKEND}/api/v1/products/search`, {
        params: { q },
        headers: { 'X-Device-Token': token },
      })
      const products = (res.data.products ?? []).slice(0, 6).map((p: SearchProduct & { id?: string | number }) => ({
        ...p, _id: String(p._id ?? p.id ?? ''),
      }))
      setSuggestions(products)
    } catch {
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`)
      setShowSearch(false)
      setSuggestions([])
    }
  }

  const handleClose = () => {
    setShowSearch(false)
    setSuggestions([])
    setSearch('')
  }

  const imgUrl = (img: string) => {
    if (!img) return '/placeholder.png'
    if (img.startsWith('http')) return img
    return `${BACKEND}/storage/${img}`
  }

  return (
    <AnimatePresence>
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="bg-white border-b border-gray-200 shadow-sm"
        >
          <div className="px-4 sm:px-8 lg:px-16 py-3 max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-gray-300 transition-colors">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                value={search}
                onChange={handleChange}
                placeholder="Search products, categories..."
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
              />
              {search && (
                <button type="button" title="Clear search" onClick={() => { setSearch(''); setSuggestions([]) }} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
              <button type="button" title="Close search" onClick={handleClose} className="text-gray-400 hover:text-gray-600 pl-2 border-l border-gray-200">
                <X size={14} />
              </button>
            </form>

            {/* Live suggestions */}
            <AnimatePresence>
              {(suggestions.length > 0 || loading) && search.trim().length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg"
                >
                  {loading ? (
                    <div className="px-4 py-3 space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse shrink-0" />
                          <div className="flex-1 space-y-1">
                            <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                            <div className="h-2 bg-gray-100 rounded animate-pulse w-1/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {suggestions.map(p => (
                        <Link
                          key={p._id}
                          href={`/product?id=${p._id}`}
                          onClick={handleClose}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <img src={imgUrl(p.image?.[0])} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
                            <p className="text-[11px] text-gray-400">{p.category}</p>
                          </div>
                          <span className="text-xs font-bold text-primary shrink-0">{displayPrice(p.price)}</span>
                        </Link>
                      ))}
                      <button
                        type="submit"
                        form="search-form"
                        onClick={handleSubmit as unknown as React.MouseEventHandler}
                        className="w-full px-4 py-2.5 text-xs font-medium text-primary hover:bg-primary-subtle transition-colors text-center"
                      >
                        See all results for &ldquo;{search}&rdquo; →
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
