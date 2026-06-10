'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShopContext } from '@/contexts/ShopContext'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'

const SLIDE_DURATION = 6000 // ms per slide

interface HeroItem {
  id: number
  title: string
  description?: string
  link?: string
  overlay_text?: string
  button_text?: string
  button_link?: string
  active: boolean
  desktop_image?: string
  tablet_image?: string
  mobile_image?: string
}

export default function Hero() {
  const ctx = useContext(ShopContext)!
  const { backendUrl } = ctx

  const [heroes, setHeroes]             = useState<HeroItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading]           = useState(true)
  const [screenSize, setScreenSize]     = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [progress, setProgress]         = useState(0)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tickMs = 50 // progress update interval

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      setScreenSize(w >= 1024 ? 'desktop' : w >= 768 ? 'tablet' : 'mobile')
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        if (!backendUrl) { setLoading(false); return }
        const res = await axios.get(backendUrl + '/api/v1/heroes/active')
        if (res.data.success) {
          setHeroes(res.data.heroes ?? [])
        }
      } catch { /* no heroes */ }
      setLoading(false)
    }
    fetchHeroes()
  }, [backendUrl])

  // Auto-advance + progress bar
  useEffect(() => {
    if (heroes.length <= 1) return
    setProgress(0)
    if (progressRef.current) clearInterval(progressRef.current)

    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setCurrentIndex(i => (i + 1) % heroes.length)
          return 0
        }
        return p + (tickMs / SLIDE_DURATION) * 100
      })
    }, tickMs)

    return () => { if (progressRef.current) clearInterval(progressRef.current) }
  }, [heroes.length, currentIndex])

  const goTo = (idx: number) => {
    setCurrentIndex(idx)
    setProgress(0)
  }
  const prev = () => goTo((currentIndex - 1 + heroes.length) % heroes.length)
  const next = () => goTo((currentIndex + 1) % heroes.length)

  const getImage = (hero: HeroItem) => {
    if (screenSize === 'mobile') return hero.mobile_image ?? hero.tablet_image ?? hero.desktop_image
    if (screenSize === 'tablet') return hero.tablet_image ?? hero.desktop_image ?? hero.mobile_image
    return hero.desktop_image ?? hero.tablet_image ?? hero.mobile_image
  }

  const bleed = '-mx-4 sm:-mx-[5vw]'

  if (loading) {
    return <div className={`${bleed} hero-full bg-gray-100 animate-pulse`} />
  }

  if (heroes.length === 0) return null

  return (
    <div className={`${bleed} hero-full relative overflow-hidden bg-black`}>

      {/* ── Slides (crossfade — both visible during transition) ────── */}
      <AnimatePresence>
        {heroes.map((hero, i) =>
          i === currentIndex ? (
            <motion.div
              key={hero.id}
              className="absolute inset-0 hero-slide hero-kenburns"
              style={{ backgroundImage: `url(${getImage(hero)})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            />
          ) : null
        )}
      </AnimatePresence>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* ── Overlay text + CTA button ──────────────────────────────── */}
      {heroes[currentIndex]?.overlay_text && (
        <div className="absolute bottom-12 left-0 right-0 z-10 px-6 sm:px-10 flex items-end justify-between gap-4 pointer-events-none">
          <p className="text-white text-base sm:text-xl font-semibold leading-snug drop-shadow max-w-[55%]">
            {heroes[currentIndex].overlay_text}
          </p>
          {heroes[currentIndex].button_text && heroes[currentIndex].button_link && (
            <a
              href={heroes[currentIndex].button_link}
              className="pointer-events-auto shrink-0 bg-white text-black text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors shadow-lg"
            >
              {heroes[currentIndex].button_text}
            </a>
          )}
        </div>
      )}

      {/* ── Prev / Next arrows ─────────────────────────────────────── */}
      {heroes.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/25 border border-white/30 text-white backdrop-blur-sm transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/25 border border-white/30 text-white backdrop-blur-sm transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}


      {/* Preload images */}
      <div className="hidden" aria-hidden="true">
        {heroes.map((hero, i) => (
          <div key={i}>
            {hero.desktop_image && <img src={hero.desktop_image} alt="" />}
            {hero.tablet_image  && <img src={hero.tablet_image}  alt="" />}
            {hero.mobile_image  && <img src={hero.mobile_image}  alt="" />}
          </div>
        ))}
      </div>
    </div>
  )
}
