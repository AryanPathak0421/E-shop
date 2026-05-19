import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks.js';
import { addToCart } from '../../redux/slices/cartSlice.js';
import { productService } from '../../services/productService.js';
import { formatPrice } from '../../utils/formatters.js';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      setProduct(data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        quantity,
        price: product.price,
        name: product.name,
      })
    );
    alert('Added to cart!');
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  return (
    <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-lg">
      <div>
        <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl">📦</span>
          )}
        </div>
      </div>

      <div>
        <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.category}</p>

        <p className="text-3xl font-bold text-blue-600 mb-4">{formatPrice(product.price)}</p>

        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Stock Status</p>
          <span
            className={`px-3 py-1 rounded-full ${
              product.stock > 0
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Description</p>
          <p className="text-gray-700">{product.description}</p>
        </div>

        {product.stock > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-medium">Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stock}
                className="border rounded px-3 py-2 w-20"
              />
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}