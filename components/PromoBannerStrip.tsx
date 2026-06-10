'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

interface Banner {
  id: number
  title: string
  subtitle?: string
  link?: string
  image?: string
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

function imgUrl(path?: string) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BACKEND}/storage/${path}`
}

function BannerCard({ b, index }: { b: Banner; index: number }) {
  const inner = (
    <motion.div
      key={b.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative h-44 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-primary/70 group"
    >
      {imgUrl(b.image) && (
        <img
          src={imgUrl(b.image)!}
          alt={b.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent flex flex-col justify-end px-6 pb-5">
        <p className="text-white font-extrabold text-lg sm:text-xl leading-tight drop-shadow">{b.title}</p>
        {b.subtitle && <p className="text-white/75 text-xs mt-1 line-clamp-2">{b.subtitle}</p>}
        {b.link && (
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-white border border-white/60 rounded-full px-3 py-1 w-fit hover:bg-white hover:text-primary transition-colors">
            Shop Now →
          </span>
        )}
      </div>
    </motion.div>
  )

  return b.link ? <Link href={b.link} className="block">{inner}</Link> : inner
}

export default function PromoBannerStrip() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [page,    setPage]    = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${BACKEND}/api/v1/promo-banners/active`)
      .then(r => setBanners(r.data.banners ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Auto-advance every 6s — only when there are more than 2 banners
  useEffect(() => {
    if (banners.length <= 2) return
    const t = setInterval(() => {
      setPage(p => {
        const next = p + 2
        return next >= banners.length ? 0 : next
      })
    }, 6000)
    return () => clearInterval(t)
  }, [banners.length])

  if (!loading && banners.length === 0) return null

  if (loading) {
    return (
      <section className="py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-44 sm:h-56 rounded-2xl bg-gray-100 animate-pulse" />
          <div className="h-44 sm:h-56 rounded-2xl bg-gray-100 animate-pulse" />
        </div>
      </section>
    )
  }

  const totalPairs = Math.ceil(banners.length / 2)
  const pair = banners.slice(page, page + 2)

  return (
    <section className="py-4">
      <AnimatePresence mode="wait">
        <div key={page} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pair.map((b, i) => <BannerCard key={b.id} b={b} index={i} />)}
          {/* If odd number of banners, fill with first banner so grid stays full */}
          {pair.length === 1 && <BannerCard key={`fill-${banners[0].id}`} b={banners[0]} index={1} />}
        </div>
      </AnimatePresence>

      {/* Dots only when there are more banners than the current view can show */}
      {banners.length > 2 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: totalPairs }).map((_, i) => (
            <button
              key={i}
              type="button"
              title={`Banners ${i * 2 + 1}–${i * 2 + 2}`}
              onClick={() => setPage(i * 2)}
              className={`rounded-full transition-all ${Math.floor(page / 2) === i ? 'w-5 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-gray-300'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
