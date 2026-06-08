'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { assets } from '@/assets/assets'
import Button from '@/components/Button'
import Image from 'next/image'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.")
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen pt-6 pb-16">
      <motion.div className="text-center mb-8" initial="hidden" animate="visible" variants={fadeInUp}>
        <h1 className="text-xs sm:text-xs font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-xs text-gray-600">Get in touch with us — we&apos;d love to hear from you</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <Image src={assets.contact_img} alt="Contact SN Luxe Africa" width={600} height={256} className="w-full h-64 object-cover rounded-xl mb-6" />
          <div className="space-y-4">
            {[
              { label: 'Location', value: 'Kampala, Uganda' },
              { label: 'Phone', value: '+256 700 000000' },
              { label: 'Email', value: 'info@trtcl.com' },
              { label: 'Hours', value: 'Mon – Sat: 8am – 6pm' },
            ].map(info => (
              <div key={info.label} className="flex gap-3">
                <span className="font-semibold text-gray-700 min-w-[80px]">{info.label}:</span>
                <span className="text-gray-600">{info.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="space-y-4" initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
            <input name="subject" value={formData.subject} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="How can we help?" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Write your message here..." />
          </div>
          <Button type="submit" loading={isSubmitting} fullWidth size="lg">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </motion.form>
      </div>
    </div>
  )
}
