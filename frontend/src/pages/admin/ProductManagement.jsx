import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar.jsx';
import ProductTable from '../../components/admin/ProductTable.jsx';
import Modal from '../../components/shared/Modal.jsx';
import { productService } from '../../services/productService.js';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts({ limit: 100 });
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({ name: '', price: '', description: '', category: '', stock: '', imageUrl: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    const product = products.find((p) => p._id === id);
    if (product) {
      setFormData(product);
      setEditingId(id);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await productService.updateProduct(editingId, formData);
      } else {
        await productService.createProduct(formData);
      }
      fetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      alert('Error saving product');
    }
  };

  return (
    <div className="flex gap-6">
      <Sidebar />

      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Product
          </button>
        </div>

        {loading ? <div>Loading...</div> : <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} />}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? 'Edit Product' : 'Add Product'}
        >
          <form onSubmit={handleSave} className="space-y-3">
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="w-full border rounded px-3 py-2"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="url"
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
}