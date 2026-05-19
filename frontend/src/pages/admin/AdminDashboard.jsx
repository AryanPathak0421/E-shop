import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar.jsx';
import DashboardCard from '../../components/admin/DashboardCard.jsx';
import { productService } from '../../services/productService.js';
import { orderService } from '../../services/orderService.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsData, ordersData] = await Promise.all([
        productService.getAllProducts({ limit: 1 }),
        orderService.getAllOrders({ limit: 1 }),
      ]);

      const totalRevenue = ordersData.orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const pendingOrders = ordersData.orders.filter((o) => o.orderStatus === 'pending').length;

      setStats({
        totalProducts: productsData.pagination.total,
        totalOrders: ordersData.pagination.total,
        totalRevenue,
        pendingOrders,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="flex gap-6">
      <Sidebar />

      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <DashboardCard
            title="Total Products"
            value={stats.totalProducts}
            icon="📦"
            color="blue"
          />
          <DashboardCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="📋"
            color="green"
          />
          <DashboardCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon="💰"
            color="purple"
          />
          <DashboardCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon="⏳"
            color="orange"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Welcome to Admin Panel</h2>
          <p className="text-gray-600">
            Use the sidebar to manage products, view orders, and upload bulk inventory.
          </p>
        </div>
      </div>
    </div>
  );
}