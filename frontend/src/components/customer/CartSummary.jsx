import React from 'react';
import { useCart } from '../../redux/hooks.js';
import { formatPrice } from '../../utils/formatters.js';

export default function CartSummary() {
  const { totalPrice, items } = useCart();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-2 border-b pb-4 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>{formatPrice(totalPrice * 0.1)}</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-lg mb-4">
        <span>Total</span>
        <span>{formatPrice(totalPrice * 1.1)}</span>
      </div>

      <p className="text-sm text-gray-500">
        {items.length} item{items.length !== 1 ? 's' : ''} in cart
      </p>
    </div>
  );
}