'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductItem from '@/components/ProductItem'
import axios from 'axios'

interface Product {
  _id: string
  id?: string | number
  name: string
  price: number
  image: string[]
  category: string
  bestseller?: boolean
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

export default function SearchResults() {
  const params   = useSearchParams()
  const query    = params.get('q') ?? ''
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    setLoading(true)
    const token = typeof window !== 'undefined' ? localStorage.getItem('sn_device_token') ?? '' : ''
    axios.get(`${BACKEND}/api/v1/products/search`, {
      params: { q: query },
      headers: { 'X-Device-Token': token },
    })
      .then(r => {
        const mapped = (r.data.products ?? []).map((p: Product) => ({
          ...p, _id: String(p._id ?? p.id ?? ''),
        }))
        setResults(mapped)
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [query])

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
            <ProductItem key={p._id} id={p._id} image={p.image} name={p.name} price={p.price} bestseller={p.bestseller} />
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
