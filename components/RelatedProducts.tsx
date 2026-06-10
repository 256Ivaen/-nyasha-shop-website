'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import Title from '@/components/Title'
import ProductItem from '@/components/ProductItem'
import type { Product } from '@/contexts/ShopContext'

interface RelatedProductsProps {
  category: string
  subCategory?: string
  currentId: string
}

export default function RelatedProducts({ category, subCategory, currentId }: RelatedProductsProps) {
  const ctx = useContext(ShopContext)!
  const { products } = ctx
  const [related, setRelated] = useState<Product[]>([])

  useEffect(() => {
    const found = products.filter(p => p._id !== currentId && (p.category === category || p.subCategory === subCategory))
    setRelated(found.slice(0, 5))
  }, [products, category, subCategory, currentId])

  if (related.length === 0) return null

  return (
    <section className="mt-16">
      <div className="text-center mb-8">
        <Title text1="RELATED" text2="PRODUCTS" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {related.map(item => (
          <ProductItem key={item._id} id={item._id} slug={item.slug} name={item.name} image={item.image} price={item.price} />
        ))}
      </div>
    </section>
  )
}
