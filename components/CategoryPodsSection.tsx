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
    <div className="bg-white rounded-xl border border-black shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden max-h-[220px]">
      {/* Title */}
      <div className="px-3 pt-3 pb-1.5">
        <h3 className="font-extrabold text-gray-900 text-sm leading-tight">{section.title}</h3>
        {section.subtitle && (
          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{section.subtitle}</p>
        )}
      </div>

      {/* Content: feature image OR 2×2 product grid — fills remaining card height */}
      <Link href={href} className="flex-1 block overflow-hidden">
        {section.image ? (
          <div
            className="w-full h-full min-h-36 overflow-hidden"
            // eslint-disable-next-line react/forbid-dom-props
            {...(section.bg_color ? { style: { background: section.bg_color } } : {})}
          >
            <img
              src={imgUrl(section.image)!}
              alt={section.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-0.5 h-full">
            {grid.map((p, i) => (
              <div key={p?._id ?? `empty-${i}`} className="overflow-hidden bg-gray-50">
                {p?.image?.[0] ? (
                  <img
                    src={imgUrl(p.image[0]) ?? ''}
                    alt={p.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
            ))}
          </div>
        )}
      </Link>
    </div>
  )
}

function PodSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-black shadow-sm flex flex-col overflow-hidden max-h-[220px]">
      <div className="px-3 pt-3 pb-1.5">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-0.5 flex-1 min-h-36">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-100 animate-pulse" />
        ))}
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
