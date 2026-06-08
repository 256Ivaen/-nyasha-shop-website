import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/Hero'
import LatestCollection from '@/components/LatestCollection'
import BestSeller from '@/components/BestSeller'
import Button from '@/components/Button'

export const metadata: Metadata = {
  title: 'Home | SN Luxe Africa',
  description: 'Shop quality products in Kampala. Trusted distributor delivering to your door.',
}

export default function HomePage() {
  return (
    <>
      {/*
        Hero bleeds full-width and sits flush under the fixed navbar.
        -mx-4 sm:-mx-[5vw] cancels the <main> side padding (same bleed used in Hero.tsx).
        -mt-36 lg:-mt-44 cancels the <main> top padding so the hero starts right at the navbar bottom edge.
      */}
      <div className="-mt-36 lg:-mt-44">
        <Hero />
      </div>

      {/* ── CTA strip ─────────────────────────────────────────────────── */}
      <div className="pt-14 pb-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/collection">
          <Button size="lg">SHOP ALL PRODUCTS</Button>
        </Link>
        <Link href="/collection?sort=newest">
          <Button variant="outline" size="lg">NEW ARRIVALS</Button>
        </Link>
      </div>

      <div className="pt-8">
        <LatestCollection />
        <BestSeller />
      </div>
    </>
  )
}
