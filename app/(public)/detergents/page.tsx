'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import Title from '@/components/Title'
import ProductItem from '@/components/ProductItem'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '@/contexts/ShopContext'

export default function DetergentsPage() {
  const ctx = useContext(ShopContext)!
  const { products, search, showSearch } = ctx
  const [filterProducts, setFilterProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<string[]>([])
  const [sortType, setSortType] = useState('relevant')
  const [loading, setLoading] = useState(true)

  const toggleCategory = (val: string) =>
    setCategory(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val])

  const applyFilter = () => {
    setLoading(true)
    let copy = products.slice()
    if (showSearch && search) {
      copy = copy.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category.length > 0) copy = copy.filter(p => category.includes(p.category))
    // Show only Pearl / Apex detergent products
    copy = copy.filter(p => p.subCategory === 'Pearl' || p.subCategory === 'Apex' || p.category?.toLowerCase() === 'detergents')
    setFilterProducts(copy)
    setTimeout(() => setLoading(false), 300)
  }

  useEffect(() => { applyFilter() }, [products, category, search, showSearch])

  return (
    <div className="pt-10 pb-16">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10">
        <div className="min-w-60">
          <p className="my-2 text-xs font-semibold">DETERGENTS</p>
          <div className="border border-gray-300 pl-5 py-3 mt-6">
            <p className="mb-3 text-xs font-medium">BRANDS</p>
            <div className="flex flex-col gap-2 text-xs font-light text-gray-700">
              {['Pearl', 'Apex', 'Reem'].map(brand => (
                <label key={brand} className="flex gap-2 cursor-pointer">
                  <input className="w-3" type="checkbox" value={brand} onChange={e => toggleCategory(e.target.value)} />
                  {brand}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center text-xs sm:text-xs mb-4">
            <Title text1="OUR" text2="DETERGENTS" />
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
            <p className="text-center text-gray-500 py-20">No detergent products found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
