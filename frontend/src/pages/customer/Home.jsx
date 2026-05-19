import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../../components/customer/ProductGrid.jsx';
import { productService } from '../../services/productService.js';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const data = await productService.getAllProducts({ limit: 8 });
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#020617] border border-gray-800/80 px-8 py-16 md:py-24 md:px-16 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-12 shadow-2xl">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            ✨ Next-Gen Shopping Experience
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-none text-white">
            Future of E-Commerce <br />
            <span className="text-gradient">Is Already Here</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light max-w-lg">
            Discover a curated collection of authentic items. Powered by smart database AI assistants for a custom shopping experience.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
            <Link
              to="/products"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition glow-btn"
            >
              Explore Products
            </Link>
            <a
              href="#promos"
              className="px-8 py-4 bg-gray-800/80 hover:bg-gray-700 border border-gray-700/80 text-gray-200 font-bold rounded-xl transition-all"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Floating Product Mock Visual */}
        <div className="relative z-10 hidden lg:block w-96 h-80 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-white/5 shadow-2xl backdrop-blur-md p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Premium Tech</span>
              <h3 className="text-xl font-bold text-white font-display">Neural Headset Pro</h3>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 rounded-lg">$299</span>
          </div>
          <div className="w-full h-32 rounded-lg bg-slate-950/60 flex items-center justify-center border border-white/5">
            <span className="text-5xl">🎧</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>⭐️ 4.9 (120 reviews)</span>
            <span className="text-emerald-400 font-semibold">● In Stock</span>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-display font-extrabold text-white">Featured Collections</h2>
            <p className="text-sm text-gray-400">Handpicked items selected for premium durability and quality</p>
          </div>
          <Link to="/products" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1">
            View All Products <span>→</span>
          </Link>
        </div>
        <ProductGrid products={products} loading={loading} />
      </div>

      {/* Promo Features Section */}
      <div id="promos" className="grid md:grid-cols-3 gap-6 pt-8">
        <div className="glass-card p-8 rounded-2xl flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <span className="text-4xl">🚚</span>
            <span className="px-2 py-0.5 rounded text-xxs font-extrabold uppercase tracking-wide bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Free</span>
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white mb-1">Global Free Shipping</h3>
            <p className="text-sm text-gray-400">Receive free deliveries directly to your home on orders above $50.</p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-2xl flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <span className="text-4xl">🛡️</span>
            <span className="px-2 py-0.5 rounded text-xxs font-extrabold uppercase tracking-wide bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Verified</span>
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white mb-1">Authentic Quality</h3>
            <p className="text-sm text-gray-400">100% verified authentic materials backed by an official warranty.</p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-2xl flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <span className="text-4xl">🤖</span>
            <span className="px-2 py-0.5 rounded text-xxs font-extrabold uppercase tracking-wide bg-purple-500/10 text-purple-300 border border-purple-500/20">AI Assistant</span>
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white mb-1">24/7 Smart Agent</h3>
            <p className="text-sm text-gray-400">Query stocks, track your orders, or explore categories via live AI.</p>
          </div>
        </div>
      </div>
    </div>
  );
}