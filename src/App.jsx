import { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function App() {
  // Auth
  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMessage, setRegMessage] = useState('');

  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Common
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cart
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [cartToast, setCartToast] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  // Orders
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState('');

  // New Features
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // Restore login + wishlist
  useEffect(() => {
    const savedUser = localStorage.getItem('beanSceneUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setIsLoggedIn(true);
        setUserName(user.name || '');
        setUserEmail(user.email || '');
      } catch {
        localStorage.removeItem('beanSceneUser');
      }
    }

    const savedWishlist = localStorage.getItem('beanSceneWishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch {
        localStorage.removeItem('beanSceneWishlist');
      }
    }
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products`);
        setProducts(res.data || []);
      } catch {
        setError('Could not connect to backend. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auth handlers
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegMessage('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/register`, {
        name: regName,
        email: regEmail,
        password: regPassword,
      });
      setRegMessage(res.data.message || 'Registration successful!');
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setTimeout(() => {
        setShowRegister(false);
        setShowLogin(true);
        setRegMessage('');
      }, 1500);
    } catch (err) {
      setRegMessage(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      const name = res.data.user?.name || 'User';
      const mail = res.data.user?.email || loginEmail;

      setIsLoggedIn(true);
      setUserName(name);
      setUserEmail(mail);
      setLoginMessage('Login Successful!');
      localStorage.setItem('beanSceneUser', JSON.stringify({ name, email: mail }));

      setTimeout(() => {
        setShowLogin(false);
        setLoginMessage('');
        setLoginPassword('');
      }, 800);
    } catch (err) {
      setLoginMessage(err.response?.data?.error || 'Login failed');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setOrderHistory([]);
    localStorage.removeItem('beanSceneUser');
  };

  // Subscribe
  const subscribe = (e) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      setMessage('Please enter a valid email');
      setTimeout(() => setMessage(''), 4000);
      return;
    }
    axios
      .post(`${API_BASE_URL}/api/subscribe`, { email })
      .then(() => {
        setMessage('Thank you for subscribing! ☕');
        setEmail('');
        setTimeout(() => setMessage(''), 5000);
      })
      .catch(() => {
        setMessage('Oops! Try again');
        setTimeout(() => setMessage(''), 4000);
      });
  };

  // Cart
  const showToast = (msg) => {
    setCartToast(msg);
    setTimeout(() => setCartToast(''), 2500);
  };

  const handleOrderNow = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Place order
  const placeOrder = async () => {
    if (cart.length === 0) return;
    setPlacingOrder(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/orders`, {
        items: cart,
        total: cartTotal,
        user: isLoggedIn ? userName : 'Guest',
        email: isLoggedIn ? userEmail : 'guest@beanscene.com',
      });

      const orderRecord = {
        id: res.data.order?.id ?? res.data.orderId ?? `TEMP-${Date.now()}`,
        items: [...cart],
        total: cartTotal,
        placedAt: new Date().toISOString(),
        status: res.data.order?.status ?? 'Received',
      };

      setConfirmedOrder(orderRecord);
      setCart([]);
      setShowCart(false);
      setShowOrderConfirmation(true);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Order history
  const fetchOrderHistory = async () => {
    if (!isLoggedIn) return;
    setLoadingHistory(true);
    setHistoryError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders`, {
        params: { email: userEmail },
      });
      setOrderHistory(res.data || []);
    } catch {
      setHistoryError('Could not load your order history.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const openOrderHistory = () => {
    setShowOrderHistory(true);
    fetchOrderHistory();
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return iso;
    }
  };

  // Wishlist
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      let updated;
      if (exists) {
        updated = prev.filter((item) => item.id !== product.id);
        showToast(`Removed ${product.name} from wishlist`);
      } else {
        updated = [...prev, product];
        showToast(`Added ${product.name} to wishlist`);
      }
      localStorage.setItem('beanSceneWishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  // Filter + Sort
  const filteredProducts = products
    .filter(
      (p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-gray-800">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-[#4a2c0a] tracking-tight">Bean Scene</h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#hero" className="text-[15px] font-medium text-gray-700 hover:text-[#8B5A2B] transition">Home</a>
            <a href="#menu" className="text-[15px] font-medium text-gray-700 hover:text-[#8B5A2B] transition">Menu</a>
            <a href="#subscribe" className="text-[15px] font-medium text-gray-700 hover:text-[#8B5A2B] transition">Subscribe</a>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button onClick={() => setShowCart(true)} className="relative text-xl hover:text-[#8B5A2B] transition">
              🛒
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#8B5A2B] text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-3">
                <button onClick={openOrderHistory} className="text-sm font-medium text-[#4a2c0a] hover:underline">
                  My Orders
                </button>
                <span className="text-sm font-medium text-[#4a2c0a]">Hi, {userName}</span>
                <button onClick={handleLogout} className="text-sm bg-red-600 text-white px-4 py-1.5 rounded-full hover:bg-red-700 transition">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <button onClick={() => setShowLogin(true)} className="text-sm bg-[#4a2c0a] text-white px-5 py-2 rounded-full hover:bg-[#3a2208] transition">
                  Login
                </button>
                <button onClick={() => setShowRegister(true)} className="text-sm border border-[#4a2c0a] text-[#4a2c0a] px-5 py-2 rounded-full hover:bg-[#4a2c0a] hover:text-white transition">
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-2xl text-[#4a2c0a]"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 shadow-lg">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 font-medium">Home</a>
            <a href="#menu" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 font-medium">Menu</a>
            <a href="#subscribe" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 font-medium">Subscribe</a>
            
            {isLoggedIn ? (
              <>
                <button onClick={() => { openOrderHistory(); setMobileMenuOpen(false); }} className="block text-[#4a2c0a] font-medium">
                  My Orders
                </button>
                <p className="text-sm text-gray-600">Hi, {userName}</p>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-sm bg-red-600 text-white px-4 py-2 rounded-full">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }} className="text-sm bg-[#4a2c0a] text-white px-5 py-2 rounded-full">
                  Login
                </button>
                <button onClick={() => { setShowRegister(true); setMobileMenuOpen(false); }} className="text-sm border border-[#4a2c0a] text-[#4a2c0a] px-5 py-2 rounded-full">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Toast */}
      {cartToast && (
        <div className="fixed top-20 right-4 z-[110] bg-[#4a2c0a] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          {cartToast.toLowerCase().includes('fail') || cartToast.toLowerCase().includes('removed') ? '⚠️' : '✅'} {cartToast}
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-[100]">
          <div className="bg-white w-full max-w-sm h-full shadow-2xl overflow-y-auto">
            <div className="bg-[#4a2c0a] px-6 py-5 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold text-white">Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="text-white/80 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-12">Your cart is empty.</p>
              ) : (
                <>
                  <ul className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <li key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => decreaseQty(item.id)} className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold">−</button>
                          <span className="w-6 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => increaseQty(item.id)} className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold">+</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between text-lg font-semibold text-[#4a2c0a] mb-5">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={placeOrder}
                    disabled={placingOrder}
                    className="w-full bg-[#4a2c0a] hover:bg-[#3a2208] text-white py-3 rounded-xl mb-3 disabled:opacity-60 transition"
                  >
                    {placingOrder ? 'Placing Order…' : 'Place Order'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation */}
      {showOrderConfirmation && confirmedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowOrderConfirmation(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#4a2c0a] px-8 py-8 text-center relative">
              <button onClick={() => setShowOrderConfirmation(false)} className="absolute top-4 right-5 text-white/80 hover:text-white text-2xl">×</button>
              <div className="text-4xl mb-3">✅</div>
              <h2 className="text-2xl font-bold text-white">Order Placed!</h2>
              <p className="text-amber-100 text-sm mt-1">Thanks for choosing Bean Scene</p>
            </div>
            <div className="px-8 py-6">
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Order #{confirmedOrder.id}</span>
                <span>{formatDate(confirmedOrder.placedAt)}</span>
              </div>
              <ul className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {confirmedOrder.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity || 1}</span>
                    <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-semibold text-[#4a2c0a] text-lg border-t border-gray-100 pt-4 mb-6">
                <span>Total</span>
                <span>${confirmedOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowOrderConfirmation(false)} className="flex-1 border border-[#4a2c0a] text-[#4a2c0a] py-2.5 rounded-xl">
                  Continue
                </button>
                {isLoggedIn && (
                  <button onClick={() => { setShowOrderConfirmation(false); openOrderHistory(); }} className="flex-1 bg-[#4a2c0a] text-white py-2.5 rounded-xl">
                    My Orders
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order History */}
      {showOrderHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-[100]">
          <div className="bg-white w-full max-w-md h-full shadow-2xl overflow-y-auto">
            <div className="bg-[#4a2c0a] px-6 py-5 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold text-white">My Orders</h2>
              <button onClick={() => setShowOrderHistory(false)} className="text-white/80 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6">
              {loadingHistory && <p className="text-center text-gray-500 py-10">Loading…</p>}
              {!loadingHistory && historyError && <p className="text-center text-red-500">{historyError}</p>}
              {!loadingHistory && !historyError && orderHistory.length === 0 && (
                <p className="text-center text-gray-500 py-10">No orders yet.</p>
              )}
              {!loadingHistory && orderHistory.length > 0 && (
                <ul className="space-y-4">
                  {orderHistory.map((order) => (
                    <li key={order.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-[#4a2c0a]">Order #{order.id}</span>
                        <span className="text-xs bg-amber-50 text-[#8B5A2B] px-2 py-1 rounded-full">
                          {order.status || 'Received'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">{formatDate(order.placedAt || order.createdAt)}</p>
                      {(order.items || []).map((item, i) => (
                        <div key={i} className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>{item.name} × {item.quantity || 1}</span>
                          <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-semibold text-[#4a2c0a] border-t border-gray-100 pt-2 mt-2">
                        <span>Total</span>
                        <span>${(order.total ?? 0).toFixed(2)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowLogin(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#4a2c0a] px-8 py-6 text-center relative">
              <button onClick={() => setShowLogin(false)} className="absolute top-4 right-5 text-white/80 hover:text-white text-2xl">×</button>
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-amber-100 text-sm mt-1">Login to Bean Scene</p>
            </div>
            <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]" required />
              </div>
              {loginMessage && (
                <p className={`text-center text-sm font-medium ${loginMessage.includes('Successful') ? 'text-green-600' : 'text-red-600'}`}>{loginMessage}</p>
              )}
              <button type="submit" className="w-full bg-[#4a2c0a] hover:bg-[#3a2208] text-white font-semibold py-3 rounded-xl transition">Login</button>
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <button type="button" onClick={() => { setShowLogin(false); setShowRegister(true); }} className="text-[#4a2c0a] font-medium hover:underline">Sign Up</button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowRegister(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#4a2c0a] px-8 py-6 text-center relative">
              <button onClick={() => setShowRegister(false)} className="absolute top-4 right-5 text-white/80 hover:text-white text-2xl">×</button>
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <p className="text-amber-100 text-sm mt-1">Join Bean Scene</p>
            </div>
            <form onSubmit={handleRegister} className="px-8 py-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]" required minLength={6} />
              </div>
              {regMessage && (
                <p className={`text-center text-sm font-medium ${regMessage.toLowerCase().includes('successful') ? 'text-green-600' : 'text-red-600'}`}>{regMessage}</p>
              )}
              <button type="submit" className="w-full bg-[#4a2c0a] hover:bg-[#3a2208] text-white font-semibold py-3 rounded-xl transition">Sign Up</button>
              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button type="button" onClick={() => { setShowRegister(false); setShowLogin(true); }} className="text-[#4a2c0a] font-medium hover:underline">Login</button>
              </p>
            </form>
          </div>
        </div>
      )}

       {/* Hero */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&auto=format&fit=crop&q=85')",
            backgroundAttachment: 'fixed',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-[#241408]/85"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-2xl">Bean Scene</h1>
          <p className="text-xl md:text-2xl font-light mb-8 opacity-95 drop-shadow-md">We've got your morning covered with Coffee</p>
          <a
            href="#menu"
            className="inline-block bg-white text-[#4a2c0a] font-semibold px-8 py-3.5 rounded-full hover:bg-amber-100 hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Explore Menu
          </a>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-20 bg-[#f5ecdf]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#4a2c0a] mb-3">Our Menu</h2>
          <p className="text-center text-gray-600 mb-8">Freshly brewed favorites, made just for you</p>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search coffee, pastry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] text-gray-800"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] text-gray-800 bg-white"
            >
              <option value="default">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A → Z</option>
            </select>
          </div>

          {loading && <p className="text-center text-gray-500">Loading menu…</p>}
          {!loading && error && <p className="text-center text-red-500 font-medium">{error}</p>}
          {!loading && !error && filteredProducts.length === 0 && (
            <p className="text-center text-gray-500">
              {searchTerm ? 'No products match your search.' : 'No items available right now.'}
            </p>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id ?? product.name} className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col">
                  <div className="relative">
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80'}
                      alt={product.name}
                      className="w-full h-48 sm:h-52 object-cover"
                    />
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 text-2xl bg-white/90 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-110 transition"
                    >
                      {isInWishlist(product.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-[#4a2c0a] mb-2">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      {product.price != null && (
                        <span className="text-lg sm:text-xl font-bold text-[#8B5A2B]">${product.price.toFixed(2)}</span>
                      )}
                      <button onClick={() => handleOrderNow(product)} className="bg-[#4a2c0a] hover:bg-[#3a2208] text-white text-sm font-medium px-4 sm:px-5 py-2.5 rounded-full transition">
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Subscribe */}
      <section id="subscribe" className="py-20 bg-[#4a2c0a] text-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Subscribe for Latest Offers</h2>
          <p className="text-amber-100 mb-8">Get exclusive deals and new coffee launches</p>
          <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 items-center">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="w-full sm:flex-1 px-5 py-3.5 rounded-full text-gray-800 focus:outline-none" />
            <button type="submit" className="w-full sm:w-auto bg-white text-[#4a2c0a] font-semibold px-8 py-3.5 rounded-full hover:bg-amber-50 transition">Subscribe</button>
          </form>
          {message && (
            <p className={`mt-6 text-lg ${message.includes('Thank') ? 'text-green-300' : 'text-red-300'}`}>{message}</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2c1a0e] text-white py-10 text-center">
        <p className="text-sm md:text-base">© 2026 Bean Scene Coffee Shop • Made with ❤️ and lots of coffee</p>
        <p className="text-amber-500/80 mt-2 text-sm">Full-Stack Project by Vijaya Saradhi</p>
      </footer>
    </div>
  );
}

export default App;