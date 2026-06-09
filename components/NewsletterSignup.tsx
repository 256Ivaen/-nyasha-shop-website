'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Mail } from 'lucide-react'

export default function NewsletterSignup() {
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) { toast.error('Please enter a valid email address'); return }
    setLoading(true)
    // Simulate subscription — replace with real API call if needed
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
    setLoading(false)
    toast.success('You\'re subscribed! Welcome to SN Luxe Africa.')
  }

  return (
    <section className="py-12 my-8">
      <div className="bg-primary rounded-3xl px-6 py-12 sm:px-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
          <Mail className="text-white" size={22} />
        </div>
        <h2 className="text-white font-extrabold text-2xl sm:text-3xl">Stay in the loop</h2>
        <p className="text-white/70 text-sm mt-2 max-w-md mx-auto">
          Get exclusive deals, new arrivals and special offers delivered straight to your inbox.
        </p>

        {submitted ? (
          <div className="mt-6 inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold">
            ✓ You're subscribed!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-xl text-sm bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-white text-primary font-bold text-sm rounded-xl hover:bg-white/90 disabled:opacity-60 transition-colors whitespace-nowrap"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        <p className="text-white/40 text-xs mt-4">No spam, unsubscribe at any time.</p>
      </div>
    </section>
  )
}
