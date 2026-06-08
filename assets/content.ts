export const BRAND = {
  name:        'SN Luxe Africa',
  shortName:   'SN Luxe',
  tagline:     'Quality Products Delivered to Your Door',
  description: 'Your trusted distributor of quality products in Uganda.',
  logo:        '/assets/logo.svg',
  logoPng:     '/assets/logo.png',
  currency:    'UGX',
  currencySymbol: 'UGX ',
} as const

export const CONTACT = {
  phone:      '+256 700 000000',
  email:      'info@trtcl.com',
  address:    'Kampala, Uganda',
  fullAddress: 'Kampala, Uganda',
  hours:      '9:00 – 17:30, Monday – Sunday',
  whatsapp:   'https://wa.me/256700000000',
  instagram:  'https://www.instagram.com/trtcl',
  facebook:   'https://www.facebook.com/trtcl',
  tiktok:     'https://www.tiktok.com/@trtcl',
} as const

export const SITE = {
  url:        process.env.NEXT_PUBLIC_SITE_URL ?? 'https://trtcl.com',
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://backend.trtcl.com',
} as const

export const ANNOUNCEMENTS = [
  'FREE DELIVERY ON ALL ORDERS OVER UGX 100,000',
  'BECOME A VIP — SIGN UP TODAY TO GET 10% OFF!!',
  'SHOP THE LATEST ARRIVALS NOW',
] as const

export const NAV_LINKS = [
  { label: 'HOME',         href: '/' },
  { label: 'SHOP ALL',     href: '/collection' },
  { label: 'NEW ARRIVALS', href: '/collection?sort=newest' },
  { label: 'BEST SELLERS', href: '/collection?filter=bestseller' },
  { label: 'ABOUT',        href: '/about' },
  { label: 'CONTACT',      href: '/contact' },
] as const

export const FOOTER_QUICK_LINKS = [
  { label: 'Search',          href: '/search' },
  { label: 'All Products',    href: '/collection' },
  { label: 'New Arrivals',    href: '/collection?sort=newest' },
  { label: 'Best Sellers',    href: '/collection?filter=bestseller' },
  { label: 'About Us',        href: '/about' },
  { label: 'Contact',         href: '/contact' },
] as const

export const FOOTER_QUICK_SHOP = [
  { label: 'All Products',  href: '/collection' },
  { label: 'New Arrivals',  href: '/collection?sort=newest' },
  { label: 'Best Sellers',  href: '/collection?filter=bestseller' },
  { label: 'Cart',          href: '/cart' },
  { label: 'My Orders',     href: '/orders' },
] as const

export const TRUST_BADGES = [
  { title: '100% Authentic', desc: 'All products are genuine and quality-checked.' },
  { title: 'Fast Delivery',  desc: 'Quick delivery across Kampala and Uganda.' },
  { title: 'Easy Returns',   desc: '7-day hassle-free return policy.' },
  { title: '24/7 Support',   desc: 'We are always here to help you.' },
] as const

export const PRODUCT_GUARANTEES = [
  '100% Original Product',
  'Cash on delivery available',
  'Easy returns within 7 days',
] as const

export const SEO = {
  defaultTitle:       'Torit Customer Care | Quality Products in Uganda',
  defaultDescription: 'Shop quality products in Uganda. Trusted distributor in Kampala.',
  twitterHandle:      '@trtcl',
} as const
