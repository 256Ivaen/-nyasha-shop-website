'use client'

import { useContext, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ShopContext } from '@/contexts/ShopContext'
import { motion, AnimatePresence } from 'framer-motion'
import { assets } from '@/assets/assets'
import Image from 'next/image'

export default function SearchBar() {
  const ctx = useContext(ShopContext)!
  const { search, setSearch, showSearch, setShowSearch } = ctx
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showSearch) inputRef.current?.focus()
  }, [showSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`)
      setShowSearch(false)
    }
  }

  return (
    <AnimatePresence>
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white border-b border-gray-200 py-3 px-4 sm:px-[5vw]"
        >
          <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-2xl mx-auto">
            <Image src={assets.search_icon} alt="search" width={18} height={18} className="opacity-50" />
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 outline-none text-xs text-gray-700 placeholder-gray-400"
            />
            <button type="button" onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-gray-600">
              <Image src={assets.cross_icon} alt="close" width={14} height={14} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
