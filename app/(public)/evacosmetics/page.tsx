'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import Title from '@/components/Title'
import ProductItem from '@/components/ProductItem'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '@/contexts/ShopContext'

export default function EvaCosmeticsPage() {
  const ctx = useContext(ShopContext)!
  const { products, search, showSearch } = ctx
  const [filterProducts, setFilterProducts] = useState<Product[]>([])
  const [sortType, setSortType] = useState('relevant')
  const [loading, setLoading] = useState(true)

  const applyFilter = () => {
    setLoading(true)
    let copy = products.slice()
    if (showSearch && search) {
      copy = copy.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    }
    copy = copy.filter(p => p.subCategory === 'Evacosmetics' || p.category?.toLowerCase().includes('cosmetic'))
    if (sortType === 'low-high') copy.sort((a, b) => a.price - b.price)
    else if (sortType === 'high-low') copy.sort((a, b) => b.price - a.price)
    setFilterProducts(copy)
    setTimeout(() => setLoading(false), 300)
  }

  useEffect(() => { applyFilter() }, [products, search, showSearch, sortType])

  return (
    <div className="pt-10 pb-16">
      <div className="flex justify-between items-center text-xs sm:text-xs mb-6">
        <Title text1="EVA" text2="COSMETICS" />
        <select className="border-2 border-gray-300 text-xs px-2 py-1 rounded" value={sortType} onChange={e => setSortType(e.target.value)}>
          <option value="relevant">Sort: Relevant</option>
          <option value="low-high">Sort: Low to High</option>
          <option value="high-low">Sort: High to Low</option>
        </select>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-gray-100 animate-pulse rounded h-64" />)}
        </div>
      ) : (
        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AnimatePresence>
            {filterProducts.map(item => (
              <motion.div key={item._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      {!loading && filterProducts.length === 0 && (
        <p className="text-center text-gray-500 py-20">No Eva Cosmetics products found.</p>
      )}
    </div>
  )
}
