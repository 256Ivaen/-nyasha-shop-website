'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import { useStockLocation } from '@/contexts/StockLocationContext'
import Title from '@/components/Title'
import ProductItem from '@/components/ProductItem'
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react'
import type { Product } from '@/contexts/ShopContext'

const badges = [
  { Icon: ShieldCheck, title: '100% Authentic', desc: 'All products are genuine and quality-checked.' },
  { Icon: Truck,       title: 'Fast Delivery',  desc: 'Quick delivery across the United Kingdom.' },
  { Icon: RotateCcw,   title: 'Easy Returns',   desc: '7-day hassle-free return policy.' },
  { Icon: Headphones,  title: '24/7 Support',   desc: 'We are always here to help you.' },
]

export default function BestSeller() {
  const ctx = useContext(ShopContext)!
  const { products, currencyLoading } = ctx
  const { stockLocation } = useStockLocation()
  const [bestSellers, setBestSellers] = useState<Product[]>([])

  useEffect(() => {
    if (currencyLoading) return
    let list = products.filter(p => p.bestseller)
    if (stockLocation !== 'all') list = list.filter(p => p.stock_location === stockLocation || p.stock_location === 'Both')
    setBestSellers(list.slice(0, 5))
  }, [products, stockLocation, currencyLoading])

  return (
    <section className="py-5 lg:py-10">
      <div className="mb-4">
        <Title text1="BEST" text2="SELLERS" alignment="left" />
        <p className="text-gray-500 text-xs mt-1">Our most loved products. Trusted by thousands of customers.</p>
      </div>

      {currencyLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-72" />)}
        </div>
      ) : bestSellers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.map(item => (
            <ProductItem key={item._id} id={item._id} slug={item.slug} name={item.name} image={item.image} price={item.price} bestseller />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-900 text-sm font-semibold">No bestsellers found</p>
          <p className="text-gray-400 text-xs mt-1">Try switching to a different stock location.</p>
        </div>
      )}

      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
        {badges.map(({ Icon, title, desc }) => (
          <div key={title} className="bg-white p-6 rounded-xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-full bg-primary-subtle text-primary flex items-center justify-center mx-auto mb-3">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 text-xs mb-1">{title}</h3>
            <p className="text-xs text-gray-500">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
