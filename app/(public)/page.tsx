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
      {/* Hero — full-width, flush under navbar */}
      <div className="-mt-36 lg:-mt-44">
        <Hero />
      </div>

      {/* Amazon-style category pods (Comfy styles for her, for him, dog section, etc.)
          Managed entirely from Admin → Featured Sections with background removal */}
      <CategoryPodsSection />

      {/* Promo banner carousel */}
      <PromoBannerStrip />

      {/* Latest arrivals grid */}
      <LatestCollection />

      {/* Best Sellers horizontal scroll */}
      <CategoryProductRow
        title="Best Sellers"
        subtitle="Most loved by our customers"
        bestsellersOnly
        viewAllHref="/collection?filter=bestseller"
        limit={10}
      />

      {/* Eva Cosmetics horizontal scroll */}
      <CategoryProductRow
        title="Eva Cosmetics"
        subtitle="Premium skincare & beauty"
        subCategory="Evacosmetics"
        viewAllHref="/evacosmetics"
        limit={8}
      />

      {/* Detergents horizontal scroll */}
      <CategoryProductRow
        title="Detergents & Cleaning"
        subtitle="Trusted brands for a clean home"
        category="detergents"
        viewAllHref="/detergents"
        limit={8}
      />

      {/* Trust badges + full bestseller section */}
      <BestSeller />
    </>
  )
}
