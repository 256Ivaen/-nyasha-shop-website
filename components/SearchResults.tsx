'use client'

import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ShopContext } from '@/contexts/ShopContext'
import ProductItem from '@/components/ProductItem'
import type { Product } from '@/contexts/ShopContext'

export default function SearchResults() {
  const params = useSearchParams()
  const query = params.get('q') ?? ''
  const ctx = useContext(ShopContext)!
  const { products } = ctx
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query.trim() || !products.length) { setLoading(false); return }
    setLoading(true)
    const term = query.toLowerCase().trim()
    const found = products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term)
    )
    found.sort((a, b) => {
      const aMatch = a.name.toLowerCase().includes(term) ? 1 : 0
      const bMatch = b.name.toLowerCase().includes(term) ? 1 : 0
      return bMatch - aMatch
    })
    setResults(found)
    setLoading(false)
  }, [query, products])

  return (
    <div className="pt-10 pb-16">
      <div className="mb-6">
        <h1 className="text-xs font-bold text-gray-900">
          {query ? `Search results for "${query}"` : 'Search Products'}
        </h1>
        {!loading && query && (
          <p className="text-xs text-gray-500 mt-1">{results.length} product{results.length !== 1 ? 's' : ''} found</p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-gray-100 animate-pulse rounded h-64" />)}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map(p => (
            <ProductItem key={p._id} id={p._id} image={p.image} name={p.name} price={p.price} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xs">{query ? `No results for "${query}"` : 'Enter a search term above'}</p>
        </div>
      )}
    </div>
  )
}
