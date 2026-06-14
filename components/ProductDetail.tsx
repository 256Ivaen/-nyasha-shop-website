'use client'

import { useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ShopContext } from '@/contexts/ShopContext'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import RelatedProducts from '@/components/RelatedProducts'
import ProductReviews from '@/components/ProductReviews'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { CheckCircle, ShoppingBag, MapPin, Clock, Globe, Package } from 'lucide-react'
import Button from '@/components/Button'
import type { Product } from '@/contexts/ShopContext'

export default function ProductDetail() {
  const pathname = usePathname()
  // pathname is /product/{slug} or /product/_ (shell)
  const slug = pathname.split('/').filter(Boolean).pop() ?? ''
  const ctx = useContext(ShopContext)!
  const { products, currency, displayPrice, addToCart, currencyLoading } = ctx
  const [productData, setProductData] = useState<Product | null>(null)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    if (!slug || slug === '_') return
    const found = products.find(p => p.slug === slug)
    if (found) {
      setProductData(found)
      setImage(found.image?.[0] ?? '')
      window.scrollTo(0, 0)
    }
  }, [slug, products])

  if (!productData) {
    return (
      <div className="pt-10 pb-16 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if ((productData.sizes?.length ?? 0) > 0 && !size) {
      toast.error('Please select a size')
      return
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(productData._id, size || 'default')
    }
  }

  return (
    <div className="pt-10 pb-16">
      <div className="flex gap-6 flex-col sm:flex-row">
        {/* Thumbnails */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full gap-2">
            {productData.image?.map((img, i) => (
              <div key={i}
                className={`relative w-[24%] sm:w-full aspect-square cursor-pointer rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${image === img ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setImage(img)}>
                <Image src={img} alt={`${productData.name} view ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden">
              <Image src={image || assets.logo} alt={productData.name} fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Info */}
        <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xs font-semibold text-gray-900 mb-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Image key={i} src={assets.star_icon} alt="star" width={14} height={14} />
            ))}
            <Image src={assets.star_dull_icon} alt="half star" width={14} height={14} />
            <span className="text-xs text-gray-500 ml-2">(122)</span>
          </div>
          {currencyLoading ? (
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4" />
          ) : (
            <p className="text-xs font-bold text-primary mb-4">{displayPrice(productData.price ?? 0)}</p>
          )}
          <p className="text-gray-600 text-xs leading-relaxed mb-6">{productData.description}</p>

          {(productData.sizes?.length ?? 0) > 0 && (
            <div className="mb-6">
              <p className="text-xs font-medium text-gray-700 mb-2">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {productData.sizes?.map(s => (
                  <button type="button" key={s} onClick={() => setSize(s)}
                    className={`px-4 py-2 text-xs border rounded-lg transition-colors ${size === s ? 'border-primary bg-primary text-white' : 'border-gray-300 hover:border-primary'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + action row */}
          <div className="flex items-center gap-2 mb-6">
            {/* Qty stepper */}
            <div className="flex items-center border border-edge rounded-full overflow-hidden shrink-0">
              <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-2 text-xs text-ink-muted hover:text-ink hover:bg-primary-subtle transition-colors">−</button>
              <span className="px-3 py-2 text-xs font-bold text-ink tabular-nums min-w-[2rem] text-center">{quantity}</span>
              <button type="button" onClick={() => setQuantity(q => q + 1)}
                className="px-3 py-2 text-xs text-ink-muted hover:text-ink hover:bg-primary-subtle transition-colors">+</button>
            </div>

            {/* VIEW CART — flex-1 wide */}
            <a href="/cart" className="flex-1 min-w-0">
              <Button variant="outline" fullWidth size="lg">VIEW CART</Button>
            </a>

            {/* ADD — compact rounded-full icon button */}
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label="Add to cart"
              className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>

          <div className="border-t pt-4 space-y-2 mb-5">
            {['100% Authentic African print fabric', 'Easy returns within 30 days', 'Secure checkout'].map(text => (
              <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Shipping & stock info */}
          <div className="rounded-xl border border-edge bg-[#F9F6F0] p-4 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Shipping &amp; Delivery</p>

            {productData.stock_location && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-800">
                    Stock Location: {productData.stock_location === 'UK' ? '🇬🇧 United Kingdom' : productData.stock_location === 'Zimbabwe' ? '🇿🇼 Zimbabwe' : productData.stock_location}
                  </p>
                  {productData.stock_location === 'Zimbabwe' && (
                    <p className="text-[11px] text-gray-500 mt-0.5">Allow extra 5–7 days for Zimbabwe stock to be dispatched from Zimbabwe to the UK.</p>
                  )}
                </div>
              </div>
            )}

            {productData.dispatch_days != null && (
              <div className="flex items-start gap-2.5">
                <Clock className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-gray-700">
                  Dispatched within <span className="font-semibold">{productData.dispatch_days} {productData.dispatch_days === 1 ? 'business day' : 'business days'}</span> of order
                </p>
              </div>
            )}

            <div className="flex items-start gap-2.5">
              <Package className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-gray-700">
                UK delivery via <span className="font-semibold">Royal Mail</span> — 2–4 working days
              </p>
            </div>

            {productData.ships_worldwide && (
              <div className="flex items-start gap-2.5">
                <Globe className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-gray-700">
                  <span className="font-semibold">Ships worldwide</span> — international delivery available
                </p>
              </div>
            )}

            {productData.shipping_notes && (
              <p className="text-[11px] text-gray-500 border-t border-edge pt-2.5 mt-1">
                {productData.shipping_notes}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="mt-16">
        <div className="flex border-b gap-8">
          {['description', 'shipping', 'reviews'].map(tab => (
            <button type="button" key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab === 'reviews' ? 'Reviews' : tab === 'shipping' ? 'Shipping' : 'Description'}
            </button>
          ))}
        </div>
        <div className="py-6 text-xs text-gray-600 leading-relaxed">
          {activeTab === 'description' && productData.description}
          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-lg">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Stock Location</p>
                  <p>{productData.stock_location === 'UK' ? '🇬🇧 United Kingdom — ready to dispatch from UK' : productData.stock_location === 'Zimbabwe' ? '🇿🇼 Zimbabwe — shipped to the UK before UK delivery' : (productData.stock_location ?? 'United Kingdom')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Dispatch Time</p>
                  <p>Orders dispatched within {productData.dispatch_days ?? 2} {(productData.dispatch_days ?? 2) === 1 ? 'business day' : 'business days'} of payment confirmation.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 mb-1">UK Delivery</p>
                  <p>Delivered via Royal Mail. Estimated 2–4 working days after dispatch. Free UK delivery on orders over £75.</p>
                </div>
              </div>
              {productData.ships_worldwide && (
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">International Delivery</p>
                    <p>This item ships worldwide. International delivery times vary by destination. Contact us at shop@snluxeafrica.uk for rates.</p>
                  </div>
                </div>
              )}
              {productData.shipping_notes && (
                <div className="p-3 bg-[#F9F6F0] rounded-lg border border-edge text-[11px]">
                  <span className="font-semibold text-gray-700">Note: </span>{productData.shipping_notes}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full reviews section */}
      <ProductReviews productId={productData._id} />

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentId={productData._id} />
    </div>
  )
}
