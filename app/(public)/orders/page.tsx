'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import Title from '@/components/Title'
import axios from 'axios'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Button from '@/components/Button'

interface OrderItem {
  _id: string
  name: string
  price: number
  quantity: number
  size: string
  image?: string[]
}

interface Order {
  _id: string
  items: OrderItem[]
  amount: number
  status: string
  paymentMethod: string
  payment: boolean
  date: string | number
}

export default function OrdersPage() {
  const ctx = useContext(ShopContext)!
  const { backendUrl, token, navigate } = ctx
  const { formatAmount } = useCurrency()
  const [orderData, setOrderData] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { navigate.push('/login'); return }
    const load = async () => {
      try {
        const res = await axios.post(backendUrl + '/api/user-orders.php', {}, { headers: { token } })
        if (res.data.success) {
          setOrderData(res.data.orders.reverse())
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
    return <div className="pt-14 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  }

  return (
    <div className="pt-14 pb-16">
      <div className="text-xs mb-6">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {orderData.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xs mb-4">You have no orders yet</p>
          <Button onClick={() => navigate.push('/collection')}>Start Shopping</Button>
        </div>
      ) : (
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {orderData.map(order => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Order ID: {order._id}</p>
                  <p className="text-xs font-semibold text-gray-900 mt-1">{formatAmount(order.amount ?? 0)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    order.status === 'Delivered' ? 'bg-primary-subtle text-primary' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-gray-500">{order.paymentMethod}</span>
                </div>
              </div>
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.image?.[0] && (
                      <Image src={item.image[0]} alt={item.name} width={48} height={48} className="rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="text-xs font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} {item.size !== 'default' ? `• ${item.size}` : ''} • {formatAmount(item.price ?? 0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
