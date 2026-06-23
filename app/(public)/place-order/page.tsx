'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import CartTotal from '@/components/CartTotal'
import Button from '@/components/Button'
import CountrySelect from '@/components/CountrySelect'
import { toast } from 'sonner'
import axios from 'axios'
import { motion } from 'framer-motion'

export default function PlaceOrderInfoPage() {
  const ctx = useContext(ShopContext)!
  const { navigate, backendUrl, token, cartItems, getCartAmount, products } = ctx
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    firstName:    '',
    lastName:     '',
    email:        '',
    phone:        '',
    street:       '',
    city:         '',
    state:        '',
    zipCode:      '',
    country_code: 'GB',          // ISO2 sent to PayPal
    country_name: 'United Kingdom', // human-readable for display
  })

  useEffect(() => {
    // Must be logged in — accounts required for order tracking
    if (!token) {
      toast.error('Please sign in to place an order')
      navigate.push('/login?redirect=/place-order')
      return
    }

    let count = 0
    for (const sizes of Object.values(cartItems)) {
      for (const qty of Object.values(sizes)) count += qty
    }
    if (count === 0) { toast.error('Your cart is empty'); navigate.push('/cart'); return }

    // Pre-fill from localStorage if available
    const cachedAddress = localStorage.getItem('sn_checkout_address')
    if (cachedAddress) {
      try { setFormData(JSON.parse(cachedAddress)) } catch { /* ignore */ }
    }

    const loadProfile = async () => {
      if (!token) { setLoading(false); return }
      try {
        const res = await axios.get(backendUrl + '/api/v1/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data.success) {
          const p = res.data.user ?? res.data.data?.user
          if (p) {
            setFormData(prev => ({
              ...prev,
              firstName:    prev.firstName    || p.first_name || '',
              lastName:     prev.lastName     || p.last_name  || '',
              email:        prev.email        || p.email      || '',
              phone:        prev.phone        || p.phone      || '',
              street:       prev.street       || p.street     || '',
              city:         prev.city         || p.city       || '',
              state:        prev.state        || p.state      || '',
              zipCode:      prev.zipCode      || p.zip_code   || '',
              country_code: prev.country_code || p.country_code || 'GB',
              country_name: prev.country_name || p.country    || 'United Kingdom',
            }))
          }
        }
      } catch { /* use empty/cached form */ }
      setLoading(false)
    }
    loadProfile()
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleCountryChange = (iso2: string, name: string) =>
    setFormData(prev => ({ ...prev, country_code: iso2, country_name: name }))

  const validateDeliveryInfo = () => {
    if (!formData.firstName.trim()) return 'First Name is required'
    if (!formData.lastName.trim())  return 'Last Name is required'
    if (!formData.email.trim())     return 'Email Address is required'
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Please provide a valid email address'
    if (!formData.phone.trim())     return 'Phone Number is required'
    if (!formData.street.trim())    return 'Street Address is required'
    if (!formData.city.trim())      return 'City is required'
    if (!formData.country_code)     return 'Please select a country'
    return null
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    const errorMsg = validateDeliveryInfo()
    if (errorMsg) { toast.error(errorMsg); return }
    localStorage.setItem('sn_checkout_address', JSON.stringify(formData))
    navigate.push('/place-order/payment')
  }

  if (loading) {
    return (
      <div className="pt-14 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const fields = [
    { name: 'firstName', placeholder: 'First Name',      required: true },
    { name: 'lastName',  placeholder: 'Last Name',       required: true },
    { name: 'email',     placeholder: 'Email Address',   type: 'email', required: true },
    { name: 'phone',     placeholder: 'Phone Number',    required: true },
    { name: 'street',    placeholder: 'Street Address',  required: true },
    { name: 'city',      placeholder: 'City / Town',     required: true },
    { name: 'state',     placeholder: 'State / Province (optional)' },
    { name: 'zipCode',   placeholder: 'Postcode / ZIP (optional)' },
  ]

  return (
    <div className="pt-10 pb-16 max-w-4xl mx-auto px-4">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-10 text-xs font-semibold text-gray-400">
        <span className="text-primary font-bold">Delivery Information</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-400">Payment Details</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <motion.form
            onSubmit={handleNextStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xs font-bold text-gray-900 mb-6 uppercase tracking-wider">Delivery Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(field => (
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

            {/* Country selector — full width below the grid */}
            <div className="mt-4">
              <CountrySelect
                value={formData.country_code}
                onChange={handleCountryChange}
                defaultIso2="GB"
              />
            </div>

            <Button type="submit" fullWidth size="lg" className="mt-6">
              CONTINUE TO PAYMENT
            </Button>
          </motion.form>
        </div>

        <div className="w-full lg:w-80">
          <CartTotal />
        </div>
      </div>
    </div>
  )
}
