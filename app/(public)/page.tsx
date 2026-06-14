import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import CategoryPodsSection from '@/components/CategoryPodsSection'
import PromoBannerStrip from '@/components/PromoBannerStrip'
import LatestCollection from '@/components/LatestCollection'
import CategoryProductRow from '@/components/CategoryProductRow'
import BestSeller from '@/components/BestSeller'

export const metadata: Metadata = {
  title: 'Home | SN Luxe Africa',
  description: 'Authentic African print fashion delivered across the UK. Shop Ankara, Kente, Dashiki and more.',
}

export default function HomePage() {
  return (
    <>
      {/* ── 1. HERO — full-width, bleeds under navbar ─────────────────────── */}
      <div className="-mt-36 lg:-mt-44">
        <Hero />
      </div>

      <CategoryPodsSection />

      {/* ── 4. LATEST ARRIVALS — product grid ────────────────────────────── */}
      <LatestCollection />

      <PromoBannerStrip />

      {/* ── 5. BEST SELLERS — horizontal scroll ──────────────────────────── */}
      <CategoryProductRow
        title="Best Sellers"
        subtitle="Most loved by our customers"
        bestsellersOnly
        viewAllHref="/bestsellers"
        limit={10}
      />

      {/* ── 8. TRUST BADGES + BESTSELLER GRID ───────────────────────────── */}
      <BestSeller />
    </>
  )
}
