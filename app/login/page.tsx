'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const ctx = useContext(ShopContext)!
  const { token, navigate, login, register } = ctx
  const [currentState, setCurrentState] = useState<'Login' | 'Sign Up'>('Login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [errorMsg, setErrorMsg] = useState('')

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
    else if (formData.password.length < 8) errs.password = 'At least 8 characters'
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
    setErrorMsg('')
    try {
      if (currentState === 'Sign Up') {
        const res = await register(`${formData.firstName} ${formData.lastName}`, formData.email, formData.password)
        if (res.success) navigate.push('/')
        else setErrorMsg(res.message ?? 'Registration failed.')
      } else {
        const res = await login(formData.email, formData.password)
        if (res.success) navigate.push('/')
        else setErrorMsg(res.message ?? 'Invalid email or password.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = 'w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all'

  return (
    <div className="min-h-screen bg-[#0E1A1F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <h2 className="text-2xl font-bold text-white mb-1">
          {currentState === 'Login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-white/60 text-sm mb-7">
          {currentState === 'Login' ? 'Sign in to your account to continue.' : 'Join SN Luxe Africa today.'}
        </p>

        {errorMsg && (
          <div className="mb-4 text-sm text-red-400 font-medium">{errorMsg}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {currentState === 'Sign Up' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">First Name</label>
                <input name="firstName" placeholder="First" value={formData.firstName} onChange={handleChange} className={inputClass} />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">Last Name</label>
                <input name="lastName" placeholder="Last" value={formData.lastName} onChange={handleChange} className={inputClass} />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">Email address</label>
            <input name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} autoComplete="email" className={inputClass} />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">Password</label>
            <div className="relative">
              <input name="password" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={handleChange} className={`${inputClass} pr-10`} />
              <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {currentState === 'Sign Up' && (
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} autoComplete="new-password" className={inputClass + ' pr-10'} />
                <button type="button" tabIndex={-1} onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-white text-[#0E1A1F] font-bold text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {isSubmitting ? 'Please wait…' : currentState === 'Login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          {currentState === 'Login' ? (
            <>Don&apos;t have an account?{' '}
              <button type="button" className="text-white/70 font-semibold hover:text-white transition-colors" onClick={() => { setCurrentState('Sign Up'); setErrorMsg('') }}>Sign Up</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button type="button" className="text-white/70 font-semibold hover:text-white transition-colors" onClick={() => { setCurrentState('Login'); setErrorMsg('') }}>Sign In</button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
