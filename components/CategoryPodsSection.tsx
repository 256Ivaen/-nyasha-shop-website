'use client'

import { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShopContext } from '@/contexts/ShopContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import axios from 'axios'
import type { Product } from '@/contexts/ShopContext'

interface Section {
  id: number
  title: string
  subtitle?: string
  category?: string
  link?: string
  image?: string
  bg_color?: string
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

function imgUrl(path?: string) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BACKEND}/storage/${path}`
}

function SectionPod({ section, products }: { section: Section; products: Product[] }) {
  const { formatAmount } = useCurrency()

  const href = section.link ||
    (section.category ? `/category/${encodeURIComponent(section.category.toLowerCase().replace(/\s+/g, '-'))}` : '/collection')

  // Pick up to 4 products from this section's category
  const catProducts = products
    .filter(p =>
      !section.category ||
      p.category?.toLowerCase() === section.category.toLowerCase() ||
      p.subCategory?.toLowerCase() === section.category.toLowerCase()
    )
    .slice(0, 4)

  const bgColor = section.bg_color ?? '#f3f4f6'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="font-extrabold text-gray-900 text-sm leading-tight">{section.title}</h3>
        {section.subtitle && <p className="text-xs text-gray-500 mt-0.5">{section.subtitle}</p>}
      </div>

      {/* Image or product grid */}
      {section.image ? (
        /* Full feature image (transparent-bg) on colored background */
        <Link href={href}>
          <div
            className="mx-3 mb-2 rounded-xl overflow-hidden flex items-center justify-center h-44"
            style={{ background: bgColor }}
          >
            <img
              src={imgUrl(section.image)!}
              alt={section.title}
              className="max-h-full max-w-full object-contain p-3 hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      ) : catProducts.length > 0 ? (
        /* 2×2 product image grid */
        <div className="grid grid-cols-2 gap-1 mx-3 mb-2">
          {(catProducts.length >= 4 ? catProducts : [...catProducts, ...Array(4 - catProducts.length).fill(null)]).map((p, i) => (
            <Link key={p?._id ?? `empty-${i}`} href={p ? `/product?id=${p._id}` : href}>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                {p ? (
                  <img
                    src={imgUrl(p.image?.[0]) ?? '/placeholder.png'}
                    alt={p.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Colored placeholder */
        <Link href={href}>
          <div className="mx-3 mb-2 rounded-xl h-44 flex items-center justify-center" style={{ background: bgColor }}>
            <span className="text-3xl font-extrabold text-white/60">{section.title[0]}</span>
          </div>
        </Link>
      )}

      {/* See more */}
      <div className="px-4 pb-4 mt-auto">
        <Link href={href} className="text-xs font-semibold text-primary hover:underline">
          See more →
        </Link>
      </div>
    </motion.div>
  )
}

export default function CategoryPodsSection() {
  const ctx = useContext(ShopContext)!
  const { products } = ctx

  const [sections, setSections] = useState<Section[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    axios.get(`${BACKEND}/api/v1/featured-sections/active`)
      .then(r => setSections(r.data.sections ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && sections.length === 0) return null

  if (loading) {
    return (
      <section className="py-6">
        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map(s => (
          <SectionPod key={s.id} section={s} products={products} />
        ))}
      </div>
    </section>
  )
}
