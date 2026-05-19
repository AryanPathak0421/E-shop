import React, { useState } from 'react';
import { formatPrice, formatDate } from '../../utils/formatters.js';
import Modal from '../shared/Modal.jsx';

export default function ProductTable({ products, onEdit, onDelete, onAdd }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Product Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-right">Price</th>
              <th className="px-6 py-3 text-center">Stock</th>
              <th className="px-6 py-3 text-left">Created</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 font-medium">{product.name}</td>
                <td className="px-6 py-3">{product.category}</td>
                <td className="px-6 py-3 text-right">{formatPrice(product.price)}</td>
                <td className="px-6 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      product.stock > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-3">{formatDate(product.createdAt)}</td>
                <td className="px-6 py-3 text-center space-x-2">
                  <button
                    onClick={() => onEdit(product._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
      >
        <p className="mb-4">Are you sure you want to delete this product? This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onDelete(deleteConfirm);
              setDeleteConfirm(null);
            }}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => setDeleteConfirm(null)}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}