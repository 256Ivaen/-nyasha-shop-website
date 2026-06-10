'use client'

import { useContext, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ShopContext } from '@/contexts/ShopContext'
import axios from 'axios'
import { toast } from 'sonner'

export default function VerifyPayment() {
  const ctx = useContext(ShopContext)!
  const { navigate, token, setCartItems, backendUrl } = ctx
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    const verify = async () => {
      if (!token) return
      try {
        const res = await axios.put(
          backendUrl + `/api/v1/admin/orders/${orderId}/payment`,
          { payment_status: success === 'true' ? 'paid' : 'failed' },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        if (res.data.success) {
          setCartItems({})
          navigate.push('/orders')
        } else {
          navigate.push('/cart')
        }
      } catch (error: unknown) {
        const err = error as { message?: string }
        toast.error(err.message ?? 'Verification failed')
        navigate.push('/cart')
      }
    }
    verify()
  }, [token])

  return (
    <div className="pt-14 flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Verifying your payment...</p>
      </div>
    </div>
  )
}
