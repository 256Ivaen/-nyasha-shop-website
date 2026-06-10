import { Suspense } from 'react'
import ProductDetail from '@/components/ProductDetail'

// Only generate the `_` shell at build time.
// The real slug is read client-side from usePathname().
export function generateStaticParams() {
  return [{ slug: '_' }]
}

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div className="pt-10 pb-16 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    }>
      <ProductDetail />
    </Suspense>
  )
}
