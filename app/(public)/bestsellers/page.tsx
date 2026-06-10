import type { Metadata } from 'next'
import BestsellersClient from './BestsellersClient'

export const metadata: Metadata = {
  title: 'Best Sellers | SN Luxe Africa',
  description: 'Shop our most-loved bestselling products at SN Luxe Africa.',
}

export default function BestsellersPage() {
  return <BestsellersClient />
}
