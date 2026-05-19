import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8 mb-4">
          <div>
            <h3 className="font-bold mb-2">About</h3>
            <p className="text-gray-400">Your trusted online shopping destination</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Support</h3>
            <p className="text-gray-400">Email: support@eshop.com</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Legal</h3>
            <p className="text-gray-400">Privacy • Terms • Cookies</p>
          </div>
        </div>
        <hr className="border-gray-700 my-4" />
        <p className="text-center text-gray-400">© 2024 E-Shop. All rights reserved.</p>
      </div>
    </footer>
  );
}