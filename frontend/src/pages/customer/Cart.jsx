import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../redux/hooks.js';
import CartItem from '../../components/customer/CartItem.jsx';
import CartSummary from '../../components/customer/CartSummary.jsx';

export default function Cart() {
  const { items, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
        <Link to="/products" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>

        <div>
          <CartSummary />
          <Link
            to="/checkout"
            className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition text-center block"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}