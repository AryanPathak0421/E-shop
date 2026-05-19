import React from 'react';
import { formatPrice, formatDate } from '../../utils/formatters.js';

export default function OrderTable({ orders, onStatusChange }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left">Order ID</th>
            <th className="px-6 py-3 text-left">Customer</th>
            <th className="px-6 py-3 text-right">Total</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order._id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-3 font-mono text-sm">{order._id.substring(0, 8)}...</td>
              <td className="px-6 py-3">{order.userId?.name || 'Unknown'}</td>
              <td className="px-6 py-3 text-right font-bold">{formatPrice(order.totalAmount)}</td>
              <td className="px-6 py-3">
                <select
                  value={order.orderStatus}
                  onChange={(e) => onStatusChange(order._id, e.target.value)}
                  className={`px-2 py-1 rounded text-sm ${
                    order.orderStatus === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.orderStatus === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="px-6 py-3">{formatDate(order.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}