import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RAW_API_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_URL =
  RAW_API_URL && !RAW_API_URL.includes('localhost') && !RAW_API_URL.includes('127.0.0.1')
    ? RAW_API_URL
    : '';

const INITIAL_PRODUCTS = [
  { id: 1,  name: 'Cappuccino',          description: 'Rich espresso with steamed milk foam',                          price: 4.5, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80', category: 'coffee', popular: true,  featured: true  },
  { id: 2,  name: 'Latte',               description: 'Smooth espresso with steamed milk',                             price: 4.8, image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=600&q=80', category: 'coffee', popular: false, featured: false },
  { id: 3,  name: 'Americano',           description: 'Espresso with hot water',                                       price: 3.5, image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=600&q=80', category: 'coffee', popular: false, featured: false },
  { id: 7,  name: 'Caramel Macchiato',   description: 'Vanilla steamed milk marked with espresso and caramel drizzle', price: 5.2, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80', category: 'coffee', popular: true,  featured: true  },
  { id: 8,  name: 'Caffè Mocha',         description: 'Full-bodied espresso with bittersweet chocolate and milk',      price: 5.0, image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80', category: 'coffee', popular: true,  featured: true  },
  { id: 9,  name: 'Flat White',          description: 'Velvety microfoam poured over a double ristretto shot',         price: 4.7, image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80', category: 'coffee', popular: false, featured: false },
  { id: 10, name: 'Espresso Macchiato',  description: 'Bold double espresso topped with a dollop of milk foam',        price: 3.8, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', category: 'coffee', popular: false, featured: false },
  { id: 4,  name: 'Iced Coffee',         description: 'Chilled coffee over ice',                                       price: 4.2, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80', category: 'iced',   popular: true,  featured: true  },
  { id: 11, name: 'Cold Brew',           description: 'Slow-steeped for 20 hours for an ultra-smooth finish',          price: 4.6, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', category: 'iced',   popular: true,  featured: true  },
  { id: 12, name: 'Iced Caramel Latte',  description: 'Chilled espresso, milk, and sweet caramel over ice',            price: 5.1, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80', category: 'iced',   popular: true,  featured: true  },
  { id: 13, name: 'Iced Matcha Latte',   description: 'Ceremonial-grade green tea whisked with cold milk over ice',    price: 5.3, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', category: 'iced',   popular: false, featured: false },
  { id: 14, name: 'Espresso Frappe',     description: 'Blended iced coffee with rich espresso and whipped cream',      price: 5.5, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', category: 'iced',   popular: false, featured: false },
  { id: 5,  name: 'Croissant',           description: 'Buttery, flaky French pastry',                                  price: 3.9, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', category: 'bakery', popular: false, featured: false },
  { id: 6,  name: 'Blueberry Muffin',    description: 'Freshly baked with real blueberries',                           price: 3.5, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80', category: 'bakery', popular: true,  featured: true  },
  { id: 15, name: 'Chocolate Croissant', description: 'Flaky golden pastry filled with rich dark chocolate',           price: 4.3, image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=600&q=80', category: 'bakery', popular: true,  featured: true  },
  { id: 16, name: 'Cinnamon Roll',       description: 'Warm spiced swirl topped with cream cheese frosting',           price: 4.5, image: 'https://images.unsplash.com/photo-1583527976767-5399024eeb05?auto=format&fit=crop&w=600&q=80', category: 'bakery', popular: true,  featured: true  },
  { id: 17, name: 'Banana Walnut Bread', description: 'Moist house-baked banana slice loaded with toasted walnuts',    price: 3.8, image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=600&q=80', category: 'bakery', popular: false, featured: false },
  { id: 18, name: 'Avocado Toast',       description: 'Artisan sourdough with smashed avocado and chili flakes',       price: 6.5, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=600&q=80', category: 'bakery', popular: false, featured: false },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [searchFilter, setSearchFilter] = useState('');
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneProducts');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneOrders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [reservations, setReservations] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneReservations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [visitors, setVisitors] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneVisitors');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneUsersList');
      return saved
        ? JSON.parse(saved)
        : [
            { name: 'Admin', email: 'admin@beanscene.com', role: 'admin', lastActive: 'Online' },
            { name: 'Vijaya Saradhi', email: 'vijayasaradhiponduri@gmail.com', role: 'customer', lastActive: 'Active' },
          ];
    } catch {
      return [];
    }
  });
  const [subscribers, setSubscribers] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneSubscribers');
      return saved ? JSON.parse(saved) : ['vijayasaradhiponduri@gmail.com', 'hello@beanscene.com'];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    category: 'coffee',
    imageUrl: '',
    featured: false,
  });

  const saveProductsLocally = (nextList) => {
    setProducts(nextList);
    localStorage.setItem('beanSceneProducts', JSON.stringify(nextList));
  };

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      axios.get(`${API_BASE_URL}/api/products`),
      axios.get(`${API_BASE_URL}/api/orders`),
      axios.get(`${API_BASE_URL}/api/reservations`),
      axios.get(`${API_BASE_URL}/api/visitors`),
    ])
      .then(([prodRes, ordRes, resvRes, visRes]) => {
        if (!active) return;
        if (prodRes.status === 'fulfilled' && Array.isArray(prodRes.value.data) && prodRes.value.data.length > 0) {
          const saved = localStorage.getItem('beanSceneProducts');
          if (!saved) {
            saveProductsLocally(prodRes.value.data);
          }
        }
        if (ordRes.status === 'fulfilled' && Array.isArray(ordRes.value.data) && ordRes.value.data.length > 0) {
          setOrders(ordRes.value.data);
        }
        if (resvRes.status === 'fulfilled' && Array.isArray(resvRes.value.data) && resvRes.value.data.length > 0) {
          setReservations(resvRes.value.data);
        }
        if (visRes.status === 'fulfilled' && visRes.value.data) {
          if (Array.isArray(visRes.value.data.visitors) && visRes.value.data.visitors.length > 0) {
            setVisitors(visRes.value.data.visitors);
          }
          if (Array.isArray(visRes.value.data.users) && visRes.value.data.users.length > 0) {
            setUsers(visRes.value.data.users);
          }
          if (Array.isArray(visRes.value.data.subscribers) && visRes.value.data.subscribers.length > 0) {
            setSubscribers(visRes.value.data.subscribers);
          }
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const resetForm = () => {
    setForm({ id: null, name: '', description: '', price: '', category: 'coffee', imageUrl: '', featured: false });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericPrice = parseFloat(form.price) || 4.5;
    const defaultImg = 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80';
    const payload = {
      ...form,
      price: numericPrice,
      image: form.imageUrl || defaultImg,
      imageUrl: form.imageUrl || defaultImg,
      popular: Boolean(form.featured),
      featured: Boolean(form.featured),
    };

    try {
      if (isEditing) {
        const updatedList = products.map((p) => (p.id === form.id ? { ...p, ...payload, id: form.id } : p));
        saveProductsLocally(updatedList);
        await axios.put(`${API_BASE_URL}/api/products/${form.id}`, payload).catch(() => {});
        setMessage('✅ Product updated successfully!');
      } else {
        const created = {
          ...payload,
          id: Date.now(),
          rating: 4.9,
          reviews: 1,
          calories: 150,
          caffeine: form.category === 'bakery' ? '0mg' : '150mg',
          badge: form.featured ? '⭐ Featured' : '✨ New Arrival',
        };
        saveProductsLocally([created, ...products]);
        await axios.post(`${API_BASE_URL}/api/products`, created).catch(() => {});
        setMessage('✅ Product added successfully!');
      }

      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Error saving product');
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category || 'coffee',
      imageUrl: product.imageUrl || product.image || '',
      featured: Boolean(product.featured || product.popular),
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const nextList = products.filter((p) => p.id !== id);
      saveProductsLocally(nextList);
      await axios.delete(`${API_BASE_URL}/api/products/${id}`).catch(() => {});
      setMessage('🗑️ Product deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleResetMenu = () => {
    saveProductsLocally(INITIAL_PRODUCTS);
    setMessage('🔄 Menu restored to default 18 Bean Scene items!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCycleOrderStatus = async (orderId, currentStatus) => {
    const stages = ['Received', 'Brewing', 'Ready!'];
    const nextStatus = stages[(stages.indexOf(currentStatus || 'Received') + 1) % stages.length];
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o));
    setOrders(updated);
    localStorage.setItem('beanSceneOrders', JSON.stringify(updated));
    await axios.patch(`${API_BASE_URL}/api/orders/${orderId}`, { status: nextStatus }).catch(() => {});
    setMessage(`☕ Order #${orderId} updated to ${nextStatus}`);
    setTimeout(() => setMessage(''), 2500);
  };

  const totalRevenue = orders.reduce((acc, o) => acc + Number(o.total || 0), 0);
  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0d0c11', color: '#f5f0ff', padding: '2.5rem 5%' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <span className="modal-badge">⚡ Bean Scene Operations &amp; Analytics</span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0' }}>
              Full-Stack Admin Command Center
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              Manage live menu products, kitchen order queue, table reservations, and real-time users
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleResetMenu}
              className="btn-secondary"
              style={{ padding: '0.7rem 1.2rem', fontSize: '0.88rem' }}
            >
              🔄 Reset Default Menu
            </button>
            <Link
              to="/"
              className="btn-primary"
              style={{ textDecoration: 'none', padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              ← Back to Live Website
            </Link>
          </div>
        </div>

        {/* Live KPI Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div className="order-summary-box" style={{ marginBottom: 0 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>💰 Total Live Revenue</span>
            <h3 style={{ fontSize: '1.65rem', color: '#4ade80', margin: '0.3rem 0 0' }}>${totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="order-summary-box" style={{ marginBottom: 0 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>☕ Total Orders</span>
            <h3 style={{ fontSize: '1.65rem', color: 'var(--warm)', margin: '0.3rem 0 0' }}>{orders.length}</h3>
          </div>
          <div className="order-summary-box" style={{ marginBottom: 0 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🥐 Active Menu Items</span>
            <h3 style={{ fontSize: '1.65rem', color: '#fff', margin: '0.3rem 0 0' }}>{products.length}</h3>
          </div>
          <div className="order-summary-box" style={{ marginBottom: 0 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🪑 Table Reservations</span>
            <h3 style={{ fontSize: '1.65rem', color: 'var(--accent)', margin: '0.3rem 0 0' }}>{reservations.length}</h3>
          </div>
          <div className="order-summary-box" style={{ marginBottom: 0 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>👥 Users &amp; Subscribers</span>
            <h3 style={{ fontSize: '1.65rem', color: '#38bdf8', margin: '0.3rem 0 0' }}>
              {users.length + subscribers.length}
            </h3>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pill-group" style={{ marginBottom: '1.75rem' }}>
          <button
            type="button"
            className={`mood-pill-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            🥐 Menu Products ({products.length})
          </button>
          <button
            type="button"
            className={`mood-pill-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            ☕ Kitchen Orders ({orders.length})
          </button>
          <button
            type="button"
            className={`mood-pill-btn ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            🪑 Table Passes ({reservations.length})
          </button>
          <button
            type="button"
            className={`mood-pill-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Live Users &amp; Traffic ({visitors.length})
          </button>
        </div>

        {message && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1rem 1.25rem',
              background: 'rgba(52, 211, 153, 0.14)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              color: '#6ee7b7',
              borderRadius: 16,
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        {activeTab === 'products' && (
          <>
            {/* Form Card */}
            <div
              style={{
                background: '#17141f',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 24,
                padding: '2rem',
                marginBottom: '2.5rem',
                boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
              }}
            >
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--warm)', marginBottom: '1.25rem' }}>
                {isEditing ? '✏️ Edit Product' : '➕ Add New Product'}
              </h2>

              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.1rem',
                }}
              >
                <div>
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Hazelnut Cortado"
                    className="modal-input"
                  />
                </div>

                <div>
                  <label className="form-label">Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    placeholder="4.90"
                    className="modal-input"
                  />
                </div>

                <div>
                  <label className="form-label">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="modal-input">
                    <option value="coffee">☕ Hot Coffee</option>
                    <option value="iced">🧊 Iced Beverage</option>
                    <option value="bakery">🥐 Bakery</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="modal-input"
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows="2"
                    placeholder="Describe flavor notes and ingredients..."
                    className="modal-input"
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    style={{ width: 18, height: 18, accentColor: '#c084fc', cursor: 'pointer' }}
                  />
                  <label htmlFor="featuredCheck" style={{ fontWeight: 600, cursor: 'pointer' }}>
                    Mark as Popular / Featured on Menu
                  </label>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.85rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.8rem', fontSize: '0.95rem' }}>
                    {isEditing ? 'Update Product' : 'Add Product'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-secondary"
                      style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Products Table */}
            <div
              style={{
                background: '#17141f',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
              }}
            >
              <div
                style={{
                  padding: '1.5rem 2rem',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                  All Products ({filteredProducts.length})
                </h2>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="🔍 Filter by name or category..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{ maxWidth: 280 }}
                />
              </div>

              {loading ? (
                <p style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <th style={{ padding: '1rem 1.5rem' }}>Image</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Name</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Category</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Price</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Featured</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <td style={{ padding: '0.9rem 1.5rem' }}>
                            <img
                              src={p.imageUrl || p.image}
                              alt={p.name}
                              style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 12 }}
                            />
                          </td>
                          <td style={{ padding: '0.9rem 1.5rem', fontWeight: 600, color: '#fff' }}>
                            <div>{p.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                              {p.description}
                            </div>
                          </td>
                          <td style={{ padding: '0.9rem 1.5rem', textTransform: 'capitalize', color: 'var(--text-muted)' }}>
                            {p.category || 'coffee'}
                          </td>
                          <td style={{ padding: '0.9rem 1.5rem', fontWeight: 700, color: 'var(--warm)' }}>
                            ${Number(p.price).toFixed(2)}
                          </td>
                          <td style={{ padding: '0.9rem 1.5rem' }}>
                            {p.featured || p.popular ? (
                              <span
                                style={{
                                  background: 'rgba(52, 211, 153, 0.16)',
                                  color: '#6ee7b7',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: 999,
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                }}
                              >
                                Yes
                              </span>
                            ) : (
                              <span
                                style={{
                                  background: 'rgba(255, 255, 255, 0.06)',
                                  color: 'var(--text-muted)',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: 999,
                                  fontSize: '0.75rem',
                                }}
                              >
                                No
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '0.9rem 1.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                type="button"
                                onClick={() => handleEdit(p)}
                                className="order-btn"
                                style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(p.id)}
                                style={{
                                  background: 'rgba(248, 113, 113, 0.15)',
                                  border: '1px solid rgba(248, 113, 113, 0.4)',
                                  color: '#fca5a5',
                                  padding: '0.35rem 0.85rem',
                                  borderRadius: 999,
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
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
          </>
        )}

        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.length === 0 ? (
              <div className="order-summary-box" style={{ textAlign: 'center', padding: '2.5rem' }}>
                No orders placed yet. Place an order on the main menu to track it here!
              </div>
            ) : (
              orders.map((ord, idx) => (
                <div key={ord.id || idx} className="order-summary-box" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '1.05rem' }}>
                        Order #{ord.id} • {ord.customer || ord.user || 'Guest'}
                      </strong>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {ord.fulfillment || '🏪 In-Café Pickup'} • {ord.paymentMethod || '📱 UPI / QR Pay'}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.82rem' }}
                      onClick={() => handleCycleOrderStatus(ord.id, ord.status)}
                    >
                      Status: {ord.status || 'Received'} ↻
                    </button>
                  </div>
                  <div style={{ marginTop: '0.65rem' }}>
                    {(ord.items || []).map((it, i) => (
                      <p key={i} style={{ fontSize: '0.88rem', margin: '0.2rem 0' }}>
                        {it.quantity || 1}× {it.name}
                      </p>
                    ))}
                  </div>
                  <div style={{ marginTop: '0.6rem', fontWeight: 700, color: 'var(--warm)' }}>
                    Total Paid: ${Number(ord.total || 0).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reservations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reservations.length === 0 ? (
              <div className="order-summary-box" style={{ textAlign: 'center', padding: '2.5rem' }}>
                No table reservations booked yet.
              </div>
            ) : (
              reservations.map((r, idx) => (
                <div key={r.passId || idx} className="order-summary-box" style={{ marginBottom: 0 }}>
                  <strong style={{ color: 'var(--accent)', fontSize: '1.02rem' }}>
                    Table Pass #{r.passId} — {r.name}
                  </strong>
                  <p style={{ fontSize: '0.88rem', marginTop: '0.3rem', color: '#e2e8f0' }}>
                    {r.zone} • {r.guests} • Reserved for {r.time}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="order-summary-box" style={{ marginBottom: 0 }}>
              <h3 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.75rem' }}>
                👤 Registered &amp; Signed-In Users ({users.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {users.map((u, idx) => (
                  <div
                    key={u.email || idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.85rem',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: 10,
                    }}
                  >
                    <div>
                      <strong style={{ color: '#fff' }}>{u.name}</strong>{' '}
                      <span style={{ color: 'var(--text-muted)' }}>({u.email})</span>
                    </div>
                    <span style={{ color: '#4ade80', fontWeight: 600, fontSize: '0.82rem' }}>
                      {u.role === 'admin' ? '⚡ Admin' : '🟢 Active Customer'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-summary-box" style={{ marginBottom: 0 }}>
              <h3 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.75rem' }}>
                📩 Newsletter Subscribers ({subscribers.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {subscribers.map((sub, idx) => (
                  <span
                    key={sub || idx}
                    style={{
                      background: 'rgba(192,132,252,0.14)',
                      border: '1px solid rgba(192,132,252,0.35)',
                      color: '#e9d5ff',
                      padding: '0.32rem 0.75rem',
                      borderRadius: 999,
                      fontSize: '0.82rem',
                    }}
                  >
                    ✉️ {sub}
                  </span>
                ))}
              </div>
            </div>

            <div className="order-summary-box" style={{ marginBottom: 0 }}>
              <h3 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.75rem' }}>
                🌐 Live Visitor &amp; Activity Log ({visitors.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {visitors.map((v, idx) => (
                  <div
                    key={v.id || idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.6rem 0.85rem',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--warm)' }}>{v.name}</strong>{' '}
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({v.email})</span>
                      <div style={{ color: '#e2e8f0', fontSize: '0.84rem', marginTop: '0.15rem' }}>
                        {v.action} • <span style={{ color: 'var(--accent)' }}>{v.device}</span>
                      </div>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{v.location || 'Live'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
