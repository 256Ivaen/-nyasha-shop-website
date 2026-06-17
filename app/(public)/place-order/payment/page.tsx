'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import CartTotal from '@/components/CartTotal'
import { toast } from 'sonner'
import axios from 'axios'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

export default function PlaceOrderPaymentPage() {
  const ctx = useContext(ShopContext)!
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, currency } = ctx
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<Record<string, string> | null>(null)
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null)

  // Bump key to force PayPalScriptProvider re-mount when currency changes
  const [paypalKey, setPaypalKey] = useState(0)

  useEffect(() => {
    // Read cached delivery details
    const cachedData = localStorage.getItem('sn_checkout_address')
    if (!cachedData) {
      toast.error('Please fill your delivery details first')
      navigate.push('/place-order')
      return
    }

    // Wait until products are loaded before validating cart
    if (products.length === 0) return

    let count = 0
    for (const sizes of Object.values(cartItems)) {
      for (const qty of Object.values(sizes)) count += qty
    }
    if (count === 0) {
      toast.error('Your cart is empty')
      navigate.push('/cart')
      return
    }

    let parsed: Record<string, string>
    try {
      parsed = JSON.parse(cachedData)
    } catch {
      toast.error('Invalid address details cached')
      navigate.push('/place-order')
      return
    }
    setFormData(parsed)

    // Fetch the real PayPal client ID from the backend — never hardcode it
    axios
      .get(`${backendUrl}/api/v1/paypal/config`)
      .then(res => {
        if (res.data?.client_id) {
          setPaypalClientId(res.data.client_id)
        } else {
          toast.error('Could not load payment configuration')
        }
      })
      .catch(() => toast.error('Could not reach payment server'))
      .finally(() => setLoading(false))
  }, [token, products, cartItems])

  useEffect(() => {
    setPaypalKey(k => k + 1)
  }, [currency])

  const getOrderItems = () => {
    const orderItems: object[] = []
    for (const [id, sizes] of Object.entries(cartItems)) {
      const product = products.find(p => p._id === id)
      if (!product) continue
      for (const [size, qty] of Object.entries(sizes)) {
        if (qty > 0) orderItems.push({ ...product, size, quantity: qty })
      }
    }
    return orderItems
  }

  const totalAmount = getCartAmount() + delivery_fee
  const selectedCurrency = currency || 'GBP'

  if (loading || !formData || !paypalClientId) {
    return (
      <div className="pt-14 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <PayPalScriptProvider
      key={`${paypalKey}-${paypalClientId}`}
      options={{
        clientId: paypalClientId,
        currency: selectedCurrency,
        intent: 'capture',
      }}
    >
      <div className="pt-10 pb-16 max-w-4xl mx-auto px-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10 text-xs font-semibold text-gray-400">
          <span
            className="text-gray-900 cursor-pointer hover:underline"
            onClick={() => navigate.push('/place-order')}
          >
            Delivery Information
          </span>
          <span className="text-gray-300">/</span>
          <span className="text-primary font-bold">Payment Details</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">PayPal Checkout</h2>
              <button
                type="button"
                onClick={() => navigate.push('/place-order')}
                className="text-xs text-gray-500 hover:text-primary underline font-medium"
              >
                Change Address
              </button>
            </div>

            {/* Shipping details summary */}
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
                      address: formData,
                    })
                    if (res.data.success && res.data.id) return res.data.id
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
                      localStorage.removeItem('sn_checkout_address')
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
                  console.error('PayPal Buttons Error:', err)
                }}
              />
            </div>

            {isSubmitting && (
              <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-2xl z-20">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-xs font-semibold text-gray-700">Capturing Payment...</p>
              </div>
            )}
          </div>

          <div className="w-full lg:w-80">
            <CartTotal />
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  )
}
