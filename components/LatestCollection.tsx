'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import Title from '@/components/Title'
import Button from '@/components/Button'
import ProductItem from '@/components/ProductItem'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Product } from '@/contexts/ShopContext'

export default function LatestCollection() {
  const ctx = useContext(ShopContext)!
  const { products } = ctx
  const [latest, setLatest] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (products.length > 0) {
      setLatest(products.slice(0, 10))
      setIsLoading(false)
    }
  }, [products])

  return (
    <section className="py-5 lg:py-10">
      <motion.div className="flex items-center justify-between mb-8 sm:mb-12"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <div>
          <Title text1="LATEST" text2="ARRIVALS" alignment="left" />
          <p className="text-gray-500 text-xs mt-1">Fresh new products added to our collection — be the first to shop them.</p>
        </div>
        <Link href="/collection" className="shrink-0 ml-4">
          <Button variant="outline" size="lg">VIEW ALL PRODUCTS</Button>
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-72" />
          ))}
        </div>
      ) : latest.length > 0 ? (
        <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          {latest.map(item => (
            <ProductItem key={item._id} id={item._id} slug={item.slug} name={item.name} image={item.image} price={item.price} />
          ))}
        </motion.div>
      ) : (
        <p className="text-center text-gray-400 py-12">No products available yet.</p>
      )}

    </section>
  )
}
