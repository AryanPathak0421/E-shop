import React from 'react';
import { useAppDispatch } from '../../redux/hooks.js';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice.js';
import { formatPrice } from '../../utils/formatters.js';

export default function CartItem({ item }) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex gap-4 items-center p-4 border rounded-lg bg-white">
      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
        📦
      </div>

      <div className="flex-1">
        <h3 className="font-bold">{item.name}</h3>
        <p className="text-gray-600">{formatPrice(item.price)} each</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))
          }
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          −
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() =>
            dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))
          }
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
        <button
          onClick={() => dispatch(removeFromCart(item.productId))}
          className="text-red-600 text-sm hover:underline mt-1"
        >
          Remove
        </button>
      </div>
    </div>
  );
}