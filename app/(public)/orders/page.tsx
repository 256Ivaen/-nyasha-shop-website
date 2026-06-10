'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import Title from '@/components/Title'
import axios from 'axios'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Button from '@/components/Button'

interface OrderItem {
  id?: string
  _id?: string
  name: string
  price: number
  quantity: number
  size: string
  image?: string[]
}

interface Order {
  id: string
  items: OrderItem[]
  amount: number
  status: string
  payment_method: string
  payment: boolean
  payment_status?: string
  date: string | number
  created_at?: string
}

const STATUS_STYLES: Record<string, string> = {
  'Delivered':        'bg-green-100 text-green-700',
  'Cancelled':        'bg-red-100 text-red-700',
  'Out for delivery': 'bg-blue-100 text-blue-700',
  'Shipped':          'bg-indigo-100 text-indigo-700',
  'Packing':          'bg-purple-100 text-purple-700',
  'Order Placed':     'bg-yellow-100 text-yellow-700',
}

export default function OrdersPage() {
  const ctx = useContext(ShopContext)!
  const { backendUrl, token, navigate, displayPrice } = ctx
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { navigate.push('/login'); return }
    const load = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/v1/orders/my', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data.success) {
          setOrders([...(res.data.orders ?? [])].reverse())
        } else {
          toast.error('Failed to load orders')
        }
      } catch {
        toast.error('Error loading orders')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  if (loading) {
    return (
      <div className="pt-14 pb-16">
        <div className="text-xs mb-6"><Title text1="MY" text2="ORDERS" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pt-14 pb-16">
      <div className="text-xs mb-6"><Title text1="MY" text2="ORDERS" /></div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-sm mb-4">You have no orders yet</p>
          <Button onClick={() => navigate.push('/collection')}>Start Shopping</Button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {orders.map(order => {
            const statusStyle = STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-700'
            const date = order.created_at
              ? new Date(order.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
              : typeof order.date === 'number'
                ? new Date(order.date * 1000).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
                : ''

            return (
              <motion.div
                key={order.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {/* Product image strip */}
                <div className="flex gap-1 p-3 pb-0">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                      {item.image?.[0] ? (
                        <Image src={item.image[0]} alt={item.name} fill className="object-cover" sizes="64px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">?</div>
                      )}
                    </div>
                  ))}
                  {(order.items?.length ?? 0) > 3 && (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-semibold shrink-0">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-grow gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-mono truncate">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{displayPrice(order.amount ?? 0)}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusStyle}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-500 space-y-0.5">
                    <p>{order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''} · {order.payment_method?.replace(/_/g, ' ')}</p>
                    {date && <p>{date}</p>}
                  </div>

                  <div className="flex items-center gap-1.5 mt-auto pt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${order.payment || order.payment_status === 'paid' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                    <span className="text-[10px] text-gray-500">
                      {order.payment || order.payment_status === 'paid' ? 'Paid' : 'Payment pending'}
                    </span>
                  </div>
                </div>

                {/* Items list */}
                {order.items && order.items.length > 0 && (
                  <div className="border-t border-gray-100 px-3 py-2 space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] text-gray-600">
                        <span className="truncate max-w-[60%]">{item.name}</span>
                        <span className="text-gray-400 shrink-0 ml-2">
                          x{item.quantity}{item.size && item.size !== 'default' ? ` · ${item.size}` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
