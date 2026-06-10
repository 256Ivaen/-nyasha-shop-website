import type { Metadata } from 'next'
import NewArrivalsClient from './NewArrivalsClient'

export const metadata: Metadata = {
  title: 'New Arrivals | SN Luxe Africa',
  description: 'Explore the latest new arrivals at SN Luxe Africa.',
}

export default function NewArrivalsPage() {
  return <NewArrivalsClient />
}
