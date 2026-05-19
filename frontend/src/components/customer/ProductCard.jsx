import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks.js';
import { addToCart } from '../../redux/slices/cartSlice.js';
import { formatPrice } from '../../utils/formatters.js';

export default function ProductCard({ product }) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
        price: product.price,
        name: product.name,
      })
    );
  };

  return (
    <Link to={`/products/${product._id}`}>
      <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group">
        {/* Product Image Section */}
        <div className="relative aspect-square bg-[#0f172a] flex items-center justify-center overflow-hidden border-b border-gray-800/60">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="text-gray-600 text-5xl group-hover:scale-115 transition-transform duration-300">📦</span>
          )}
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/70 border border-white/5 rounded-lg text-[10px] font-extrabold tracking-wider uppercase text-indigo-300 backdrop-blur-md">
            {product.category}
          </span>
        </div>

        {/* Info & Cart CTA */}
        <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
          <div>
            <h3 className="font-display font-bold text-white text-base truncate group-hover:text-primary transition-colors duration-200">
              {product.name}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-display font-extrabold text-white">
                {formatPrice(product.price)}
              </p>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  product.stock > 0 ? 'badge-emerald' : 'badge-rose'
                }`}
              >
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-800 text-white font-bold rounded-xl border border-indigo-500/20 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2 glow-btn"
          >
            <span>🛒</span> Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}