import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BASE = 'https://snluxeafrica.uk'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 1 },
    { url: `${BASE}/collection`,    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/new-arrivals`,  lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/bestsellers`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/discounted`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/about`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
