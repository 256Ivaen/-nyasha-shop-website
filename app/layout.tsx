import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import ShopContextProvider from '@/contexts/ShopContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
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
  description: `Authentic African print fashion delivered across the UK. Visit ${BRAND.name} for Ankara, Kente and Dashiki styles.`,
  keywords: [
    BRAND.name, 'African fashion UK', 'Ankara fabric UK',
    'African print clothing', 'Kente UK', 'African wear',
  ],
  authors: [{ name: BRAND.name, url: SITE_URL }],
  creator: BRAND.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: BRAND.name,
    title: `${BRAND.name} | ${BRAND.tagline}`,
    description: `Authentic African print fashion delivered across the UK. Ankara, Kente, Dashiki and more.`,
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} | ${BRAND.tagline}`,
    description: `Authentic African print fashion delivered across the UK. Ankara, Kente, Dashiki and more.`,
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
        <CurrencyProvider>
          <ShopContextProvider>
            <Toaster position="top-center" richColors closeButton />
            {children}
          </ShopContextProvider>
        </CurrencyProvider>
      </body>
    </html>
  )
}
