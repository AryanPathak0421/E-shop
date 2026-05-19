import React from 'react';

export default function DashboardCard({ title, value, icon, color = 'blue' }) {
  const bgColors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`text-4xl p-4 rounded-lg ${bgColors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}