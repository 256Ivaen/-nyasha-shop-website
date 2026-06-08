'use client'

import Image from 'next/image'
import { assets } from '@/assets/assets'
import { motion } from 'framer-motion'
import Link from 'next/link'

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
    <div className="min-h-screen pt-4 sm:pt-6 pb-16">
      <motion.div className="text-center mb-8" initial="hidden" animate="visible" variants={fadeInUp}>
        <h1 className="text-xs font-bold text-gray-900 mb-2 tracking-widest uppercase">About Us</h1>
        <p className="text-xs text-gray-600">Learn more about SN Luxe Africa and our commitment to quality</p>
      </motion.div>

      <motion.div className="flex flex-col md:flex-row gap-8 mb-12" initial="hidden" animate="visible" variants={stagger}>
        <motion.div className="flex-1" variants={fadeInUp}>
          <Image src={assets.about_img} alt="About SN Luxe Africa" width={600} height={400} className="w-full h-auto rounded-lg object-cover border border-edge" />
        </motion.div>
        <motion.div className="flex-1 space-y-4" variants={fadeInUp}>
          <h2 className="text-xs font-bold text-gray-900 tracking-widest uppercase">Our Story</h2>
          <p className="text-gray-600 text-xs leading-relaxed">
            SN Luxe Africa is your trusted distributor of quality products in Kampala, Uganda.
            We are dedicated to bringing you the best products at affordable prices, delivered right to your door.
          </p>
          <p className="text-gray-600 text-xs leading-relaxed">
            Our mission is to provide affordable, high-quality products that meet the everyday needs of Ugandan households and businesses.
            We believe everyone deserves access to the best products.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { label: 'Products',            value: '200+' },
              { label: 'Satisfied Customers', value: '1000+' },
              { label: 'Years in Business',   value: '5+' },
              { label: 'Deliveries Made',     value: '5000+' },
            ].map(stat => (
              <div key={stat.label} className="bg-primary-subtle p-4 text-center border border-edge-light">
                <p className="text-xs font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="bg-primary text-white p-8 text-center"
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
      >
        <h2 className="text-xs font-bold mb-3 tracking-widest uppercase">Visit Us in Kampala</h2>
        <p className="text-primary-foreground text-xs mb-4">Come find us and browse our full range of products in person.</p>
        <Link href="/contact" className="inline-block bg-white text-primary font-semibold text-xs px-6 py-2 hover:bg-primary-subtle transition-colors">
          Contact Us
        </Link>
      </motion.div>
    </div>
  )
}
