'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, RotateCcw, Truck, ShoppingBag, CreditCard,
  User, MessageCircle, Mail, Phone, Clock,
  PackageCheck, HelpCircle,
} from 'lucide-react'
import { CONTACT } from '@/assets/content'
import type { ReactNode } from 'react'

// ── types ────────────────────────────────────────────────────────────────────

interface QA { q: string; a: string | ReactNode }

interface Section {
  id: string
  label: string
  icon: ReactNode
  colour: string
  intro: string
  items: QA[]
}

// ── content ──────────────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    id: 'returns',
    label: 'Returns & Refunds',
    icon: <RotateCcw className="w-5 h-5" />,
    colour: 'bg-rose-50 text-rose-700 border-rose-200',
    intro: 'We want you to love every purchase. If something isn\'t right, we make it easy to return.',
    items: [
      {
        q: 'What is your returns policy?',
        a: 'You can return any item within 30 days of receiving your order, provided it is unworn, unwashed, and in its original condition with all tags attached. Items must be returned in their original packaging where possible.',
      },
      {
        q: 'How do I start a return?',
        a: (
          <span>
            To start a return, contact us at{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">{CONTACT.email}</a>
            {' '}or via{' '}
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">WhatsApp</a>
            {' '}with your order number and reason for return. We will respond within 1–2 business days with return instructions and a returns address.
          </span>
        ),
      },
      {
        q: 'Who pays for return postage?',
        a: 'For change-of-mind returns, the customer is responsible for return postage costs. If the item is faulty, damaged, or we sent the wrong item, we will cover the full return postage cost.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Once we receive and inspect the returned item, we will process your refund within 3–5 business days. The refund will be issued to your original payment method. Please allow an additional 3–5 business days for your bank to post the credit.',
      },
      {
        q: 'Can I exchange an item?',
        a: 'Yes. If you would like a different size or colour, let us know when you contact us about your return. Subject to stock availability, we will arrange an exchange. If the item you want is not in stock, a full refund will be issued instead.',
      },
      {
        q: 'What items cannot be returned?',
        a: 'For hygiene reasons, earrings and pierced jewellery cannot be returned. Items that have been worn, washed, altered, or damaged after delivery are not eligible for return. Custom or made-to-order items are also non-returnable unless faulty.',
      },
      {
        q: 'My item arrived damaged or faulty — what should I do?',
        a: (
          <span>
            We are very sorry to hear that. Please contact us immediately at{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">{CONTACT.email}</a>
            {' '}with photos of the damage and your order number. We will arrange a free return and send a replacement or issue a full refund — whichever you prefer.
          </span>
        ),
      },
      {
        q: 'I received the wrong item — what do I do?',
        a: (
          <span>
            Apologies for the mistake! Contact us at{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">{CONTACT.email}</a>
            {' '}with your order number and a photo of what you received. We will arrange collection of the incorrect item and dispatch the correct one at no extra cost to you.
          </span>
        ),
      },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery & Shipping',
    icon: <Truck className="w-5 h-5" />,
    colour: 'bg-blue-50 text-blue-700 border-blue-200',
    intro: 'Fast, reliable delivery across the UK and internationally.',
    items: [
      {
        q: 'How long does UK delivery take?',
        a: 'Standard UK delivery takes 2–4 working days from dispatch. Orders are typically dispatched within 1–2 working days of being placed. You will receive an email confirmation when your order has shipped.',
      },
      {
        q: 'Do you offer free delivery?',
        a: 'Yes! We offer free standard UK delivery on all orders over £75. Orders under £75 are charged a flat delivery fee, which is shown at checkout before payment.',
      },
      {
        q: 'Do you deliver internationally?',
        a: 'Yes, we ship to Zimbabwe and other international destinations. International delivery times and costs vary by destination and are calculated at checkout. Please allow 7–14 working days for international orders.',
      },
      {
        q: 'How do I track my order?',
        a: (
          <span>
            Once your order is dispatched, you will receive a tracking number by email. You can also log into your account at{' '}
            <Link href="/orders" className="text-primary font-semibold hover:underline">My Orders</Link>
            {' '}to see your order status at any time.
          </span>
        ),
      },
      {
        q: 'My order hasn\'t arrived — what should I do?',
        a: (
          <span>
            If your order has not arrived within the expected timeframe, first check the tracking link in your dispatch email. If tracking shows no movement for more than 3 business days, or if the expected delivery date has passed, please contact us at{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">{CONTACT.email}</a>
            {' '}and we will investigate immediately.
          </span>
        ),
      },
      {
        q: 'Can I change my delivery address after ordering?',
        a: (
          <span>
            We can update your delivery address if the order has not yet been dispatched. Contact us as soon as possible at{' '}
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">WhatsApp</a>
            {' '}or{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">email</a>
            {' '}with your order number and new address. Once dispatched, we are unable to redirect parcels.
          </span>
        ),
      },
      {
        q: 'Do you ship to PO boxes or BFPO addresses?',
        a: 'Yes, we can deliver to PO boxes and BFPO addresses within the UK. Please ensure the full address is entered correctly at checkout.',
      },
    ],
  },
  {
    id: 'orders',
    label: 'Orders & Tracking',
    icon: <ShoppingBag className="w-5 h-5" />,
    colour: 'bg-amber-50 text-amber-700 border-amber-200',
    intro: 'Everything you need to know about placing, managing and tracking your orders.',
    items: [
      {
        q: 'How do I place an order?',
        a: (
          <span>
            Browse our collections, select your size, and click &quot;Add to Cart&quot;. When you are ready, go to your{' '}
            <Link href="/cart" className="text-primary font-semibold hover:underline">Cart</Link>
            {' '}and click &quot;Checkout&quot;. You can check out as a guest or create an account for a faster experience next time.
          </span>
        ),
      },
      {
        q: 'Can I modify or cancel my order?',
        a: (
          <span>
            You can request a modification or cancellation before your order is dispatched. Contact us immediately at{' '}
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">WhatsApp</a>
            {' '}or{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">email</a>
            {' '}with your order number. Once dispatched, orders cannot be modified but can be returned after delivery.
          </span>
        ),
      },
      {
        q: 'I haven\'t received an order confirmation email — what should I do?',
        a: 'Please check your spam/junk folder first. If the confirmation email is not there, it is possible the email address entered at checkout was incorrect. Contact us with your name and approximate order date and we will locate your order and resend the confirmation.',
      },
      {
        q: 'How do I view my order history?',
        a: (
          <span>
            Log into your account and visit the{' '}
            <Link href="/orders" className="text-primary font-semibold hover:underline">My Orders</Link>
            {' '}page. All your past and current orders will be listed there with status and tracking information.
          </span>
        ),
      },
      {
        q: 'Can I order as a guest without creating an account?',
        a: 'Yes. You can complete a purchase as a guest. However, creating a free account lets you track orders, view your order history, and check out faster in future.',
      },
      {
        q: 'Do you offer gift wrapping or a gift message option?',
        a: (
          <span>
            Yes! We can add a personalised gift message to your order. Leave a note in the order comments at checkout, or contact us at{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">{CONTACT.email}</a>
            {' '}with your order number and message after ordering.
          </span>
        ),
      },
    ],
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: <CreditCard className="w-5 h-5" />,
    colour: 'bg-green-50 text-green-700 border-green-200',
    intro: 'We accept a wide range of secure payment methods for your convenience.',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay. All payments are processed securely. Card details are never stored on our servers.',
      },
      {
        q: 'Is it safe to pay on your website?',
        a: 'Yes. Our website uses SSL encryption (HTTPS) to protect all data transmitted during checkout. Payments are processed through PCI-DSS compliant payment providers. We never store your full card number.',
      },
      {
        q: 'Why has my payment been declined?',
        a: 'Payments can be declined for several reasons: incorrect card details, insufficient funds, your bank blocking the transaction, or a mismatch in billing address. Please check your details and try again, or contact your bank. If the problem persists, try an alternative payment method or contact us for help.',
      },
      {
        q: 'Will I be charged in GBP?',
        a: 'All prices on our website are displayed in GBP (British Pounds Sterling) by default. Our currency switcher allows you to view prices in other currencies for reference, but the charge on your card will be in GBP unless your card provider applies a conversion.',
      },
      {
        q: 'Do you offer buy now, pay later?',
        a: 'We do not currently offer buy now, pay later services. All orders must be paid in full at the time of purchase.',
      },
      {
        q: 'I was charged but my order was not confirmed — what should I do?',
        a: (
          <span>
            This can occasionally happen due to a connection error during checkout. Please contact us at{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">{CONTACT.email}</a>
            {' '}with the date, amount charged, and last 4 digits of the card used. We will investigate and either confirm your order or arrange a full refund within 1 business day.
          </span>
        ),
      },
    ],
  },
  {
    id: 'account',
    label: 'Account & Profile',
    icon: <User className="w-5 h-5" />,
    colour: 'bg-purple-50 text-purple-700 border-purple-200',
    intro: 'Manage your account, preferences and personal details.',
    items: [
      {
        q: 'How do I create an account?',
        a: (
          <span>
            Click{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign Up</Link>
            {' '}at the top of the page and enter your name, email address and a password. You will receive a confirmation email. Creating an account lets you track orders, view order history, and check out faster.
          </span>
        ),
      },
      {
        q: 'I\'ve forgotten my password — how do I reset it?',
        a: (
          <span>
            On the{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">login page</Link>
            , click &quot;Forgot Password&quot; and enter your email address. You will receive a reset link. If you do not receive the email within a few minutes, check your spam folder or contact us and we will reset it manually.
          </span>
        ),
      },
      {
        q: 'How do I update my email address or personal details?',
        a: (
          <span>
            Log into your account and visit the{' '}
            <Link href="/profile" className="text-primary font-semibold hover:underline">Profile</Link>
            {' '}page where you can update your name and email. For security, email changes may require re-verification.
          </span>
        ),
      },
      {
        q: 'How do I unsubscribe from marketing emails?',
        a: 'You can unsubscribe at any time by clicking the "Unsubscribe" link at the bottom of any marketing email we send. Alternatively, contact us at shop@snluxeafrica.uk and we will remove you from our mailing list immediately.',
      },
      {
        q: 'How do I delete my account?',
        a: (
          <span>
            To delete your account and all associated data, please email us at{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">{CONTACT.email}</a>
            {' '}with &quot;Delete My Account&quot; in the subject line. We will process your request within 30 days in accordance with UK GDPR. Please note that deleting your account will also delete your order history.
          </span>
        ),
      },
    ],
  },
  {
    id: 'sizing',
    label: 'Sizing & Products',
    icon: <PackageCheck className="w-5 h-5" />,
    colour: 'bg-teal-50 text-teal-700 border-teal-200',
    intro: 'Find the perfect fit and learn more about our authentic products.',
    items: [
      {
        q: 'How do I know what size to order?',
        a: 'Each product page includes a size guide specific to that garment. African print clothing can vary in sizing, so we recommend measuring yourself and comparing against the guide before ordering. When in doubt between two sizes, we advise sizing up.',
      },
      {
        q: 'Are all products authentic African fabric?',
        a: 'Yes. Every piece we sell is crafted from genuine African print fabric — Ankara, Kente, Kitenge, Dashiki and more. Our products are sourced directly from skilled artisans across Africa. We do not sell imitation or synthetic-print versions.',
      },
      {
        q: 'Can I order a custom or made-to-measure garment?',
        a: (
          <span>
            Yes, we offer custom orders for select styles. Contact us at{' '}
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">WhatsApp</a>
            {' '}or{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">email</a>
            {' '}to discuss your requirements, fabric preference, and measurements. Lead time for custom orders is typically 2–4 weeks.
          </span>
        ),
      },
      {
        q: 'The item I want is out of stock — will it come back?',
        a: (
          <span>
            Many of our products are limited-run due to the nature of handcrafted African fabrics. However, some styles are restocked. Contact us at{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">{CONTACT.email}</a>
            {' '}to register interest in a specific item and we will notify you if it becomes available.
          </span>
        ),
      },
      {
        q: 'How should I care for my garment?',
        a: 'Care instructions are printed on the label of every garment. In general, we recommend hand-washing or using a gentle machine cycle at 30°C for African print fabrics. Avoid tumble drying and iron on a low setting or steam on reverse to preserve the print vibrancy.',
      },
    ],
  },
]

// ── accordion item ────────────────────────────────────────────────────────────

function AccordionItem({ item, open, onToggle }: { item: QA; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        className="w-full flex items-start justify-between gap-4 py-4 text-left text-sm font-semibold text-gray-900 hover:text-black transition-colors"
        onClick={onToggle}
      >
        <span>{item.q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 mt-0.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function HelpClient() {
  const [activeSection, setActiveSection] = useState<string>('returns')
  const [openItem, setOpenItem] = useState<string | null>(null)

  const section = SECTIONS.find(s => s.id === activeSection)!

  return (
    <div className="pb-20">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="bg-black text-white py-14 px-4 text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-white/60" />
          <span className="text-xs font-bold tracking-widest uppercase text-white/60">Help Centre</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">How can we help?</h1>
        <p className="text-white/60 text-sm max-w-xl mx-auto">
          Find answers about returns, delivery, payments, orders and more. Can&apos;t find what you need? Contact us directly.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
          <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-black text-xs font-bold px-5 py-2.5 hover:bg-white/90 transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp Us
          </a>
          <a href={`mailto:${CONTACT.email}`}
            className="inline-flex items-center gap-2 border border-white/30 text-white text-xs font-bold px-5 py-2.5 hover:border-white transition-colors">
            <Mail className="w-3.5 h-3.5" />
            Email Us
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">

        {/* ── Topic Nav ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-10">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => { setActiveSection(s.id); setOpenItem(null) }}
              className={`flex flex-col items-center gap-2 p-4 border rounded-xl text-center transition-all text-xs font-semibold ${
                activeSection === s.id
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className={activeSection === s.id ? 'text-white' : 'text-gray-500'}>
                {s.icon}
              </span>
              {s.label}
            </button>
          ))}
        </div>

        {/* ── Active Section ────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left: section info */}
              <div className="lg:col-span-1">
                <div className={`border rounded-xl p-5 ${section.colour}`}>
                  <div className="mb-3">{section.icon}</div>
                  <h2 className="text-base font-extrabold mb-2">{section.label}</h2>
                  <p className="text-xs leading-relaxed opacity-80">{section.intro}</p>
                </div>

                {/* Quick contact in sidebar */}
                <div className="mt-4 border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-4">
                  <p className="text-xs font-bold text-gray-900 tracking-widest uppercase">Still need help?</p>
                  <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-xs text-gray-700 hover:text-black transition-colors">
                    <MessageCircle className="w-4 h-4 text-green-600 shrink-0" />
                    <span>WhatsApp — fastest response</span>
                  </a>
                  <a href={`mailto:${CONTACT.email}`}
                    className="flex items-center gap-3 text-xs text-gray-700 hover:text-black transition-colors">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{CONTACT.email}</span>
                  </a>
                  <div className="flex items-start gap-3 text-xs text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p>Mon–Fri 09:00–17:00</p>
                      <p>Sat 09:00–12:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: accordion */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
                  {section.items.map((item, idx) => {
                    const key = `${activeSection}-${idx}`
                    return (
                      <div key={key} className="px-5">
                        <AccordionItem
                          item={item}
                          open={openItem === key}
                          onToggle={() => setOpenItem(openItem === key ? null : key)}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Contact Banner ────────────────────────────────────────── */}
        <div className="mt-14 bg-black text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-base font-extrabold mb-1">Didn&apos;t find your answer?</h2>
            <p className="text-white/60 text-xs">Our team is on hand to help via WhatsApp, email or phone.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black text-xs font-bold px-5 py-2.5 hover:bg-white/90 transition-colors">
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
            <a href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center gap-2 border border-white/30 text-white text-xs font-bold px-5 py-2.5 hover:border-white transition-colors">
              <Mail className="w-3.5 h-3.5" />
              Email
            </a>
            <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 border border-white/30 text-white text-xs font-bold px-5 py-2.5 hover:border-white transition-colors">
              <Phone className="w-3.5 h-3.5" />
              Call
            </a>
          </div>
        </div>

        {/* ── Policy Links ─────────────────────────────────────────── */}
        <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-6 justify-center text-xs text-gray-400">
          <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms &amp; Conditions</Link>
          <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact Us</Link>
          <Link href="/faq" className="hover:text-gray-900 transition-colors">FAQs</Link>
        </div>

      </div>
    </div>
  )
}
