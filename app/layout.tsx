import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import ShopContextProvider from '@/contexts/ShopContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { StockLocationProvider } from '@/contexts/StockLocationContext'
import { BRAND, SITE_URL } from '@/assets/assets'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://snluxeafrica.uk'),
  title: {
    default: `${BRAND.name} | ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: `SN Luxe Africa — shop authentic Ankara, Kente, Kitenge, Dashiki and African print fashion online in the UK. Fast UK delivery. Stock held in the UK and Zimbabwe. Visit us at snluxeafrica.uk`,
  keywords: [
    'SN Luxe Africa', 'snluxeafrica.uk', 'African fashion UK', 'Ankara fabric UK',
    'African print clothing UK', 'Kente UK', 'Kitenge UK', 'Dashiki UK',
    'African wear UK', 'African print dress UK', 'African clothing online UK',
    'African fashion store UK', 'UK African fashion', 'buy Ankara UK',
    'African print skirt', 'African print top', 'African print men UK',
    'African print kids UK', 'African accessories UK', 'African fabric UK',
    'Zimbabwe fashion UK', 'authentic African fashion', 'African clothing delivery UK',
  ],
  authors: [{ name: BRAND.name, url: SITE_URL }],
  creator: BRAND.name,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: BRAND.name,
    title: `${BRAND.name} | Authentic African Fashion in the UK`,
    description: `Shop Ankara, Kente, Kitenge, Dashiki and African print clothing online. UK fast delivery. Stock in UK & Zimbabwe. Shop now at snluxeafrica.uk`,
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: `${BRAND.name} — African Fashion UK` }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@snluxeafrica',
    creator: '@snluxeafrica',
    title: `${BRAND.name} | Authentic African Fashion in the UK`,
    description: `Shop Ankara, Kente, Kitenge, Dashiki and African print clothing online. UK fast delivery. snluxeafrica.uk`,
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [{ url: '/assets/favicon.png', type: 'image/png' }],
    shortcut: '/assets/favicon.png',
    apple: '/assets/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className={`${manrope.className} bg-white text-gray-900`} suppressHydrationWarning>
        <CurrencyProvider>
          <StockLocationProvider>
            <ShopContextProvider>
              <Toaster position="top-center" richColors closeButton />
              {children}
            </ShopContextProvider>
          </StockLocationProvider>
        </CurrencyProvider>
      </body>
    </html>
  )
}
