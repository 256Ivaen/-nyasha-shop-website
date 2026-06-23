import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { BRAND, CONTACT } from '@/assets/content'

export const metadata: Metadata = {
  title: 'Terms & Conditions | SN Luxe Africa',
  description: 'Terms and conditions for shopping at SN Luxe Africa — your rights, our obligations, and how we operate.',
}

const LAST_UPDATED = '23 June 2026'

export default function TermsPage() {
  return (
    <div className="pb-20">

      {/* Hero */}
      <div className="bg-black text-white py-12 px-4 text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-white/60" />
          <span className="text-xs font-bold tracking-widest uppercase text-white/60">Legal</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Terms &amp; Conditions</h1>
        <p className="text-white/50 text-xs">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-10 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">1. About Us</h2>
          <p>
            These Terms &amp; Conditions govern your use of{' '}
            <a href={`https://${BRAND.domain}`} className="text-primary font-semibold hover:underline">{BRAND.domain}</a>
            {' '}and any purchase you make from us. By placing an order or using our website, you agree to these terms.
          </p>
          <p className="mt-2">
            <strong className="text-gray-800">{BRAND.name}</strong> is a UK-based retailer of authentic African print clothing and accessories.
            Contact us at{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">{CONTACT.email}</a>
            {' '}or {CONTACT.phone}.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">2. Your Account</h2>
          <p>
            When you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You must be at least 16 years old to create an account. You must provide accurate, current, and complete information during registration and keep it updated.
          </p>
          <p className="mt-2">
            We reserve the right to suspend or terminate accounts that breach these terms, are involved in fraudulent activity, or have been inactive for more than 3 years.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">3. Placing an Order</h2>
          <p>
            When you place an order, you are making an offer to purchase goods from us. Your order is only accepted when we send you an order confirmation email. We reserve the right to refuse or cancel any order at our discretion, in which case we will provide a full refund.
          </p>
          <p className="mt-2">
            All orders are subject to product availability. We will inform you promptly if an item you ordered is no longer available and offer a full refund or alternative.
          </p>
          <p className="mt-2">
            You are responsible for ensuring that all order details — including delivery address, sizes, and contact information — are accurate before completing checkout.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">4. Pricing &amp; Payment</h2>
          <p>
            All prices are displayed in GBP (£) and include VAT where applicable. We reserve the right to correct pricing errors. If an item is incorrectly priced, we will contact you before dispatch to confirm whether you wish to proceed at the correct price, or cancel for a full refund.
          </p>
          <p className="mt-2">
            Payment is due in full at the time of ordering. We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay. Payments are processed securely by our payment providers.
          </p>
          <p className="mt-2">
            We do not store full card details on our systems. All payment processing is subject to the terms of our payment providers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">5. Delivery</h2>
          <p>
            We aim to dispatch orders within 1–2 working days. Estimated delivery times are provided at checkout and in your confirmation email. These are estimates and not guaranteed.
          </p>
          <p className="mt-2">
            Risk of loss and title for products pass to you upon delivery. We are not responsible for delays caused by events outside our reasonable control (including postal service disruptions, extreme weather, or customs delays for international orders).
          </p>
          <p className="mt-2">
            For full details, see our{' '}
            <Link href="/help#delivery" className="text-primary font-semibold hover:underline">Delivery Information</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">6. Returns &amp; Refunds</h2>
          <p>
            You have the right to return most items within 30 days of receipt, in line with the UK Consumer Rights Act 2015 and the Consumer Contracts Regulations 2013.
          </p>
          <p className="mt-2">
            Items must be returned unworn, unwashed, and with all original tags attached. We reserve the right to refuse returns that do not meet these conditions.
          </p>
          <p className="mt-2">
            Refunds will be issued to the original payment method within 5–10 business days of receiving the return. For full details, see our{' '}
            <Link href="/help#returns" className="text-primary font-semibold hover:underline">Returns &amp; Refunds Policy</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">7. Product Descriptions</h2>
          <p>
            We make every effort to display products accurately, including images, colours, and sizing. However, colours may appear slightly differently depending on your screen settings. Product images are for illustrative purposes.
          </p>
          <p className="mt-2">
            Measurements in size guides are approximate. If you are unsure of your size, please contact us before ordering. We cannot be responsible for items ordered in an incorrect size where a size guide was available.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">8. Intellectual Property</h2>
          <p>
            All content on this website — including text, images, logos, design, and code — is the property of {BRAND.name} or its licensors and is protected by UK copyright law. You may not reproduce, distribute, or create derivative works without our written permission.
          </p>
          <p className="mt-2">
            You may share links to our website and use images for personal, non-commercial social media purposes provided you credit {BRAND.name}.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">9. Prohibited Use</h2>
          <p>You agree not to use our website to:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
            <li>Engage in any fraudulent, unlawful, or harmful activity.</li>
            <li>Scrape, crawl, or copy our website content without permission.</li>
            <li>Attempt to gain unauthorised access to our systems.</li>
            <li>Submit false or misleading information.</li>
            <li>Resell our products for commercial gain without our written consent.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">10. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, {BRAND.name} is not liable for any indirect, incidental, or consequential losses arising from your use of our website or products. Our total liability to you for any claim arising from a purchase shall not exceed the amount you paid for the relevant order.
          </p>
          <p className="mt-2">
            Nothing in these terms limits or excludes our liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded by law.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">11. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites (such as social media platforms and payment providers). We are not responsible for the content, privacy practices, or terms of those websites. Visiting linked sites is at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">12. Governing Law</h2>
          <p>
            These Terms &amp; Conditions are governed by and construed in accordance with the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">13. Changes to These Terms</h2>
          <p>
            We may update these Terms &amp; Conditions at any time. The most recent version will be published on this page with the updated date. Continued use of our website after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">14. Contact</h2>
          <p>For any questions about these terms, please contact us:</p>
          <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-1 text-gray-600">
            <p><strong className="text-gray-800">{BRAND.name}</strong></p>
            <p>Email: <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">{CONTACT.email}</a></p>
            <p>Phone: {CONTACT.phone}</p>
            <p>Address: {CONTACT.fullAddress}</p>
          </div>
        </section>

        {/* Footer nav */}
        <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-6 text-xs text-gray-400">
          <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link href="/help" className="hover:text-gray-900 transition-colors">Help &amp; Support</Link>
          <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact Us</Link>
        </div>

      </div>
    </div>
  )
}
