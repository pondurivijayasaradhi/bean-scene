import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:8080/api';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    featured: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setMessage('❌ Could not load products. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: parseFloat(form.price) || 0
    };

    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/products/${form.id}`, payload);
        setMessage('✅ Product updated successfully!');
      } else {
        await axios.post(`${API_BASE}/products`, payload);
        setMessage('✅ Product added successfully!');
      }

      setForm({ id: null, name: '', description: '', price: '', imageUrl: '', featured: false });
      setIsEditing(false);
      fetchProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error saving product:', err);
      setMessage('❌ Error saving product');
    }
  };

  const handleEdit = (product) => {
    setForm({ ...product, price: String(product.price) });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_BASE}/products/${id}`);
        setMessage('🗑️ Product deleted successfully!');
        fetchProducts();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        console.error('Error deleting product:', err);
        setMessage('❌ Error deleting product');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-amber-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your coffee products</p>
          </div>
          <Link
            to="/"
            className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-full font-medium transition"
          >
            ← Back to Website
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-xl text-center font-medium">
            {message}
          </div>
        )}

        {/* Add / Edit Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            {isEditing ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="e.g. Cappuccino"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="4.50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Rich espresso with steamed milk foam"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="https://example.com/coffee.jpg"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-5 h-5 accent-amber-600"
              />
              <label className="text-gray-700 font-medium">Mark as Featured</label>
            </div>

            <div className="md:col-span-2 flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setForm({ id: null, name: '', description: '', price: '', imageUrl: '', featured: false });
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-amber-900">All Products ({products.length})</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No products found. Add your first product above!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-amber-50 text-amber-900">
                  <tr>
                    <th className="p-4 font-semibold">Image</th>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Featured</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <img
                          src={p.imageUrl || "https://placehold.co/80x80?text=Coffee"}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => { e.target.src = "https://placehold.co/80x80?text=Coffee"; }}
                        />
                      </td>
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4 font-semibold text-amber-700">₹{p.price}</td>
                      <td className="p-4">
                        {p.featured ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Yes</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">No</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(p)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;