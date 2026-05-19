import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../redux/hooks.js';
import { useAppDispatch } from '../../redux/hooks.js';
import { clearCart } from '../../redux/slices/cartSlice.js';
import { orderService } from '../../services/orderService.js';
import CartSummary from '../../components/customer/CartSummary.jsx';

export default function Checkout() {
  const { items, totalPrice } = useCart();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await orderService.createOrder({
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
      });

      dispatch(clearCart());
      navigate('/orders');
      alert('Order placed successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Street Address"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              required
              className="w-full border rounded px-3 py-2"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                className="border rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="ZIP Code"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                required
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
                className="border rounded px-3 py-2"
              />
            </div>

            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="w-full border rounded px-3 py-2"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}