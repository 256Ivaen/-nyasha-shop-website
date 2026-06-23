import type { Metadata } from 'next'
import HelpClient from './HelpClient'

export const metadata: Metadata = {
  title: 'Help & Support | SN Luxe Africa',
  description: 'Get help with your SN Luxe Africa order — returns, delivery, payments, tracking and more.',
}

export default function HelpPage() {
  return <HelpClient />
}
