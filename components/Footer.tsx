'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Facebook, Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react'
import Image from 'next/image'
import { BRAND, CONTACT, FOOTER_QUICK_LINKS, FOOTER_QUICK_SHOP, FOOTER_LEGAL, ANNOUNCEMENTS } from '@/assets/content'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.88a8.27 8.27 0 004.84 1.55V7a4.85 4.85 0 01-1.07-.31z"/>
    </svg>
  )
}

// Payment method SVG logos inline
const paymentMethods = [
  {
    name: 'Visa',
    svg: (
      <svg viewBox="0 0 60 38" xmlns="http://www.w3.org/2000/svg" className="h-9 w-auto">
        <rect width="60" height="38" rx="5" fill="#1A1F71"/>
        <text x="30" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">VISA</text>
      </svg>
    ),
  },
  {
    name: 'Mastercard',
    svg: (
      <svg viewBox="0 0 60 38" xmlns="http://www.w3.org/2000/svg" className="h-9 w-auto">
        <rect width="60" height="38" rx="5" fill="#252525"/>
        <circle cx="23" cy="19" r="11" fill="#EB001B"/>
        <circle cx="37" cy="19" r="11" fill="#F79E1B"/>
        <path d="M30 10.2a11 11 0 010 17.6A11 11 0 0130 10.2z" fill="#FF5F00"/>
      </svg>
    ),
  },
  {
    name: 'PayPal',
    svg: (
      <svg viewBox="0 0 60 38" xmlns="http://www.w3.org/2000/svg" className="h-9 w-auto">
        <rect width="60" height="38" rx="5" fill="#003087"/>
        <text x="30" y="24" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">PayPal</text>
      </svg>
    ),
  },
  {
    name: 'Amex',
    svg: (
      <svg viewBox="0 0 60 38" xmlns="http://www.w3.org/2000/svg" className="h-9 w-auto">
        <rect width="60" height="38" rx="5" fill="#2E77BC"/>
        <text x="30" y="18" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">AMERICAN</text>
        <text x="30" y="28" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">EXPRESS</text>
      </svg>
    ),
  },
  {
    name: 'Apple Pay',
    svg: (
      <svg viewBox="0 0 60 38" xmlns="http://www.w3.org/2000/svg" className="h-9 w-auto">
        <rect width="60" height="38" rx="5" fill="#000"/>
        <text x="30" y="25" textAnchor="middle" fill="white" fontSize="11" fontWeight="500" fontFamily="Arial">Pay</text>
      </svg>
    ),
  },
  {
    name: 'Google Pay',
    svg: (
      <svg viewBox="0 0 60 38" xmlns="http://www.w3.org/2000/svg" className="h-9 w-auto">
        <rect width="60" height="38" rx="5" fill="#fff" stroke="#d1d5db" strokeWidth="1"/>
        <text x="30" y="25" textAnchor="middle" fill="#333" fontSize="11" fontWeight="500" fontFamily="Arial">G Pay</text>
      </svg>
    ),
  },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribing(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Successfully subscribed!', { description: "You'll receive exclusive offers and new product alerts." })
    setEmail('')
    setSubscribing(false)
  }

  return (
    <footer className="bg-black text-white mt-20">

      {/* ── Newsletter Banner ───────────────────────────────────────── */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xs font-bold tracking-widest uppercase mb-1">BECOME A VIP</h2>
              <p className="text-white/60 text-xs">Subscribe and get 10% off your first order plus exclusive deals.</p>
            </div>
            <form onSubmit={handleNewsletter} className="flex gap-0 w-full md:w-auto md:min-w-[360px]">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 bg-white/10 border border-white/20 text-white text-xs px-4 py-3 focus:outline-none focus:border-white placeholder-white/40"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="bg-white text-black text-xs font-bold px-6 py-3 hover:bg-white/90 transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {subscribing ? '...' : 'SUBSCRIBE'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Col 1: Brand */}
          <div>
            <Image src={BRAND.logo} alt="SN Luxe Africa" width={56} height={56} className="h-14 w-14 object-contain mb-5" />
            <p className="text-white/60 text-xs leading-relaxed mb-6">
              {BRAND.description}
            </p>
            <div className="flex gap-3">
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-white transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-white transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href={CONTACT.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-white transition-colors">
                <TikTokIcon className="w-3.5 h-3.5" />
              </a>
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-white transition-colors">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-5">QUICK LINKS</h3>
            <ul className="space-y-3">
              {FOOTER_QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 text-xs hover:text-white transition-colors tracking-wide">
                    {link.label.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-5">CONTACT INFO</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-white/60 text-xs">
                <Phone className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{CONTACT.phone}</span>
              </div>
              <div className="flex items-start gap-2.5 text-white/60 text-xs">
                <Mail className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{CONTACT.email}</span>
              </div>
              <div className="flex items-start gap-2.5 text-white/60 text-xs">
                <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <p>Mon – Fri: 09:00 – 17:00</p>
                  <p>Saturday: 09:00 – 12:00</p>
                  <p>Sun &amp; Public Holidays: Closed</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-white/60 text-xs">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{CONTACT.fullAddress}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Quick Shop */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-5">QUICK SHOP</h3>
            <ul className="space-y-3">
              {FOOTER_QUICK_SHOP.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 text-xs hover:text-white transition-colors tracking-wide">
                    {link.label.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Help & Legal */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-5">HELP &amp; LEGAL</h3>
            <ul className="space-y-3">
              {FOOTER_LEGAL.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 text-xs hover:text-white transition-colors tracking-wide">
                    {link.label.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ──────────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Copyright + legal links */}
            <div className="flex flex-col sm:flex-row items-center gap-3 order-2 sm:order-1">
              <p className="text-white/40 text-xs">
                &copy; {year} {BRAND.name}. All rights reserved.
              </p>
              <div className="flex items-center gap-3 text-white/30 text-xs">
                <Link href="/privacy-policy" className="hover:text-white/60 transition-colors">Privacy</Link>
                <span>·</span>
                <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
                <span>·</span>
                <Link href="/help" className="hover:text-white/60 transition-colors">Help</Link>
              </div>
            </div>

            {/* Payment icons */}
            <div className="flex items-center gap-2 flex-wrap justify-center order-1 sm:order-2">
              {paymentMethods.map(pm => (
                <div key={pm.name} title={pm.name} className="opacity-80 hover:opacity-100 transition-opacity">
                  {pm.svg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
