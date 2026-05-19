import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '📋' },
    { path: '/admin/bulk-upload', label: 'Bulk Upload', icon: '📤' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-3 rounded transition ${
              location.pathname === item.path
                ? 'bg-blue-600 font-bold'
                : 'hover:bg-gray-800'
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}