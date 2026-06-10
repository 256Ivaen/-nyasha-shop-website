'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ShopContext } from '@/contexts/ShopContext'
import ProductItem from '@/components/ProductItem'
import Button from '@/components/Button'
import type { Product } from '@/contexts/ShopContext'

interface Props {
  title: string
  subtitle?: string
  category?: string
  subCategory?: string
  bestsellersOnly?: boolean
  viewAllHref?: string
  limit?: number
}

export default function CategoryProductRow({ title, subtitle, category, subCategory, bestsellersOnly, viewAllHref, limit = 8 }: Props) {
  const ctx = useContext(ShopContext)!
  const { products } = ctx
  const [items, setItems]   = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!products.length) return
    let list = products.slice()
    if (bestsellersOnly) list = list.filter(p => !!p.bestseller)
    if (category)        list = list.filter(p => p.category?.toLowerCase() === category.toLowerCase())
    if (subCategory)     list = list.filter(p => p.subCategory === subCategory || p.category?.toLowerCase().includes(subCategory.toLowerCase()))
    setItems(list.slice(0, limit))
    setLoading(false)
  }, [products, category, subCategory, bestsellersOnly, limit])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
  }

  if (!loading && items.length === 0) return null

  const href = viewAllHref ?? (category ? `/collection?category=${encodeURIComponent(category)}` : '/collection')

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-extrabold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Scroll left"
            onClick={() => scroll('left')}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            title="Scroll right"
            onClick={() => scroll('right')}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={14} />
          </button>
          <Link href={href}>
            <Button variant="outline" size="lg">View All</Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-44 shrink-0 h-64 bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map(p => (
            <div key={p._id} className="w-44 sm:w-48 shrink-0">
              <ProductItem id={p._id} image={p.image} name={p.name} price={p.price} bestseller={p.bestseller} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
