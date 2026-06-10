'use client'

import { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { ShopContext } from '@/contexts/ShopContext'
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

function Pod({ section, products }: { section: Section; products: Product[] }) {
  const href = section.link ||
    (section.category
      ? `/category/${section.category.toLowerCase().replace(/\s+/g, '-')}`
      : '/collection')

  const catProducts = products
    .filter(p =>
      !section.category ||
      p.category?.toLowerCase() === section.category.toLowerCase() ||
      p.subCategory?.toLowerCase() === section.category.toLowerCase()
    )
    .slice(0, 4)

  // Pad to 4 slots
  const grid: (Product | null)[] = [...catProducts, ...Array(Math.max(0, 4 - catProducts.length)).fill(null)]

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      {/* Title */}
      <div className="px-3 pt-3 pb-1.5">
        <h3 className="font-extrabold text-gray-900 text-sm leading-tight">{section.title}</h3>
        {section.subtitle && (
          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{section.subtitle}</p>
        )}
      </div>

      {/* Content: feature image OR 2×2 product grid */}
      {section.image ? (
        <Link href={href} className="mx-2.5 mb-1 block">
          <div
            className="rounded-lg overflow-hidden flex items-center justify-center h-36 bg-gray-100"
            // eslint-disable-next-line react/forbid-dom-props
            {...(section.bg_color ? { style: { background: section.bg_color } } : {})}
          >
            <img
              src={imgUrl(section.image)!}
              alt={section.title}
              className="max-h-full max-w-full object-contain p-2 hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      ) : (
        <div className="grid grid-cols-2 gap-0.5 mx-2.5 mb-1">
          {grid.map((p, i) => (
            <Link
              key={p?._id ?? `empty-${i}`}
              href={p ? `/product?id=${p._id}` : href}
              className="aspect-square rounded-md overflow-hidden bg-gray-50 block"
            >
              {p?.image?.[0] ? (
                <img
                  src={imgUrl(p.image[0]) ?? ''}
                  alt={p.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
            </Link>
          ))}
        </div>
      )}

      {/* See more */}
      <div className="px-3 pb-3 mt-auto">
        <Link
          href={href}
          className="text-[11px] font-semibold text-primary hover:underline"
        >
          See more →
        </Link>
      </div>
    </div>
  )
}

function PodSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
      <div className="px-3 pt-3 pb-1.5">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-0.5 mx-2.5 mb-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-md animate-pulse" />
        ))}
      </div>
      <div className="px-3 pb-3">
        <div className="h-3 w-14 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  )
}

export default function CategoryPodsSection() {
  const { products } = useContext(ShopContext)!
  const [sections, setSections] = useState<Section[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    axios.get(`${BACKEND}/api/v1/featured-sections/active`)
      .then(r => setSections(r.data.sections ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && sections.length === 0) return null

  return (
    <section className="py-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <PodSkeleton key={i} />)
          : sections.map(s => <Pod key={s.id} section={s} products={products} />)
        }
      </div>
    </section>
  )
}
