'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'

interface Banner {
  id: number
  title: string
  subtitle?: string
  link?: string
  image?: string
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

export default function PromoBannerStrip() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${BACKEND}/api/v1/promo-banners/active`)
      .then(r => setBanners(r.data.banners ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(() => setCurrent(i => (i + 1) % banners.length), 5000)
    return () => clearInterval(t)
  }, [banners.length])

  if (!loading && banners.length === 0) return null
  if (loading) return <div className="h-40 sm:h-52 rounded-2xl bg-gray-100 animate-pulse my-6" />

  const imgUrl = (path?: string) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${BACKEND}/storage/${path}`
  }

  const b = banners[current]

  const inner = (
    <div className="relative h-40 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary/70">
      {imgUrl(b.image) && (
        <img src={imgUrl(b.image)!} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex flex-col justify-center px-8">
        <p className="text-white font-extrabold text-xl sm:text-2xl drop-shadow">{b.title}</p>
        {b.subtitle && <p className="text-white/80 text-sm mt-1">{b.subtitle}</p>}
        {b.link && (
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-white border border-white/60 rounded-full px-3 py-1 w-fit hover:bg-white hover:text-primary transition-colors">
            Shop Now →
          </span>
        )}
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              title={`Banner ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${i === current ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      )}

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <button
            type="button"
            title="Previous banner"
            onClick={() => setCurrent(i => (i - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            title="Next banner"
            onClick={() => setCurrent(i => (i + 1) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}
    </div>
  )

  return (
    <section className="py-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {b.link ? <Link href={b.link}>{inner}</Link> : inner}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
