'use client'

import { useEffect, useState } from 'react'
import { Star, CheckCircle, ChevronDown, ChevronUp, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Review {
  id: number
  reviewer_name: string
  rating: number
  title?: string
  body: string
  verified: boolean
  created_at: string
}

interface Props { productId: string }

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

function StarRow({ rating, size = 14, interactive = false, onChange }: {
  rating: number; size?: number; interactive?: boolean; onChange?: (r: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={size}
          onClick={() => interactive && onChange?.(i)}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${interactive ? 'cursor-pointer' : ''} transition-colors ${
            i <= (hovered || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-8 text-right text-fore-muted">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-fore-muted">{count}</span>
    </div>
  )
}

const EMPTY_FORM = { name: '', email: '', rating: 0, title: '', body: '' }

export default function ProductReviews({ productId }: Props) {
  const [reviews,    setReviews]    = useState<Review[]>([])
  const [avgRating,  setAvgRating]  = useState(0)
  const [count,      setCount]      = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [showForm,   setShowForm]   = useState(false)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [expanded,   setExpanded]   = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    fetch(`${BACKEND}/api/v1/products/${productId}/reviews`)
      .then(r => r.json())
      .then(d => {
        setReviews(d.reviews ?? [])
        setAvgRating(d.avg_rating ?? 0)
        setCount(d.count ?? 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { if (productId) load() }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (form.rating === 0) { alert('Please select a star rating'); return }
    if (form.body.trim().length < 10) { alert('Review must be at least 10 characters'); return }
    setSubmitting(true)
    try {
      const res = await fetch(`${BACKEND}/api/v1/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, product_id: productId }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        setShowForm(false)
        setForm(EMPTY_FORM)
      } else {
        alert(data.message ?? 'Failed to submit review')
      }
    } catch {
      alert('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Rating breakdown
  const breakdown = [5,4,3,2,1].map(n => ({ n, count: reviews.filter(r => r.rating === n).length }))

  if (loading) {
    return (
      <div className="mt-16">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-gray-900">
          Customer Reviews {count > 0 && <span className="text-sm font-normal text-gray-500">({count})</span>}
        </h2>
        {!submitted && (
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-xs font-semibold hover:bg-gray-800 transition-colors"
          >
            <Star size={13} />
            Write a Review
          </button>
        )}
      </div>

      {/* Summary */}
      {count > 0 && (
        <div className="flex gap-8 mb-8 p-5 bg-gray-50 rounded-2xl">
          <div className="text-center shrink-0">
            <p className="text-4xl font-extrabold text-gray-900">{avgRating.toFixed(1)}</p>
            <StarRow rating={Math.round(avgRating)} size={16} />
            <p className="text-xs text-gray-500 mt-1">{count} review{count !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1 space-y-1.5 justify-center flex flex-col">
            {breakdown.map(({ n, count: c }) => (
              <RatingBar key={n} label={`${n}★`} count={c} total={count} />
            ))}
          </div>
        </div>
      )}

      {/* Write review form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-8 overflow-hidden"
          >
            <h3 className="text-sm font-bold text-gray-900 mb-4">Share Your Experience</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Your Rating *</label>
                <StarRow rating={form.rating} size={24} interactive onChange={r => setForm(f => ({ ...f, rating: r }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name *"
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="Email (optional)"
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
                />
              </div>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Review title (optional)"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
              />
              <textarea
                required
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                placeholder="Tell others about your experience (min 10 characters) *"
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white resize-none"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-full text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  <Send size={12} />
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Thank you message after submit */}
      {submitted && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6 text-sm text-green-800 flex items-center gap-3">
          <CheckCircle size={16} className="text-green-600 shrink-0" />
          Thank you! Your review has been submitted and will appear after moderation.
        </div>
      )}

      {/* Reviews list */}
      {count === 0 ? (
        <div className="text-center py-12">
          <Star className="mx-auto h-8 w-8 text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">No reviews yet — be the first to share your experience.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r, idx) => {
            const isLong = r.body.length > 200
            const isExpanded = expanded === idx
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-gray-100 rounded-2xl p-5 bg-white"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {r.reviewer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">{r.reviewer_name}</p>
                        {r.verified && (
                          <span className="flex items-center gap-1 text-[10px] text-green-700 font-semibold">
                            <CheckCircle size={10} /> Verified Purchase
                          </span>
                        )}
                      </div>
                      <StarRow rating={r.rating} size={12} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                {r.title && <p className="text-sm font-semibold text-gray-900 mb-1">"{r.title}"</p>}
                <p className={`text-sm text-gray-600 leading-relaxed ${!isExpanded && isLong ? 'line-clamp-3' : ''}`}>{r.body}</p>
                {isLong && (
                  <button onClick={() => setExpanded(isExpanded ? null : idx)} className="mt-1 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors">
                    {isExpanded ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Read more</>}
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </section>
  )
}
