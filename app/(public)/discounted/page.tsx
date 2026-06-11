import type { Metadata } from 'next'
import { Suspense } from 'react'
import DiscountedClient from './DiscountedClient'

export const metadata: Metadata = {
  title: 'Discounted Products | SN Luxe Africa',
  description: 'Shop discounted products at SN Luxe Africa — great deals every day.',
}

export default function DiscountedPage() {
  return <Suspense><DiscountedClient /></Suspense>
}
