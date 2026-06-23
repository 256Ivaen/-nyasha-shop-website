'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import { useStockLocation } from '@/contexts/StockLocationContext'
import ProductItem from '@/components/ProductItem'
import Pagination from '@/components/Pagination'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '@/contexts/ShopContext'

const PER_PAGE = 8

export default function BestsellersClient() {
  const ctx = useContext(ShopContext)!
  const { products, search, showSearch, currencyLoading } = ctx
  const { stockLocation } = useStockLocation()

  const [filtered,    setFiltered]    = useState<Product[]>([])
  const [sortType,    setSortType]    = useState('relevant')
  const [currentPage, setCurrentPage] = useState(1)
  const [seenData,    setSeenData]    = useState(false)

  useEffect(() => {
    let list = products.filter(p => p.bestseller)
    if (stockLocation !== 'all') list = list.filter(p => p.stock_location === stockLocation || p.stock_location === 'Both')
    if (showSearch && search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (sortType === 'low-high') list = [...list].sort((a, b) => a.price - b.price)
    else if (sortType === 'high-low') list = [...list].sort((a, b) => b.price - a.price)
    else if (sortType === 'newest') list = [...list].reverse()
    setFiltered(list)
    setCurrentPage(1)
    if (!currencyLoading) setSeenData(true)
  }, [products, sortType, search, showSearch, stockLocation, currencyLoading])

  const showSkeleton = !seenData && currencyLoading
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const pageItems  = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  return (
    <div className="pt-4 pb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Best Sellers</h1>
          {!showSkeleton && (
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

      {showSkeleton ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: PER_PAGE }).map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-64" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-900 text-sm font-semibold">No bestsellers found</p>
          <p className="text-gray-400 text-xs mt-1">Try switching to a different stock location.</p>
        </div>
      ) : (
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AnimatePresence>
            {pageItems.map(p => (
              <motion.div key={p._id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ProductItem id={p._id} slug={p.slug} image={p.image} name={p.name} price={p.price} bestseller={p.bestseller} sizes={p.sizes} />
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
