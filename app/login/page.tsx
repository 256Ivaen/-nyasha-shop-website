'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import Button from '@/components/Button'

export default function LoginPage() {
  const ctx = useContext(ShopContext)!
  const { token, navigate, login, register } = ctx
  const [currentState, setCurrentState] = useState<'Login' | 'Sign Up'>('Login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (token) navigate.push('/')
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Email is invalid'
    if (!formData.password) errs.password = 'Password is required'
    else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (currentState === 'Sign Up') {
      if (!formData.firstName) errs.firstName = 'First name is required'
      if (!formData.lastName) errs.lastName = 'Last name is required'
      if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || isSubmitting) return
    setIsSubmitting(true)
    try {
      if (currentState === 'Sign Up') {
        const res = await register(`${formData.firstName} ${formData.lastName}`, formData.email, formData.password)
        if (res.success) navigate.push('/')
      } else {
        const res = await login(formData.email, formData.password)
        if (res.success) navigate.push('/')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div className="bg-white rounded-2xl w-full max-w-md p-8 border border-edge" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-6">
          <Image src={assets.logo} alt="SN Luxe Africa" width={80} height={80} className="mx-auto mb-3 object-contain" />
          <h1 className="text-xs font-bold text-gray-900">{currentState}</h1>
          <p className="text-xs text-gray-500 mt-1">
            {currentState === 'Login' ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {currentState === 'Sign Up' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
          )}
          <div>
            <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          {currentState === 'Sign Up' && (
            <div>
              <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          )}
          <Button type="submit" loading={isSubmitting} fullWidth size="lg">
            {isSubmitting ? 'Please wait...' : currentState}
          </Button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-600">
          {currentState === 'Login' ? (
            <span>Don&apos;t have an account?{' '}
              <button type="button" className="text-primary font-semibold hover:underline" onClick={() => setCurrentState('Sign Up')}>Sign Up</button>
            </span>
          ) : (
            <span>Already have an account?{' '}
              <button type="button" className="text-primary font-semibold hover:underline" onClick={() => setCurrentState('Login')}>Login</button>
            </span>
          )}
        </div>
      </motion.div>
    </div>
  )
}
