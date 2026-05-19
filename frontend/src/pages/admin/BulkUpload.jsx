import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar.jsx';
import Modal from '../../components/shared/Modal.jsx';
import { productService } from '../../services/productService.js';

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['.csv', '.xlsx', '.xls'];
      const isValid = validTypes.some((type) => selectedFile.name.toLowerCase().endsWith(type));
      
      if (isValid) {
        setFile(selectedFile);
      } else {
        alert('Please select a CSV or Excel file');
        setFile(null);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const data = await productService.bulkUpload(file);
      setResults(data.results);
      setShowResults(true);
      setFile(null);
    } catch (error) {
      alert(error.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-6">
      <Sidebar />

      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6">Bulk Product Upload</h1>

        <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Upload Products</h2>

          <p className="text-gray-600 mb-4 text-sm">
            Upload a CSV or Excel file with columns: name, price, description, category, stock, imageUrl
          </p>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                disabled={loading}
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="text-4xl mb-2">📁</div>
                <p className="font-bold mb-1">{file?.name || 'Choose file or drag and drop'}</p>
                <p className="text-sm text-gray-600">CSV or Excel files only</p>
              </label>
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Uploading...' : 'Upload Products'}
            </button>
          </form>

          {results && (
            <div className="mt-6 p-4 bg-blue-50 rounded">
              <p className="font-bold mb-2">
                ✓ {results.successCount} products added successfully
              </p>
              {results.failureCount > 0 && (
                <p className="text-red-600 mb-2">✗ {results.failureCount} products failed</p>
              )}
              <button
                onClick={() => setShowResults(true)}
                className="text-blue-600 hover:underline text-sm"
              >
                View details
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        title="Upload Results"
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {results?.insertedProducts?.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">✓ Successfully Added:</h3>
              <ul className="text-sm space-y-1">
                {results.insertedProducts.map((p) => (
                  <li key={p.id} className="text-green-700">
                    {p.name} - ${p.price}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results?.errors?.length > 0 && (
            <div>
              <h3 className="font-bold text-red-600 mb-2">✗ Errors:</h3>
              <ul className="text-sm space-y-1">
                {results.errors.map((e, i) => (
                  <li key={i} className="text-red-700">
                    Row {e.row}: {e.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}