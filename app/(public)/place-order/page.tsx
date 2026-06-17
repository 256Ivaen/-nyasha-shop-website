'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import CartTotal from '@/components/CartTotal'
import Button from '@/components/Button'
import { toast } from 'sonner'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

export default function PlaceOrderPage() {
  const ctx = useContext(ShopContext)!
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, currency } = ctx
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Step 1: 'info' (delivery details), Step 2: 'payment' (PayPal button screen)
  const [step, setStep] = useState<'info' | 'payment'>('info')

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

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    const errorMsg = validateDeliveryInfo()
    if (errorMsg) {
      toast.error(errorMsg)
      return
    }
    setStep('payment')
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
        clientId: 'test',
        currency: selectedCurrency,
        intent: 'capture',
      }}
    >
      <div className="pt-10 pb-16 max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10 text-xs font-semibold text-gray-400">
          <span className={step === 'info' ? 'text-primary font-bold' : 'text-gray-900'}>Delivery Information</span>
          <span className="text-gray-300">/</span>
          <span className={step === 'payment' ? 'text-primary font-bold' : ''}>Payment Details</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {step === 'info' ? (
                <motion.form
                  key="info-form"
                  onSubmit={handleNextStep}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-xs font-bold text-gray-900 mb-6 uppercase tracking-wider">Delivery Information</h2>
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
                        className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
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

                  <Button type="submit" fullWidth size="lg" className="mt-6">
                    CONTINUE TO PAYMENT
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="payment-options"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">PayPal Checkout</h2>
                    <button
                      type="button"
                      onClick={() => setStep('info')}
                      className="text-xs text-gray-500 hover:text-primary underline font-medium"
                    >
                      Back to Delivery info
                    </button>
                  </div>

                  <div className="border-b border-gray-200 pb-4 mb-6 text-xs text-gray-600">
                    <p className="font-semibold text-gray-900 mb-1">Shipping Details:</p>
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.street}, {formData.city}, {formData.country}</p>
                    <p>Contact: {formData.phone} | {formData.email}</p>
                  </div>

                  <div className="relative z-10">
                    <PayPalButtons
                      style={{ layout: 'vertical', label: 'checkout', shape: 'rect' }}
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

                  {isSubmitting && (
                    <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-2xl z-20">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-xs font-semibold text-gray-700">Capturing Payment...</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full lg:w-80">
            <CartTotal />
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  )
}
