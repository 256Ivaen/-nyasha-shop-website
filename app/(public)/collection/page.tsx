'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import { useStockLocation } from '@/contexts/StockLocationContext'
import Title from '@/components/Title'
import ProductItem from '@/components/ProductItem'
import Pagination from '@/components/Pagination'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '@/contexts/ShopContext'

const PER_PAGE = 8

export default function CollectionPage() {
  const ctx = useContext(ShopContext)!
  const { products, search, showSearch } = ctx
  const { stockLocation } = useStockLocation()
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<string[]>([])
  const [subCategory, setSubCategory] = useState<string[]>([])
  const [sortType, setSortType] = useState('relevant')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const toggleCategory = (val: string) =>
    setCategory(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val])

  const toggleSubCategory = (val: string) =>
    setSubCategory(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val])

  const applyFilter = () => {
    setLoading(true)
    let copy = products.slice()
    if (stockLocation !== 'all') copy = copy.filter(p => p.stock_location === stockLocation)
    if (showSearch && search) copy = copy.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (category.length > 0) copy = copy.filter(p => category.includes(p.category))
    if (subCategory.length > 0) copy = copy.filter(p => p.subCategory && subCategory.includes(p.subCategory))
    setFilterProducts(copy)
    setCurrentPage(1)
    setTimeout(() => setLoading(false), 300)
  }

  useEffect(() => { applyFilter() }, [products, category, subCategory, search, showSearch, stockLocation])

  useEffect(() => {
    let copy = filterProducts.slice()
    if (sortType === 'low-high') copy.sort((a, b) => a.price - b.price)
    else if (sortType === 'high-low') copy.sort((a, b) => b.price - a.price)
    else { applyFilter(); return }
    setFilterProducts(copy)
    setCurrentPage(1)
  }, [sortType])

  const totalPages = Math.ceil(filterProducts.length / PER_PAGE)
  const pageItems = filterProducts.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  return (
    <div className="pt-10 pb-16">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10">
        {/* Sidebar */}
        <div className="min-w-60">
          <p className="my-2 text-xs flex items-center cursor-pointer gap-2 font-semibold" onClick={() => setShowFilter(!showFilter)}>
            FILTERS
          </p>
          <div className={`${showFilter ? '' : 'hidden'} sm:block border border-gray-300 pl-5 py-3 mt-6`}>
            <p className="mb-3 text-xs font-medium">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-xs font-light text-gray-700">
              {['All', 'New Arrivals', 'Best Sellers'].map(cat => (
                <label key={cat} className="flex gap-2 cursor-pointer">
                  <input className="w-3" type="checkbox" value={cat} onChange={e => toggleCategory(e.target.value)} />
                  {cat}
                </label>
              ))}
            </div>
          </div>
          <div className={`${showFilter ? '' : 'hidden'} sm:block border border-gray-300 pl-5 py-3 my-5`}>
            <p className="mb-3 text-xs font-medium">TYPE</p>
            <div className="flex flex-col gap-2 text-xs font-light text-gray-700">
              {['Standard', 'Premium', 'Value'].map(brand => (
                <label key={brand} className="flex gap-2 cursor-pointer">
                  <input className="w-3" type="checkbox" value={brand} onChange={e => toggleSubCategory(e.target.value)} />
                  {brand}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="flex-1">
          <div className="flex justify-between items-center text-xs sm:text-xs mb-4">
            <Title text1="ALL" text2="COLLECTIONS" />
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">{filterProducts.length} products</span>
              <select title="Sort products" className="border-2 border-gray-300 text-xs px-2 py-1 rounded" value={sortType} onChange={e => setSortType(e.target.value)}>
                <option value="relevant">Sort: Relevant</option>
                <option value="low-high">Sort: Low to High</option>
                <option value="high-low">Sort: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: PER_PAGE }).map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded h-64" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence>
                {pageItems.map(item => (
                  <motion.div key={item._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <ProductItem id={item._id} slug={item.slug} image={item.image} name={item.name} price={item.price} sizes={item.sizes} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filterProducts.length === 0 && (
            <p className="text-center text-gray-500 py-20">No products found. Try adjusting your filters.</p>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
        </div>
      </div>
    </div>
  )
}
