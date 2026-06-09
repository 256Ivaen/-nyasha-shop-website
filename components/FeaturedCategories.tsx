'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import axios from 'axios'

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

export default function FeaturedCategories() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    axios.get(`${BACKEND}/api/v1/featured-sections/active`)
      .then(r => setSections(r.data.sections ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && sections.length === 0) return null

  const imgUrl = (path?: string) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${BACKEND}/storage/${path}`
  }

  return (
    <section className="py-8 lg:py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900">Shop by Category</h2>
          <p className="text-xs text-gray-500 mt-0.5">Find exactly what you're looking for</p>
        </div>
        <Link href="/collection" className="text-xs font-semibold text-primary hover:underline">
          See all →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {sections.map((s, i) => {
            const href = s.link || (s.category ? `/collection?category=${encodeURIComponent(s.category)}` : '/collection')
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <Link
                  href={href}
                  className="block rounded-2xl overflow-hidden group hover:shadow-md transition-shadow"
                  style={{ background: s.bg_color ?? '#f3f4f6' }}
                >
                  <div className="h-28 flex items-center justify-center p-3">
                    {imgUrl(s.image) ? (
                      <img
                        src={imgUrl(s.image)!}
                        alt={s.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center">
                        <span className="text-xl">{s.title[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="px-3 pb-3 pt-1 bg-white/80 backdrop-blur-sm">
                    <p className="text-xs font-bold text-gray-900 truncate">{s.title}</p>
                    {s.subtitle && <p className="text-[10px] text-gray-500 truncate">{s.subtitle}</p>}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </section>
  )
}
