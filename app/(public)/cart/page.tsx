'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import Title from '@/components/Title'
import CartTotal from '@/components/CartTotal'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import type { Product } from '@/contexts/ShopContext'
import Button from '@/components/Button'

interface CartEntry {
  _id: string
  size: string
  quantity: number
  name: string
  price: number
  image: string
}

export default function CartPage() {
  const ctx = useContext(ShopContext)!
  const { products, currency, cartItems, updateQuantity, navigate } = ctx
  const [cartData, setCartData] = useState<CartEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (products.length > 0) {
      const temp: CartEntry[] = []
      for (const [id, sizes] of Object.entries(cartItems)) {
        for (const [size, qty] of Object.entries(sizes)) {
          if (qty > 0) {
            const p = products.find(prod => prod._id === id)
            if (p) temp.push({ _id: id, size, quantity: qty, name: p.name, price: p.price, image: p.image?.[0] ?? '' })
          }
        }
      }
      setCartData(temp)
      setLoading(false)
    }
  }, [cartItems, products])

  const handleRemove = async (id: string, size: string) => {
    await updateQuantity(id, size, 0)
    toast.success('Item removed from cart')
  }

  if (loading) {
    return (
      <div className="pt-14 min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="pt-14 pb-16">
      <div className="text-xs mb-6">
        <Title text1="YOUR" text2="CART" />
      </div>

      {cartData.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xs mb-4">Your cart is empty</p>
          <Button onClick={() => navigate.push('/collection')}>Continue Shopping</Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div className="flex-1 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AnimatePresence>
              {cartData.map(item => (
                <motion.div key={`${item._id}-${item.size}`}
                  layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -200 }}
                  className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image || assets.logo} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.size !== 'default' ? `Size: ${item.size}` : ''}</p>
                    <p className="font-semibold text-primary mt-1">{currency} {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button type="button" className="px-2 py-1 text-gray-600 hover:text-gray-900" onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}>−</button>
                    <span className="px-3 py-1 text-xs">{item.quantity}</span>
                    <button type="button" className="px-2 py-1 text-gray-600 hover:text-gray-900" onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}>+</button>
                  </div>
                  <button type="button" onClick={() => handleRemove(item._id, item.size)} className="p-2 text-red-500 hover:text-red-700">
                    <Image src={assets.bin_icon} alt="remove" width={18} height={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="w-full lg:w-80">
            <div className="sticky top-20">
              <CartTotal />
              <Button onClick={() => navigate.push('/place-order')} fullWidth size="lg" className="mt-4">
                PROCEED TO CHECKOUT
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
