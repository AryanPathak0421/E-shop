import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthHook } from '../../hooks/useAuth.js';
import { useCart } from '../../redux/hooks.js';

export default function Header() {
  const { user, isAuthenticated, logoutUser } = useAuthHook();
  const { totalQuantity } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-display font-extrabold flex items-center gap-2 hover:opacity-90 transition">
          <span className="text-gradient">🛍️ E-Shop</span>
        </Link>

        <nav className="flex gap-8 items-center text-sm font-medium text-gray-300">
          <Link to="/" className="hover:text-primary transition-colors py-1">
            Home
          </Link>
          <Link to="/products" className="hover:text-primary transition-colors py-1">
            Products
          </Link>

          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="text-gradient-emerald font-bold hover:opacity-85 transition-opacity py-1">
              Admin Panel
            </Link>
          )}

          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-5 py-2 text-gray-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-95 transition glow-btn text-sm font-semibold"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/cart" className="relative flex items-center gap-2 hover:text-primary transition-colors py-1">
                <span>🛒</span>
                <span>Cart</span>
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                    {totalQuantity}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="hover:text-primary transition-colors py-1">
                Orders
              </Link>
              <div className="flex items-center gap-3 pl-3 border-l border-gray-800">
                <span className="text-gray-400 font-semibold max-w-[100px] truncate text-xs">
                  {user?.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 text-gray-300 hover:bg-rose-950 hover:text-rose-200 hover:border-rose-900 rounded-lg text-xs font-semibold transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}