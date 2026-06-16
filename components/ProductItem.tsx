'use client'

import { useContext, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ShopContext } from '@/contexts/ShopContext'
import Button from '@/components/Button'

interface ProductItemProps {
  id: string
  image: string[]
  name: string
  price: number
  bestseller?: boolean
  originalPrice?: number
  sizes?: string[]
}

export default function ProductItem({ id, image, name, price, bestseller, originalPrice, sizes }: ProductItemProps) {
  const ctx = useContext(ShopContext)!
  const { addToCart, cartItems, updateQuantity, displayPrice, navigate } = ctx
  const [isUpdating, setIsUpdating] = useState(false)

  const cartItem = cartItems[id]
  const isInCart = cartItem && Object.values(cartItem).some(qty => qty > 0)
  const totalQuantity = cartItem ? Object.values(cartItem).reduce((t, q) => t + q, 0) : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (sizes && sizes.length > 0) {
      navigate.push(`/product?id=${id}`)
      return
    }
    setIsUpdating(true)
    await new Promise(r => setTimeout(r, 300))
    addToCart(id)
    toast.success('Added to cart!', {
      description: `${name} has been added to your cart`,
      duration: 2500,
      action: { label: 'View Cart', onClick: () => navigate.push('/cart') },
    })
    setIsUpdating(false)
  }

  const handleQuantityChange = async (e: React.MouseEvent, action: 'increase' | 'decrease') => {
    e.preventDefault()
    e.stopPropagation()
    setIsUpdating(true)
    await new Promise(r => setTimeout(r, 200))
    if (action === 'increase') {
      addToCart(id)
    } else if (cartItem) {
      const sizeKey = Object.keys(cartItem).find(s => cartItem[s] > 0)
      if (sizeKey) updateQuantity(id, sizeKey, cartItem[sizeKey] - 1)
    }
    setIsUpdating(false)
  }

  return (
    <motion.div
      className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full border border-edge hover:border-edge-dark"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/product?id=${id}`} className="flex flex-col flex-grow">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {bestseller && (
            <span className="bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full">Bestseller</span>
          )}
          {originalPrice !== undefined && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Sale</span>
          )}
          {isInCart && (
            <span className="bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full">In Cart ({totalQuantity})</span>
          )}
        </div>

        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-50">
          <Image
            src={image?.[0] ?? '/placeholder.png'}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-400"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Quick add button */}
          <motion.button
            className={`absolute top-3 right-3 rounded-full w-9 h-9 flex items-center justify-center z-10 transition-colors border border-edge ${isInCart ? 'bg-primary text-white border-primary' : 'bg-white text-primary hover:bg-primary-subtle'}`}
            onClick={handleAddToCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : isInCart ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </motion.button>
        </div>

        {/* Info */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-xs font-medium text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">{name}</h3>
          
          {sizes && sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {sizes.map(s => (
                <span key={s} className="px-1.5 py-0.5 border border-edge rounded text-[9px] font-medium text-gray-500 uppercase">
                  {s}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-primary font-bold text-xs">{displayPrice(parseFloat(String(price)))}</span>
              {originalPrice !== undefined && (
                <span className="text-gray-400 line-through text-[10px]">{displayPrice(parseFloat(String(originalPrice)))}</span>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <svg className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs text-gray-500">4.5</span>
            </div>
          </div>

        </div>
      </Link>

      {/* Cart actions — VIEW left (flex-1) | ADD/qty right (fixed square) */}
      <div className="px-3 pb-3 flex items-center gap-2">
        <Link href={`/product?id=${id}`} className="flex-1 min-w-0">
          <Button variant="outline" fullWidth size="sm">VIEW</Button>
        </Link>

        {isInCart ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={e => handleQuantityChange(e, 'decrease')}
              disabled={isUpdating}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-edge-light border border-edge text-ink hover:bg-edge disabled:opacity-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-xs font-bold text-ink w-4 text-center tabular-nums">{totalQuantity}</span>
            <button
              type="button"
              onClick={e => handleQuantityChange(e, 'increase')}
              disabled={isUpdating}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-primary text-white hover:bg-primary-hover disabled:opacity-50 transition-colors"
              aria-label="Increase quantity"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isUpdating}
            aria-label="Add to cart"
            className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-primary text-white hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            {isUpdating ? (
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        )}
      </div>
    </motion.div>
  )
}
