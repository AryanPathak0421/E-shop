import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch } from './redux/hooks.js';
import { loadUserFromStorage } from './redux/slices/authSlice.js';

import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import ProtectedRoute from './components/shared/ProtectedRoute.jsx';
import ChatBot from './components/shared/ChatBot.jsx';

// Customer Pages
import Home from './pages/customer/Home.jsx';
import Products from './pages/customer/Products.jsx';
import ProductDetail from './pages/customer/ProductDetail.jsx';
import Cart from './pages/customer/Cart.jsx';
import Checkout from './pages/customer/Checkout.jsx';
import Orders from './pages/customer/Orders.jsx';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ProductManagement from './pages/admin/ProductManagement.jsx';
import OrderManagement from './pages/admin/OrderManagement.jsx';
import BulkUpload from './pages/admin/BulkUpload.jsx';

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Routes>
                    <Route path="" element={<AdminDashboard />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="bulk-upload" element={<BulkUpload />} />
                    <Route path="*" element={<Navigate to="/admin" />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
        <ChatBot />
      </div>
    </Router>
  );
}