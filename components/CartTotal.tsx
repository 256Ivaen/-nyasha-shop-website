'use client'

import { useContext } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import Title from '@/components/Title'

export default function CartTotal() {
  const ctx = useContext(ShopContext)!
  const { delivery_fee, getCartAmount } = ctx
  const { formatAmount } = useCurrency()
  const subtotal = getCartAmount()
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee

  return (
    <div className="bg-white p-6 rounded-xl border border-edge">
      <div className="mb-6">
        <Title text1="CART" text2="TOTALS" />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between py-3 border-b border-edge-light">
          <span className="text-ink-muted text-xs">Subtotal</span>
          <span className="font-medium text-ink text-xs">{formatAmount(subtotal)}</span>
        </div>
        <div className="flex justify-between py-3 border-b border-edge-light">
          <span className="text-ink-muted text-xs">Shipping Fee</span>
          <span className="font-medium text-ink text-xs">{formatAmount(delivery_fee)}</span>
        </div>
        <div className="flex justify-between py-4">
          <span className="text-xs font-bold text-ink">Total</span>
          <span className="text-xs font-bold text-ink">{formatAmount(total)}</span>
        </div>
      </div>
    </div>
  )
}
