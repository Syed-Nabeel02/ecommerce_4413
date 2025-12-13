/**
 * OrderSummaryPanel.jsx
 * Final order review panel showing billing, payment, items, and totals.
 * Renamed from OrderSummary for better clarity.
 */

import React from 'react';

const OrderSummaryPanel = ({ totalPrice, cart, address, paymentMethod, paymentCard }) => {
  // Calculate subtotal from cart items
  const calculateSubtotal = () => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((total, item) => {
      return total + Number(item.price) * Number(item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();

  return (
    <div className="container mx-auto px-4 mb-8">
      <div className="flex flex-wrap">
        <div className="w-full lg:w-8/12 pr-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg shadow-xs bg-white">
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">Billing Address</h2>
              {address ? (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong className="text-slate-800">Building Name: </strong>
                    {address.buildingName || 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-slate-800">Street: </strong>
                    {address.street || 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-slate-800">City: </strong>
                    {address.city || 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-slate-800">State: </strong>
                    {address.state || 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-slate-800">Pincode: </strong>
                    {address.pincode || 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-slate-800">Country: </strong>
                    {address.country || 'N/A'}
                  </p>
                </div>
              ) : (
                <p className="text-red-600">
                  No address selected. Please go back and select an address.
                </p>
              )}
            </div>
            <div className="p-4 border rounded-lg shadow-xs bg-white">
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">Payment Method</h2>
              <p className="text-gray-700">
                <strong className="text-slate-800">Method: </strong>
                {paymentMethod === 'SAVED_CARD' && paymentCard
                  ? `Card ending in ${paymentCard.cardNumber?.slice(-4)}`
                  : paymentMethod === 'NEW_CARD'
                  ? 'Card'
                  : paymentMethod === 'COD'
                  ? 'Cash on Delivery'
                  : 'Not selected'}
              </p>
              {(paymentMethod === 'SAVED_CARD' || paymentMethod === 'NEW_CARD') && (
                <p className="text-sm text-gray-600 mt-2">
                  Payment will be processed on delivery
                </p>
              )}
            </div>

            <div className="p-4 border rounded-lg shadow-xs bg-white mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">Order Items</h2>
              <div className="space-y-3">
                {cart?.map((item) => (
                  <div key={item?.productId} className="flex items-center gap-3 py-2">
                    <img
                      src={`${import.meta.env.VITE_BACK_END_URL}/images/${item?.image}`}
                      alt="Product"
                      className="w-16 h-16 rounded-md object-cover border"
                    />
                    <div className="text-gray-700 flex-1">
                      <p className="font-semibold text-slate-800">{item?.productName}</p>
                      <p className="text-sm">
                        {item?.quantity} x ${Number(item?.price).toFixed(2)} ={' '}
                        <span className="font-semibold">
                          ${(Number(item?.quantity) * Number(item?.price)).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-4/12 mt-4 lg:mt-0">
          <div className="border rounded-lg shadow-xs bg-white p-6 space-y-4 sticky top-4">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800 border-b pb-2">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-lg font-semibold text-slate-800">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold text-slate-900">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPanel;
