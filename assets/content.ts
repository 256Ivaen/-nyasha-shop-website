export const BRAND = {
  name:           'SN Luxe Africa',
  shortName:      'SN Luxe',
  tagline:        'Authentic African Fashion Delivered Across the UK',
  description:    'Your home for authentic African print fashion in the UK. Ankara, Kente, Kitenge, Dashiki and more — handcrafted and delivered to your door.',
  logo:           '/assets/SNlogo.png',
  currency:       'GBP',
  currencySymbol: '£',
} as const

export const CONTACT = {
  phone:       '+44 7398 277613',
  email:       'snluxeafrica@gmail.com',
  address:     'United Kingdom',
  fullAddress: 'United Kingdom',
  hours:       '9:00 – 18:00, Monday – Saturday',
  whatsapp:    'https://wa.me/447398277613',
  instagram:   'https://www.instagram.com/snluxeafrica',
  facebook:    'https://www.facebook.com/snluxeafrica',
  tiktok:      'https://www.tiktok.com/@snluxeafrica',
} as const

export const SITE = {
  url:        process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snluxeafrica.com',
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? '',
} as const

export const ANNOUNCEMENTS = [
  'FREE UK DELIVERY ON ALL ORDERS OVER £75',
  'BECOME A VIP — SIGN UP TODAY TO GET 10% OFF',
  'SHOP THE LATEST ANKARA & KENTE ARRIVALS',
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
  { title: '24/7 Support',     desc: 'Email or WhatsApp us anytime.' },
] as const

export const PRODUCT_GUARANTEES = [
  '100% Authentic African print fabric',
  'Cash on delivery available',
  'Easy returns within 30 days',
] as const

export const SEO = {
  defaultTitle:       'SN Luxe Africa | Authentic African Fashion in the UK',
  defaultDescription: 'Shop authentic Ankara, Kente, Kitenge and Dashiki fashion. UK delivery. Women, men, kids and accessories.',
  twitterHandle:      '@snluxeafrica',
} as const
