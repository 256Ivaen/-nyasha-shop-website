'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import CartTotal from '@/components/CartTotal'
import Button from '@/components/Button'
import { toast } from 'sonner'
import axios from 'axios'
import { motion } from 'framer-motion'
import { assets } from '@/assets/assets'
import Image from 'next/image'

export default function PlaceOrderPage() {
  const ctx = useContext(ShopContext)!
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = ctx
  const [method, setMethod] = useState('cod')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', country: 'Uganda',
  })

  useEffect(() => {
    if (!token) { navigate.push('/login'); return }
    let count = 0
    for (const sizes of Object.values(cartItems)) {
      for (const qty of Object.values(sizes)) count += qty
    }
    if (count === 0) { toast.error('Your cart is empty'); navigate.push('/cart'); return }
    const loadProfile = async () => {
      try {
        const res = await axios.post(backendUrl + '/api/get-user-profile.php', {}, { headers: { token } })
        if (res.data.success && res.data.profile) {
          const p = res.data.profile
          setFormData({
            firstName: p.first_name ?? '', lastName: p.last_name ?? '',
            email: '', phone: p.phone ?? '',
            street: p.street ?? '', city: p.city ?? '', country: p.country ?? 'Uganda',
          })
        }
      } catch { /* use empty form */ }
      setLoading(false)
    }
    loadProfile()
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const orderItems = []
      for (const [id, sizes] of Object.entries(cartItems)) {
        const product = products.find(p => p._id === id)
        if (!product) continue
        for (const [size, qty] of Object.entries(sizes)) {
          if (qty > 0) orderItems.push({ ...product, size, quantity: qty })
        }
      }
      const orderData = {
        address: formData, items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method,
      }
      const res = await axios.post(backendUrl + '/api/place-order.php', orderData, { headers: { token } })
      if (res.data.success) {
        setCartItems({})
        toast.success('Order placed successfully!')
        navigate.push('/orders')
      } else {
        toast.error(res.data.message ?? 'Failed to place order')
      }
    } catch {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="pt-14 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  }

  return (
    <form onSubmit={onSubmitHandler} className="pt-10 pb-16">
      <div className="flex flex-col lg:flex-row gap-8">
        <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xs font-bold text-gray-900 mb-6">Delivery Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'firstName', placeholder: 'First Name', required: true },
              { name: 'lastName', placeholder: 'Last Name', required: true },
              { name: 'email', placeholder: 'Email Address', type: 'email' },
              { name: 'phone', placeholder: 'Phone Number', required: true },
              { name: 'street', placeholder: 'Street Address', required: true },
              { name: 'city', placeholder: 'City', required: true },
            ].map(field => (
              <input key={field.name}
                name={field.name}
                type={field.type ?? 'text'}
                placeholder={field.placeholder}
                required={field.required}
                value={(formData as Record<string, string>)[field.name]}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
            ))}
          </div>
          <div className="mt-4">
            <select name="country" title="Select country" value={formData.country} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Uganda</option>
              <option>Kenya</option>
              <option>Tanzania</option>
              <option>Rwanda</option>
            </select>
          </div>
        </motion.div>

        <motion.div className="w-full lg:w-80" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <CartTotal />
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-900 mb-3">Payment Method</h3>
            <div className="space-y-3">
              {[
                { id: 'mobilemoney', label: 'Mobile Money', icon: assets.mobilemoney },
                { id: 'cod', label: 'Cash on Delivery', icon: null },
              ].map(m => (
                <div key={m.id} onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-3 border-2 rounded-lg p-3 cursor-pointer transition-colors ${method === m.id ? 'border-primary bg-primary-subtle' : 'border-gray-200'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === m.id ? 'border-primary' : 'border-gray-400'}`}>
                    {method === m.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  {m.icon && <Image src={m.icon} alt={m.label} width={40} height={24} className="object-contain" />}
                  <span className="text-xs font-medium">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" loading={isSubmitting} fullWidth size="lg" className="mt-6">
            {isSubmitting ? 'Placing Order...' : 'PLACE ORDER'}
          </Button>
        </motion.div>
      </div>
    </form>
  )
}
