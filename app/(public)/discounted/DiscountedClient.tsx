'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import { useStockLocation } from '@/contexts/StockLocationContext'
import ProductItem from '@/components/ProductItem'
import Pagination from '@/components/Pagination'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '@/contexts/ShopContext'

const PER_PAGE = 8

export default function DiscountedClient() {
  const ctx = useContext(ShopContext)!
  const { products, search, showSearch } = ctx
  const { stockLocation } = useStockLocation()

  const [filtered,    setFiltered]    = useState<Product[]>([])
  const [sortType,    setSortType]    = useState('relevant')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    if (!products.length) return
    setLoading(true)
    let list = products.filter(p => p.discounted)
    if (stockLocation !== 'all') list = list.filter(p => (p.stock_location ?? 'UK') === stockLocation)
    if (showSearch && search) {
      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (sortType === 'low-high') list = [...list].sort((a, b) => a.price - b.price)
    else if (sortType === 'high-low') list = [...list].sort((a, b) => b.price - a.price)
    else if (sortType === 'newest') list = [...list].reverse()
    setFiltered(list)
    setCurrentPage(1)
    setTimeout(() => setLoading(false), 200)
  }, [products, sortType, search, showSearch, stockLocation])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const pageItems  = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  return (
    <div className="pt-4 pb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Discounted Products</h1>
          {!loading && (
            <p className="text-xs text-gray-500 mt-1">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
          )}
        </div>
        <select
          title="Sort products"
          value={sortType}
          onChange={e => setSortType(e.target.value)}
          className="border border-gray-200 text-xs px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          <option value="relevant">Relevant</option>
          <option value="newest">Newest</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: PER_PAGE }).map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-64" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-sm font-medium">No discounted products at the moment</p>
          <a href="/collection" className="mt-4 inline-block text-xs font-semibold text-primary underline">Browse all products</a>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <AnimatePresence>
            {pageItems.map(p => (
              <motion.div key={p._id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ProductItem
                  id={p._id}
                  slug={p.slug}
                  image={p.image}
                  name={p.name}
                  price={p.discount_price ?? p.price}
                  originalPrice={p.discount_price ? p.price : undefined}
                  bestseller={p.bestseller}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
      />
    </div>
  )
}
