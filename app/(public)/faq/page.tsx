import type { Metadata } from 'next'
import FaqClient from './FaqClient'

export const metadata: Metadata = {
  title: 'FAQs | SN Luxe Africa',
  description: 'Frequently asked questions about SN Luxe Africa — shipping, returns, payments and more.',
}

export default function FaqPage() {
  return <FaqClient />
}
