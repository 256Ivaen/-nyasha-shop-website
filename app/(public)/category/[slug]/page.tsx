import type { Metadata } from 'next'
import CategoryPageClient from './CategoryPageClient'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const fallback = ['women', 'men', 'kids', 'beauty', 'detergents', 'home', 'pets', 'accessories']
  try {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''
    if (!backend) return fallback.map(slug => ({ slug }))
    const res = await fetch(`${backend}/api/v1/categories`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      const cats: { slug?: string; name?: string }[] = data.categories ?? []
      if (cats.length > 0) {
        return cats.map(c => ({ slug: c.slug ?? (c.name ?? '').toLowerCase().replace(/\s+/g, '-') }))
      }
    }
  } catch {}
  return fallback.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const name = decodeURIComponent(slug).replace(/-/g, ' ')
  return {
    title: `${name} | SN Luxe Africa`,
    description: `Shop all ${name} products at SN Luxe Africa.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  return <CategoryPageClient slug={decodeURIComponent(slug)} />
}
