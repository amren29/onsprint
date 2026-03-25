'use client'

import Navbar from '@/components/store/Navbar'
import Footer from '@/components/store/Footer'
import { useStore } from '@/providers/store-context'

export default function TermsPage() {
  const { basePath } = useStore()

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>

        <div className="prose prose-sm prose-gray max-w-none space-y-6 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">1. General</h2>
            <p>
              By placing an order through our online store, you agree to the following terms and conditions.
              All orders are subject to availability and confirmation of the order price.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">2. Orders & Payment</h2>
            <p>
              All prices are displayed in Malaysian Ringgit (MYR) and are inclusive of applicable taxes unless stated otherwise.
              Payment must be completed before production begins. We accept online payments via FPX, credit/debit cards,
              e-wallets, and bank transfers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">3. Production & Delivery</h2>
            <p>
              Production timelines vary depending on the product type and quantity ordered.
              Estimated delivery times are provided at checkout and are not guaranteed.
              We will notify you if there are any delays to your order.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">4. Artwork & Files</h2>
            <p>
              Customers are responsible for ensuring that all uploaded artwork and files meet the required specifications.
              We are not liable for print quality issues caused by low-resolution or incorrectly formatted files.
              A proof may be provided for approval before production.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">5. Refunds & Cancellations</h2>
            <p>
              Orders may be cancelled before production begins. Once production has started, cancellations are not accepted.
              Refunds for defective products will be assessed on a case-by-case basis.
              Please contact us within 48 hours of receiving your order if there are any issues.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">6. Privacy</h2>
            <p>
              We collect personal information (name, email, phone, address) solely for order processing and delivery.
              Your information will not be shared with third parties except as required for payment processing and delivery.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">7. Contact</h2>
            <p>
              If you have any questions about these terms, please contact us through our store contact page.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
