import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    featured: false
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data || []);
    } catch (err) {
      setMessage('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const resetForm = () => {
    setForm({ id: null, name: '', description: '', price: '', imageUrl: '', featured: false });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: parseFloat(form.price) };

      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/products/${form.id}`, payload);
        setMessage('✅ Product updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/products`, payload);
        setMessage('✅ Product added successfully!');
      }

      resetForm();
      fetchProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Error saving product');
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl || '',
      featured: product.featured || false
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/products/${id}`);
        setMessage('🗑️ Product deleted successfully!');
        fetchProducts();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setMessage('❌ Error deleting product');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#4a2c0a]">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your coffee products</p>
          </div>
          <Link to="/" className="bg-[#4a2c0a] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#3a2208] transition">
            ← Back to Website
          </Link>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium">
            {message}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
          <h2 className="text-xl font-bold text-[#4a2c0a] mb-6">
            {isEditing ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price ($) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required step="0.01"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows="3"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-5 h-5" />
              <label className="font-medium">Mark as Featured</label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="bg-[#4a2c0a] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#3a2208] transition">
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="bg-gray-400 text-white font-semibold py-3 px-8 rounded-xl">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-[#4a2c0a]">All Products ({products.length})</h2>
          </div>

          {loading ? (
            <p className="p-10 text-center text-gray-500">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f8f5f0]">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <img src={p.imageUrl || "https://via.placeholder.com/60"} alt={p.name}
                          className="w-14 h-14 object-cover rounded-lg" />
                      </td>
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4 font-semibold text-[#8B5A2B]">${p.price}</td>
                      <td className="p-4">
                        {p.featured ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Yes</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">No</span>
                        )}
                      </td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => handleEdit(p)} className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm">Delete</button>
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