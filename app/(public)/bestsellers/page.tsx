import type { Metadata } from 'next'
import { Suspense } from 'react'
import BestsellersClient from './BestsellersClient'

export const metadata: Metadata = {
  title: 'Best Sellers | SN Luxe Africa',
  description: 'Shop our most-loved bestselling products at SN Luxe Africa.',
}

export default function BestsellersPage() {
  return <Suspense><BestsellersClient /></Suspense>
}
