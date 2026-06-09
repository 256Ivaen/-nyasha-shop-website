'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import axios from 'axios'

interface FaqItem {
  id: number
  question: string
  answer: string
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

export default function FaqClient() {
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    axios.get(`${BACKEND}/api/v1/faqs`)
      .then(r => setFaqs(r.data.faqs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-2xl mx-auto pt-12 pb-20 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-gray-500 mt-2 text-sm">Everything you need to know about shopping with us.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <HelpCircle className="mx-auto h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm">No FAQs available yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 ml-3 text-gray-400 transition-transform duration-200 ${open === idx ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === idx && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
