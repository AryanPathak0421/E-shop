import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService.js';
import { formatPrice, formatDate } from '../../utils/formatters.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getUserOrders();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold">Order ID: {order._id.substring(0, 8)}</h3>
                <p className="text-sm text-gray-600">Placed: {formatDate(order.createdAt)}</p>
              </div>
              <span
                className={`px-3 py-1 rounded text-sm ${
                  order.orderStatus === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : order.orderStatus === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="mb-4">
              <p className="font-bold mb-2">Items ({order.items.length}):</p>
              <ul className="text-sm space-y-1">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.productName} × {item.quantity} = {formatPrice(item.price * item.quantity)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <span>Total Amount:</span>
              <span className="font-bold text-lg">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}