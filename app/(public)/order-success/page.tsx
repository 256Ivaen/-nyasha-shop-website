import Link from 'next/link'
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react'

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in py-12">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full flex flex-col items-center">
        
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8 max-w-sm">
          Thank you for your order. We have received your payment and are currently processing your order. You will receive an email confirmation shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link 
            href="/orders" 
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
          >
            <ShoppingBag size={18} />
            View Orders
          </Link>
          <Link 
            href="/collection" 
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  )
}
