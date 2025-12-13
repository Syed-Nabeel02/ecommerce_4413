/**
 * OrderConfirmationView.jsx
 *
 * Order confirmation page displayed after successful checkout.
 * Shows success message and provides navigation options.
 *
 * ROUTE:
 * - /order-confirm (Protected route, requires authentication)
 *
 * KEY FEATURES:
 * - Success confirmation message
 * - Visual success indicator (green checkmark icon)
 * - Navigation options (Continue Shopping, Go to Home)
 *
 * DEPENDENCIES:
 * - react-icons/fa (FaCheckCircle icon)
 * - react-router-dom (Link navigation)
 */

import React from 'react'
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom'

const OrderConfirmationView = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
        <div className="p-8 rounded-lg shadow-lg text-center max-w-md mx-auto border border-gray-200">
            <div className="text-green-500 mb-4 flex justify-center">
                <FaCheckCircle size={64} />
            </div>
            <h2 className='text-3xl font-bold text-gray-800 mb-2'>Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
                Thank you for your order! Your order has been placed successfully and we're
                processing it. You will receive a confirmation email shortly.
            </p>
            <div className="flex gap-4 justify-center">
                <Link
                    to="/products"
                    className="bg-custom-blue text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Continue Shopping
                </Link>
                <Link
                    to="/"
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    </div>
  )
}

export default OrderConfirmationView