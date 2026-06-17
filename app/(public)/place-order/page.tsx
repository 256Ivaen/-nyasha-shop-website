'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import CartTotal from '@/components/CartTotal'
import Button from '@/components/Button'
import { toast } from 'sonner'
import axios from 'axios'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

export default function PlaceOrderPage() {
  const ctx = useContext(ShopContext)!
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, currency } = ctx
  const [method, setMethod] = useState('cod')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', country: 'United Kingdom',
  })

  // We need a key to trigger force-reloading of PayPal SDK script when currency changes
  const [paypalKey, setPaypalKey] = useState(Date.now())

  useEffect(() => {
    let count = 0
    for (const sizes of Object.values(cartItems)) {
      for (const qty of Object.values(sizes)) count += qty
    }
    if (count === 0) { toast.error('Your cart is empty'); navigate.push('/cart'); return }

    const loadProfile = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await axios.get(backendUrl + '/api/v1/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data.success) {
          const p = res.data.user ?? res.data.data?.user
          if (p) {
            setFormData({
              firstName: p.first_name ?? '',
              lastName:  p.last_name  ?? '',
              email:     p.email      ?? '',
              phone:     p.phone      ?? '',
              street:    p.street     ?? '',
              city:      p.city       ?? '',
              country:   p.country    ?? 'United Kingdom',
            })
          }
        }
      } catch { /* use empty form */ }
      setLoading(false)
    }
    loadProfile()
  }, [token])

  useEffect(() => {
    setPaypalKey(Date.now())
  }, [currency])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const validateDeliveryInfo = () => {
    if (!formData.firstName.trim()) return 'First Name is required'
    if (!formData.lastName.trim()) return 'Last Name is required'
    if (!formData.email.trim()) return 'Email Address is required'
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Please provide a valid email address'
    if (!formData.phone.trim()) return 'Phone Number is required'
    if (!formData.street.trim()) return 'Street Address is required'
    if (!formData.city.trim()) return 'City is required'
    return null
  }

  const getOrderItems = () => {
    const orderItems = []
    for (const [id, sizes] of Object.entries(cartItems)) {
      const product = products.find(p => p._id === id)
      if (!product) continue
      for (const [size, qty] of Object.entries(sizes)) {
        if (qty > 0) orderItems.push({ ...product, size, quantity: qty })
      }
    }
    return orderItems
  }

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    if (method === 'paypal') return // PayPal checkout handled by PayPalButtons onClick/createOrder/onApprove

    const errorMsg = validateDeliveryInfo()
    if (errorMsg) {
      toast.error(errorMsg)
      return
    }

    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const orderItems = getOrderItems()
      const res = await axios.post(
        backendUrl + '/api/v1/orders',
        {
          items:          orderItems,
          amount:         getCartAmount() + delivery_fee,
          address:        formData,
          payment_method: method,
          currency:       currency || 'GBP',
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (res.data.success) {
        setCartItems({})
        toast.success('Order placed successfully!')
        navigate.push('/orders')
      } else {
        toast.error(res.data.message ?? 'Failed to place order')
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message ?? 'Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalAmount = getCartAmount() + delivery_fee
  const selectedCurrency = currency || 'GBP'

  if (loading) {
    return (
      <div className="pt-14 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <PayPalScriptProvider
      key={paypalKey}
      options={{
        clientId: 'test', // Sandbox/Live script loading works with test for SDK loading; backend handles the actual keys securely!
        currency: selectedCurrency,
        intent: 'capture',
      }}
    >
      <form onSubmit={onSubmitHandler} className="pt-10 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xs font-bold text-gray-900 mb-6">Delivery Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'firstName', placeholder: 'First Name', required: true },
                { name: 'lastName',  placeholder: 'Last Name',  required: true },
                { name: 'email',     placeholder: 'Email Address', type: 'email', required: true },
                { name: 'phone',     placeholder: 'Phone Number',  required: true },
                { name: 'street',    placeholder: 'Street Address', required: true },
                { name: 'city',      placeholder: 'City',          required: true },
              ].map(field => (
                <input
                  key={field.name}
                  name={field.name}
                  type={field.type ?? 'text'}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={(formData as Record<string, string>)[field.name]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ))}
            </div>
            <div className="mt-4">
              <select
                name="country"
                title="Select country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>United Kingdom</option>
                <option>England</option>
                <option>Scotland</option>
                <option>Wales</option>
                <option>Northern Ireland</option>
              </select>
            </div>
          </motion.div>

          <motion.div
            className="w-full lg:w-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CartTotal />
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-gray-900 mb-3">Payment Method</h3>
              <div className="space-y-3">
                {[
                  { id: 'cod', label: 'Cash on Delivery', icon: null },
                  { id: 'paypal', label: 'PayPal / Guest Checkout', icon: '/assets/paypal.png' },
                ].map(m => (
                  <div
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-3 border-2 rounded-lg p-3 cursor-pointer transition-colors ${method === m.id ? 'border-primary bg-primary-subtle' : 'border-gray-200'}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === m.id ? 'border-primary' : 'border-gray-400'}`}>
                      {method === m.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    {m.icon && (
                      <div className="relative w-10 h-6 shrink-0 bg-gray-50 rounded flex items-center justify-center border border-gray-100 overflow-hidden">
                        <span className="text-[9px] font-extrabold text-blue-900 italic">PayPal</span>
                      </div>
                    )}
                    <span className="text-xs font-medium">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {method === 'paypal' ? (
              <div className="mt-6 relative z-10">
                <PayPalButtons
                  style={{ layout: 'vertical', label: 'checkout', shape: 'rect' }}
                  onClick={(data, actions) => {
                    const validationErr = validateDeliveryInfo()
                    if (validationErr) {
                      toast.error(validationErr)
                      return actions.reject()
                    }
                    return actions.resolve()
                  }}
                  createOrder={async () => {
                    try {
                      const res = await axios.post(`${backendUrl}/api/v1/paypal/create-order`, {
                        items: getOrderItems(),
                        amount: totalAmount,
                        currency: selectedCurrency,
                        delivery_fee: delivery_fee,
                      })
                      if (res.data.success && res.data.id) {
                        return res.data.id
                      }
                      throw new Error('Could not create PayPal order')
                    } catch (err) {
                      toast.error('Failed to initiate PayPal transaction')
                      throw err
                    }
                  }}
                  onApprove={async (data) => {
                    setIsSubmitting(true)
                    const payload = {
                      paypal_order_id: data.orderID,
                      items: getOrderItems(),
                      amount: totalAmount,
                      address: formData,
                      currency: selectedCurrency,
                    }

                    try {
                      // Determine endpoint based on guest status
                      const endpoint = token ? '/api/v1/paypal/capture' : '/api/v1/paypal/guest-capture'
                      const headers = token ? { Authorization: `Bearer ${token}` } : {}

                      const res = await axios.post(`${backendUrl}${endpoint}`, payload, { headers })

                      if (res.data.success) {
                        setCartItems({})
                        toast.success('Payment captured! Order placed successfully.')
                        navigate.push(token ? '/orders' : '/')
                      } else {
                        toast.error(res.data.message ?? 'Payment capture failed')
                      }
                    } catch (error: unknown) {
                      const err = error as { response?: { data?: { message?: string } } }
                      toast.error(err.response?.data?.message ?? 'Payment capture failed. Please contact support.')
                    } finally {
                      setIsSubmitting(false)
                    }
                  }}
                  onError={(err) => {
                    toast.error('An error occurred during the PayPal transaction flow')
                    console.error('PayPal Buttons Error: ', err)
                  }}
                />
              </div>
            ) : (
              <Button type="submit" loading={isSubmitting} fullWidth size="lg" className="mt-6">
                {isSubmitting ? 'Placing Order...' : 'PLACE ORDER'}
              </Button>
            )}
          </motion.div>
        </div>
      </form>
    </PayPalScriptProvider>
  )
}
