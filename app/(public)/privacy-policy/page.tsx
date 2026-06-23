import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { BRAND, CONTACT } from '@/assets/content'

export const metadata: Metadata = {
  title: 'Privacy Policy | SN Luxe Africa',
  description: 'How SN Luxe Africa collects, uses and protects your personal data — UK GDPR compliant.',
}

const LAST_UPDATED = '23 June 2026'

export default function PrivacyPolicyPage() {
  return (
    <div className="pb-20">

      {/* Hero */}
      <div className="bg-black text-white py-12 px-4 text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-white/60" />
          <span className="text-xs font-bold tracking-widest uppercase text-white/60">Legal</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-white/50 text-xs">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-10 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">1. Who We Are</h2>
          <p>
            {BRAND.name} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website{' '}
            <a href={`https://${BRAND.domain}`} className="text-primary font-semibold hover:underline">{BRAND.domain}</a>
            . We are the data controller responsible for your personal data.
          </p>
          <p className="mt-2">
            Contact: <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">{CONTACT.email}</a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">2. What Data We Collect</h2>
          <p>We collect and process the following categories of personal data:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
            <li><strong className="text-gray-800">Identity data</strong> — your first and last name.</li>
            <li><strong className="text-gray-800">Contact data</strong> — email address, phone number, delivery address.</li>
            <li><strong className="text-gray-800">Transaction data</strong> — details of products you have purchased and payment reference numbers. We do not store full card numbers.</li>
            <li><strong className="text-gray-800">Technical data</strong> — IP address, browser type, device identifiers, pages visited, time spent on site (collected via cookies and analytics tools).</li>
            <li><strong className="text-gray-800">Account data</strong> — username, encrypted password, saved preferences.</li>
            <li><strong className="text-gray-800">Communications data</strong> — messages you send us via email, WhatsApp, or our contact form.</li>
            <li><strong className="text-gray-800">Marketing data</strong> — your preferences for receiving marketing communications from us.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">3. How We Use Your Data</h2>
          <p>We use your personal data for the following purposes, and only where we have a valid legal basis to do so:</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-800">Purpose</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-800">Legal Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['Process and fulfil your orders', 'Contractual necessity'],
                  ['Send order confirmations and shipping updates', 'Contractual necessity'],
                  ['Manage your account', 'Contractual necessity'],
                  ['Process returns and refunds', 'Contractual necessity'],
                  ['Respond to enquiries and complaints', 'Legitimate interests'],
                  ['Send marketing emails (with your consent)', 'Consent'],
                  ['Improve our website and service', 'Legitimate interests'],
                  ['Detect and prevent fraud', 'Legitimate interests / Legal obligation'],
                  ['Comply with legal obligations', 'Legal obligation'],
                ].map(([purpose, basis]) => (
                  <tr key={purpose}>
                    <td className="p-3 border border-gray-200 text-gray-600">{purpose}</td>
                    <td className="p-3 border border-gray-200 text-gray-600">{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">4. Cookies</h2>
          <p>
            Our website uses cookies to improve your experience. Cookies are small text files stored on your device. We use:
          </p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
            <li><strong className="text-gray-800">Strictly necessary cookies</strong> — required for the website to function (e.g., session, currency preference, stock location preference).</li>
            <li><strong className="text-gray-800">Analytics cookies</strong> — help us understand how visitors use the website so we can improve it.</li>
            <li><strong className="text-gray-800">Preference cookies</strong> — remember your settings such as currency and language preferences.</li>
          </ul>
          <p className="mt-3">
            You can control cookie settings in your browser. Disabling strictly necessary cookies may affect website functionality.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">5. Who We Share Your Data With</h2>
          <p>We do not sell your personal data. We may share it with trusted third parties only as necessary:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
            <li><strong className="text-gray-800">Payment processors</strong> — PayPal, Stripe and card networks process your payment. We only receive a transaction reference.</li>
            <li><strong className="text-gray-800">Delivery carriers</strong> — Royal Mail and international couriers receive your name and delivery address to fulfil your order.</li>
            <li><strong className="text-gray-800">IT service providers</strong> — hosting, email, and analytics providers who process data on our behalf under strict data processing agreements.</li>
            <li><strong className="text-gray-800">Legal authorities</strong> — where required by law or to prevent fraud.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">6. International Transfers</h2>
          <p>
            Some of our service providers may be located outside the UK. Where data is transferred internationally, we ensure appropriate safeguards are in place (such as Standard Contractual Clauses or adequacy decisions) in accordance with UK GDPR.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">7. Data Retention</h2>
          <p>We retain your personal data only for as long as necessary:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
            <li>Order data is retained for 7 years for accounting and legal compliance purposes.</li>
            <li>Account data is retained while your account is active and for up to 2 years after your last login.</li>
            <li>Marketing consent records are retained until you withdraw consent.</li>
            <li>Customer service communications are retained for 2 years.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">8. Your Rights</h2>
          <p>Under UK GDPR, you have the following rights regarding your personal data:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
            <li><strong className="text-gray-800">Right of access</strong> — request a copy of the data we hold about you.</li>
            <li><strong className="text-gray-800">Right to rectification</strong> — ask us to correct inaccurate data.</li>
            <li><strong className="text-gray-800">Right to erasure</strong> — ask us to delete your data (subject to legal obligations).</li>
            <li><strong className="text-gray-800">Right to restrict processing</strong> — ask us to limit how we use your data.</li>
            <li><strong className="text-gray-800">Right to data portability</strong> — receive your data in a structured, machine-readable format.</li>
            <li><strong className="text-gray-800">Right to object</strong> — object to processing based on legitimate interests or for marketing.</li>
            <li><strong className="text-gray-800">Right to withdraw consent</strong> — withdraw consent for marketing at any time.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">{CONTACT.email}</a>
            . We will respond within 30 days. You also have the right to lodge a complaint with the{' '}
            <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
              Information Commissioner&apos;s Office (ICO)
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">9. Security</h2>
          <p>
            We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure. These include SSL/TLS encryption, hashed passwords, and restricted staff access.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">10. Children&apos;s Privacy</h2>
          <p>
            Our website is not directed at children under the age of 16. We do not knowingly collect personal data from anyone under 16. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The most recent version will always be available on this page with the &quot;Last updated&quot; date. Continued use of our website after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-gray-900 mb-3">12. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle your data, please contact us:
          </p>
          <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-1 text-gray-600">
            <p><strong className="text-gray-800">{BRAND.name}</strong></p>
            <p>Email: <a href={`mailto:${CONTACT.email}`} className="text-primary font-semibold hover:underline">{CONTACT.email}</a></p>
            <p>Phone: {CONTACT.phone}</p>
            <p>Address: {CONTACT.fullAddress}</p>
          </div>
        </section>

        {/* Footer nav */}
        <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-6 text-xs text-gray-400">
          <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms &amp; Conditions</Link>
          <Link href="/help" className="hover:text-gray-900 transition-colors">Help &amp; Support</Link>
          <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact Us</Link>
        </div>

      </div>
    </div>
  )
}
