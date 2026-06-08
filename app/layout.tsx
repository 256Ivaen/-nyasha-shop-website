import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import ShopContextProvider from '@/contexts/ShopContext'
import { BRAND, SITE_URL } from '@/assets/assets'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} | ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: `Shop quality products in Kampala. Visit ${BRAND.name} for trusted products delivered to your door.`,
  keywords: [
    BRAND.name, 'quality products Uganda', 'Kampala shopping',
    'Uganda online store', 'Kampala delivery',
  ],
  authors: [{ name: BRAND.name, url: SITE_URL }],
  creator: BRAND.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: BRAND.name,
    title: `${BRAND.name} | ${BRAND.tagline}`,
    description: `Quality products in Kampala, Uganda. Fast delivery, trusted distributor.`,
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} | ${BRAND.tagline}`,
    description: `Quality products in Kampala, Uganda. Fast delivery, trusted distributor.`,
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className={`${manrope.className} bg-white text-gray-900`} suppressHydrationWarning>
        <ShopContextProvider>
          <Toaster position="top-center" richColors closeButton />
          {children}
        </ShopContextProvider>
      </body>
    </html>
  )
}
