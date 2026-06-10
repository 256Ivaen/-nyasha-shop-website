'use client'

import Image from 'next/image'
import { assets } from '@/assets/assets'
import { CONTACT } from '@/assets/content'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Phone, MessageCircle } from 'lucide-react'

const fadeInUp = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

export default function AboutPage() {
  return (
    <div className="pt-4 pb-8">
      <motion.div className="text-center mb-5" initial="hidden" animate="visible" variants={fadeInUp}>
        <h1 className="text-xs font-bold text-gray-900 mb-1 tracking-widest uppercase">About Us</h1>
        <p className="text-xs text-gray-600">Your home for authentic African print fashion in the UK</p>
      </motion.div>

      <motion.div className="flex flex-col md:flex-row gap-6 mb-6" initial="hidden" animate="visible" variants={stagger}>
        <motion.div className="flex-1 md:max-w-xs" variants={fadeInUp}>
          <Image src={assets.about_img} alt="About SN Luxe Africa" width={400} height={300} className="w-full h-48 md:h-64 rounded-2xl object-cover border border-edge" />
        </motion.div>
        <motion.div className="flex-1 space-y-3" variants={fadeInUp}>
          <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase">Our Story</h2>
          <p className="text-gray-600 text-xs leading-relaxed">
            SN Luxe Africa brings you the finest Ankara, Kente, Kitenge and Dashiki fashion — handcrafted and delivered across the UK. Every piece is genuine, quality-checked and crafted by skilled artisans across West and East Africa.
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Styles', value: '200+' },
              { label: 'Customers', value: '1K+' },
              { label: 'Years', value: '5+' },
              { label: 'Orders', value: '5K+' },
            ].map(stat => (
              <div key={stat.label} className="bg-primary-subtle p-2 text-center border border-edge-light">
                <p className="text-xs font-bold text-primary">{stat.value}</p>
                <p className="text-[10px] text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1.5 text-xs text-gray-600">
            <p className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-primary flex-shrink-0" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-primary transition-colors">{CONTACT.email}</a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-primary flex-shrink-0" />
              <a href={`tel:${CONTACT.phone.replace(/\s/g,'')}`} className="hover:text-primary transition-colors">{CONTACT.phone}</a>
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle className="w-3 h-3 text-primary flex-shrink-0" />
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp Us</a>
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="bg-primary text-white p-5 text-center"
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
      >
        <h2 className="text-xs font-bold mb-2 tracking-widest uppercase">Get in Touch</h2>
        <p className="text-primary-foreground text-xs mb-3">Questions about sizing, custom orders or delivery? We&apos;re here to help.</p>
        <Link href="/contact" className="inline-block bg-white text-primary font-semibold text-xs px-5 py-1.5 hover:bg-primary-subtle transition-colors">
          Contact Us
        </Link>
      </motion.div>
    </div>
  )
}
