import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import CategoryPodsSection from '@/components/CategoryPodsSection'
import PromoBannerStrip from '@/components/PromoBannerStrip'
import LatestCollection from '@/components/LatestCollection'
import CategoryProductRow from '@/components/CategoryProductRow'
import BestSeller from '@/components/BestSeller'

export const metadata: Metadata = {
  title: 'Home | SN Luxe Africa',
  description: 'Shop quality products in Kampala. Trusted distributor delivering to your door.',
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

      {/* ── 7. CATEGORY ROWS ─────────────────────────────────────────────── */}
      <CategoryProductRow
        title="Eva Cosmetics"
        subtitle="Premium skincare & beauty"
        subCategory="Evacosmetics"
        viewAllHref="/evacosmetics"
        limit={8}
      />

      <CategoryProductRow
        title="Detergents & Cleaning"
        subtitle="Trusted brands for a clean home"
        category="detergents"
        viewAllHref="/detergents"
        limit={8}
      />

      {/* ── 8. TRUST BADGES + BESTSELLER GRID ───────────────────────────── */}
      <BestSeller />
    </>
  )
}
