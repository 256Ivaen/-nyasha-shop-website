import { Suspense } from 'react'
import SearchResults from '@/components/SearchResults'

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="pt-10 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-gray-100 animate-pulse rounded h-64" />)}
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
