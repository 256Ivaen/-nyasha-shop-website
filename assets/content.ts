export const BRAND = {
  name:           'SN Luxe Africa',
  shortName:      'SN Luxe',
  tagline:        'Authentic African Fashion Delivered Across the UK',
  description:    'SN Luxe Africa (snluxeafrica.uk) — your home for authentic African print fashion in the UK. Ankara, Kente, Kitenge, Dashiki and more — handcrafted and delivered to your door.',

  logo:           '/assets/SNlogo.png',
  currency:       'GBP',
  currencySymbol: '£',
  domain:         'snluxeafrica.uk',
  email:          'shop@snluxeafrica.uk',
} as const

export const CONTACT = {
  phone:       '+44 7398 277613',
  email:       'shop@snluxeafrica.uk',
  address:     'United Kingdom',
  fullAddress: 'United Kingdom',
  hours:       '09:00 – 17:00 Mon–Fri | 09:00 – 12:00 Sat | Sun & Public Holidays Closed',
  whatsapp:    'https://wa.me/447398277613',
  instagram:   'https://www.instagram.com/snluxeafrica',
  facebook:    'https://www.facebook.com/snluxeafrica',
  tiktok:      'https://www.tiktok.com/@snluxeafrica',
} as const

export const SITE = {
  url:        process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snluxeafrica.uk',
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? '',
} as const

export const ANNOUNCEMENTS = [
  'FREE UK DELIVERY ON ALL ORDERS OVER £75 — SHOP AT SNLUXEAFRICA.UK',
  'BECOME A VIP — SIGN UP TODAY TO GET 10% OFF',
  'SHOP THE LATEST ANKARA, KENTE & KITENGE ARRIVALS',
] as const

export const NAV_LINKS = [
  { label: 'HOME',         href: '/' },
  { label: 'SHOP ALL',     href: '/collection' },
  { label: 'NEW ARRIVALS', href: '/new-arrivals' },
  { label: 'BEST SELLERS', href: '/bestsellers' },
  { label: 'ABOUT',        href: '/about' },
  { label: 'CONTACT',      href: '/contact' },
] as const

export const FOOTER_QUICK_LINKS = [
  { label: 'Search',          href: '/search' },
  { label: 'All Products',    href: '/collection' },
  { label: 'New Arrivals',    href: '/new-arrivals' },
  { label: 'Best Sellers',    href: '/bestsellers' },
  { label: 'About Us',        href: '/about' },
  { label: 'Contact',         href: '/contact' },
] as const

export const FOOTER_QUICK_SHOP = [
  { label: 'All Products',  href: '/collection' },
  { label: 'New Arrivals',  href: '/new-arrivals' },
  { label: 'Best Sellers',  href: '/bestsellers' },
  { label: 'Sale',          href: '/discounted' },
  { label: 'Cart',          href: '/cart' },
  { label: 'My Orders',     href: '/orders' },
] as const

export const TRUST_BADGES = [
  { title: '100% Authentic',   desc: 'All fabrics and garments are genuine African print.' },
  { title: 'UK Fast Delivery', desc: 'Royal Mail delivery 2–4 working days across the UK.' },
  { title: 'Easy Returns',     desc: '30-day hassle-free return policy.' },
  { title: '24/7 Support',     desc: 'Email shop@snluxeafrica.uk or WhatsApp us anytime.' },
] as const

export const PRODUCT_GUARANTEES = [
  '100% Authentic African print fabric',
  'Cash on delivery available',
  'Easy returns within 30 days',
] as const

export const SEO = {
  defaultTitle:       'SN Luxe Africa | Authentic African Fashion in the UK — snluxeafrica.uk',
  defaultDescription: 'Shop authentic Ankara, Kente, Kitenge and Dashiki African print fashion at www.snluxeafrica.uk. UK fast delivery. Women, men, kids and accessories. Stock in UK & Zimbabwe.',
  keywords: [
    'SN Luxe Africa', 'snluxeafrica.uk', 'African fashion UK', 'Ankara UK',
    'Kente UK', 'Kitenge UK', 'Dashiki UK', 'African print clothing UK',
    'African print dress UK', 'African wear UK', 'buy African fabric UK',
    'African fashion store UK', 'UK African clothing', 'African print online UK',
    'Zimbabwe fashion UK', 'authentic African fashion', 'African clothing delivery UK',
    'African print skirt', 'African print top', 'African men fashion UK',
    'African kids clothing UK', 'African accessories UK',
  ],
  twitterHandle:      '@snluxeafrica',
} as const
