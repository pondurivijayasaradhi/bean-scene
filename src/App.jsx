import { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Cappuccino", description: "Rich espresso with steamed milk foam", price: 4.50 },
  { id: 2, name: "Latte", description: "Smooth espresso with steamed milk", price: 4.80 },
  { id: 3, name: "Americano", description: "Espresso with hot water", price: 3.50 },
  { id: 4, name: "Iced Coffee", description: "Chilled coffee over ice", price: 4.20 },
  { id: 5, name: "Croissant", description: "Buttery, flaky French pastry", price: 3.90 },
  { id: 6, name: "Blueberry Muffin", description: "Freshly baked with real blueberries", price: 3.50 }
];

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

  // Products
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);

  // Cart & Ordering
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [cartToast, setCartToast] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  // Order Modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeItem, setActiveItem] = useState(DEFAULT_PRODUCTS[0]);
  const [orderSize, setOrderSize] = useState('regular');
  const [orderMilk, setOrderMilk] = useState('whole');
  const [orderQty, setOrderQty] = useState(1);
  const [orderCustomer, setOrderCustomer] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Order Confirmation
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  // Navigation & Subscribe
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  // Restore session
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
  }, []);

  // Fetch products from backend or fallback to default
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        }
      } catch {
        // Fallback to DEFAULT_PRODUCTS seamlessly
        setProducts(DEFAULT_PRODUCTS);
      }
    };
    fetchProducts();
  }, []);

  // Toast feedback
  const showToast = (msg) => {
    setCartToast(msg);
    setTimeout(() => setCartToast(''), 3000);
  };

  // Auth Handlers
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
      }, 1200);
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

      const name = res.data.user?.name || loginEmail.split('@')[0];
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
      }, 700);
    } catch {
      // Offline fallback login for demo purposes
      if (loginEmail && loginPassword) {
        const name = loginEmail.split('@')[0];
        setIsLoggedIn(true);
        setUserName(name);
        setUserEmail(loginEmail);
        localStorage.setItem('beanSceneUser', JSON.stringify({ name, email: loginEmail }));
        setShowLogin(false);
        showToast(`Welcome back, ${name}!`);
      } else {
        setLoginMessage('Please provide valid credentials');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setOrderHistory([]);
    localStorage.removeItem('beanSceneUser');
    showToast('Logged out successfully');
  };

  // Subscribe
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      setSubscribeMessage('Please enter a valid email');
      setTimeout(() => setSubscribeMessage(''), 3000);
      return;
    }
    axios
      .post(`${API_BASE_URL}/api/subscribe`, { email })
      .then(() => {
        setSubscribeMessage('Thank you for subscribing! ☕');
        setEmail('');
        setTimeout(() => setSubscribeMessage(''), 4000);
      })
      .catch(() => {
        setSubscribeMessage('Thank you for subscribing! ☕');
        setEmail('');
        setTimeout(() => setSubscribeMessage(''), 4000);
      });
  };

  // Open Order Modal for an item
  const openOrderModal = (product) => {
    setActiveItem(product);
    setOrderSize('regular');
    setOrderMilk('whole');
    setOrderQty(1);
    setOrderNotes('');
    setOrderCustomer(isLoggedIn ? userName : '');
    setShowOrderModal(true);
  };

  // Calculate dynamic unit and total price in modal
  const isBakeryItem = activeItem?.name?.toLowerCase().includes('croissant') || activeItem?.name?.toLowerCase().includes('muffin');
  const sizeCost = orderSize === 'large' ? 0.80 : 0;
  const milkCost = !isBakeryItem && (orderMilk === 'oat' || orderMilk === 'almond') ? 0.50 : 0;
  const modalUnitPrice = (activeItem?.price || 0) + sizeCost + milkCost;
  const modalTotalPrice = modalUnitPrice * orderQty;

  // Add customized item from modal to cart
  const handleAddModalToCart = () => {
    const customizedItem = {
      id: `${activeItem.id}-${Date.now()}`,
      productId: activeItem.id,
      name: activeItem.name,
      size: orderSize,
      milk: isBakeryItem ? null : orderMilk,
      notes: orderNotes,
      unitPrice: modalUnitPrice,
      price: modalUnitPrice,
      quantity: orderQty,
    };
    setCart((prev) => [...prev, customizedItem]);
    setShowOrderModal(false);
    showToast(`Added ${orderQty}× ${activeItem.name} to cart`);
  };

  // Direct checkout from modal
  const handleDirectOrderNow = async (e) => {
    e.preventDefault();
    const customer = orderCustomer.trim() || (isLoggedIn ? userName : 'Guest');
    const orderId = `BSC-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      items: [
        {
          name: `${activeItem.name} (${orderSize === 'large' ? 'Large' : 'Regular'}${!isBakeryItem ? `, ${orderMilk} milk` : ''})`,
          quantity: orderQty,
          price: modalUnitPrice,
        }
      ],
      total: modalTotalPrice,
      customer: customer,
      placedAt: new Date().toISOString(),
      status: 'Received',
    };

    setConfirmedOrder(newOrder);
    setOrderHistory((prev) => [newOrder, ...prev]);
    setShowOrderModal(false);
    setShowOrderConfirmation(true);
    showToast(`Order #${orderId} confirmed!`);
  };

  // Cart operations
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

  const removeCartItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || item.unitPrice || 0) * (item.quantity || 1), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Place order from Cart
  const placeCartOrder = async () => {
    if (cart.length === 0) return;
    setPlacingOrder(true);
    const orderId = `BSC-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await axios.post(`${API_BASE_URL}/api/orders`, {
        items: cart,
        total: cartTotal,
        user: isLoggedIn ? userName : 'Guest',
        email: isLoggedIn ? userEmail : 'guest@beanscene.com',
      });
    } catch {
      // Continue locally even if backend server is offline
    }

    const orderRecord = {
      id: orderId,
      items: [...cart],
      total: cartTotal,
      customer: isLoggedIn ? userName : 'Guest',
      placedAt: new Date().toISOString(),
      status: 'Received',
    };

    setConfirmedOrder(orderRecord);
    setOrderHistory((prev) => [orderRecord, ...prev]);
    setCart([]);
    setShowCart(false);
    setShowOrderConfirmation(true);
    setPlacingOrder(false);
    showToast(`Order placed successfully!`);
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <a href="#home" className="logo">Bean Scene</a>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#menu">Menu</a></li>
          <li><a href="#subscribe">Subscribe</a></li>
        </ul>

        <div className="nav-actions">
          <button
            className="cart-btn"
            id="nav-cart-btn"
            onClick={() => setShowCart(true)}
            aria-label="View shopping cart"
          >
            🛒 Cart <span className="cart-badge">{cartItemCount}</span>
          </button>

          {isLoggedIn ? (
            <div className="user-btn">
              <span onClick={() => setShowOrderHistory(true)}>Hi, {userName}</span>
              <button className="logout-link" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="login-btn" id="nav-login-btn" onClick={() => setShowLogin(true)}>
              Login
            </button>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Panel */}
      <div className={`mobile-nav-panel ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
        <a href="#menu" onClick={() => setMobileMenuOpen(false)}>Menu</a>
        <a href="#subscribe" onClick={() => setMobileMenuOpen(false)}>Subscribe</a>
        {isLoggedIn ? (
          <div>
            <p style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Signed in as {userName}</p>
            <button className="logout-link" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="login-btn" style={{ alignSelf: 'flex-start' }} onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }}>
            Login / Sign Up
          </button>
        )}
      </div>

      {/* HERO SECTION WITH ATMOSPHERIC COFFEE BACKGROUND */}
      <section className="hero" id="home">
        <h1>
          We've got your<br />
          <span>morning covered</span><br />
          with Coffee
        </h1>
        <p>Premium beans. Expertly roasted. Perfectly brewed. Start your day the Bean Scene way.</p>
        <div className="hero-cta-group">
          <a href="#menu" className="btn-primary">Explore Menu →</a>
        </div>
      </section>

      {/* MENU SECTION */}
      <section className="section" id="menu">
        <div className="section-header">
          <h2>Our Menu</h2>
          <p>Freshly brewed favorites, made just for you</p>
        </div>

        {/* Cards Grid */}
        <div className="menu-grid">
          {products.map((product) => {
            const btnId = `order-btn-${product.name?.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <div key={product.id || product.name} className="menu-card">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="card-footer">
                  <span className="price">${product.price.toFixed(2)}</span>
                  <button
                    id={btnId}
                    type="button"
                    className="order-btn"
                    onClick={() => openOrderModal(product)}
                    aria-label={`Order ${product.name} for $${product.price.toFixed(2)}`}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SUBSCRIBE SECTION */}
      <section id="subscribe">
        <div className="subscribe">
          <h2>Subscribe for Latest Offers</h2>
          <p>Get exclusive deals and new coffee launches straight to your inbox</p>
          <form className="subscribe-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          {subscribeMessage && (
            <p style={{ marginTop: '1rem', color: 'var(--accent)', fontWeight: 600 }}>{subscribeMessage}</p>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 Bean Scene Coffee Shop • Made with ❤️ and lots of coffee</p>
        <p style={{ marginTop: '0.5rem' }}>Full-Stack Project by <a href="#home">Vijaya Saradhi</a></p>
      </footer>

      {/* INTERACTIVE ORDER MODAL */}
      {showOrderModal && (
        <div className="modal-backdrop" onClick={() => setShowOrderModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-badge">Freshly Crafted</span>
                <h3 className="modal-title">{activeItem.name}</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowOrderModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <p className="modal-desc">{activeItem.description}</p>

            <form onSubmit={handleDirectOrderNow}>
              {/* Size Selection */}
              <div className="form-group">
                <label className="form-label">Select Size</label>
                <div className="pill-group">
                  <label className="pill-option">
                    <input
                      type="radio"
                      name="modal-size"
                      value="regular"
                      checked={orderSize === 'regular'}
                      onChange={() => setOrderSize('regular')}
                    />
                    <span>Regular</span>
                  </label>
                  <label className="pill-option">
                    <input
                      type="radio"
                      name="modal-size"
                      value="large"
                      checked={orderSize === 'large'}
                      onChange={() => setOrderSize('large')}
                    />
                    <span>Large (+$0.80)</span>
                  </label>
                </div>
              </div>

              {/* Milk / Style options (for coffee beverages) */}
              {!isBakeryItem && (
                <div className="form-group">
                  <label className="form-label">Milk / Style</label>
                  <div className="pill-group">
                    <label className="pill-option">
                      <input
                        type="radio"
                        name="modal-milk"
                        value="whole"
                        checked={orderMilk === 'whole'}
                        onChange={() => setOrderMilk('whole')}
                      />
                      <span>Whole Milk</span>
                    </label>
                    <label className="pill-option">
                      <input
                        type="radio"
                        name="modal-milk"
                        value="oat"
                        checked={orderMilk === 'oat'}
                        onChange={() => setOrderMilk('oat')}
                      />
                      <span>Oat Milk (+$0.50)</span>
                    </label>
                    <label className="pill-option">
                      <input
                        type="radio"
                        name="modal-milk"
                        value="almond"
                        checked={orderMilk === 'almond'}
                        onChange={() => setOrderMilk('almond')}
                      />
                      <span>Almond Milk (+$0.50)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Quantity & Notes */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <div className="qty-counter">
                    <button
                      type="button"
                      onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                    >
                      −
                    </button>
                    <span>{orderQty}</span>
                    <button
                      type="button"
                      onClick={() => setOrderQty(orderQty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="form-group flex-1">
                  <label className="form-label">Special Notes</label>
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="e.g. Extra hot, warm"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Customer / Table Number */}
              <div className="form-group">
                <label className="form-label">Your Name / Table Number</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="e.g. Table 4 or Alex"
                  value={orderCustomer}
                  onChange={(e) => setOrderCustomer(e.target.value)}
                  required
                />
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <div className="modal-total">
                  <span className="total-label">Total Amount</span>
                  <span className="total-amount">${modalTotalPrice.toFixed(2)}</span>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleAddModalToCart}
                  >
                    Add to Cart
                  </button>
                  <button type="submit" className="btn-primary">
                    Order Now
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER CONFIRMATION MODAL */}
      {showOrderConfirmation && confirmedOrder && (
        <div className="modal-backdrop" onClick={() => setShowOrderConfirmation(false)}>
          <div className="modal-card modal-confirmation" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">☕✨</div>
            <h3>Order Placed Successfully!</h3>
            <p className="order-id">Order ID: <strong>#{confirmedOrder.id}</strong></p>

            <div className="order-summary-box">
              {confirmedOrder.items.map((it, idx) => (
                <p key={idx}>{it.quantity || 1}× {it.name}</p>
              ))}
              <p className="confirm-customer">Customer / Table: {confirmedOrder.customer || 'Guest'}</p>
              <div className="confirm-divider"></div>
              <div className="confirm-total-row">
                <span>Amount Paid</span>
                <span>${confirmedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <p className="prep-time">⏱️ Estimated ready time: <strong>5 - 8 minutes</strong></p>
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setShowOrderConfirmation(false)}
            >
              Done & Return to Menu
            </button>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {showCart && (
        <div className="cart-drawer-backdrop" onClick={() => setShowCart(false)}>
          <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <h3>🛒 Your Order</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowCart(false)}
              >
                ✕
              </button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">Your cart is empty. Order something delicious!</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity} × ${(item.unitPrice || item.price).toFixed(2)}</p>
                    </div>
                    <span className="cart-item-price">
                      ${((item.unitPrice || item.price) * item.quantity).toFixed(2)}
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="modal-close"
                        style={{ width: 26, height: 26, fontSize: '0.8rem' }}
                        onClick={() => decreaseQty(item.id)}
                      >
                        −
                      </button>
                      <button
                        type="button"
                        className="modal-close"
                        style={{ width: 26, height: 26, fontSize: '0.8rem' }}
                        onClick={() => increaseQty(item.id)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="modal-close"
                        style={{ width: 26, height: 26, fontSize: '0.8rem', color: '#f87171' }}
                        onClick={() => removeCartItem(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-total-row">
                <span>Subtotal</span>
                <span className="price">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={cart.length === 0 || placingOrder}
                onClick={placeCartOrder}
              >
                {placingOrder ? 'Processing...' : 'Checkout All Orders'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN / SIGN UP MODAL */}
      {showLogin && (
        <div className="modal-backdrop" onClick={() => setShowLogin(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Welcome Back</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowLogin(false)}
              >
                ✕
              </button>
            </div>
            <p className="modal-desc">Sign in to Bean Scene to track your orders and earn points</p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="modal-input"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="modal-input"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              {loginMessage && (
                <p style={{ color: loginMessage.includes('Successful') ? '#4ade80' : '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {loginMessage}
                </p>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}>
                Sign In
              </button>

              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => { setShowLogin(false); setShowRegister(true); }}
                >
                  Sign Up
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="modal-backdrop" onClick={() => setShowRegister(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Account</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowRegister(false)}
              >
                ✕
              </button>
            </div>
            <p className="modal-desc">Join Bean Scene for exclusive coffee drops and perks</p>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Alex Doe"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="modal-input"
                  placeholder="alex@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="modal-input"
                  placeholder="At least 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {regMessage && (
                <p style={{ color: regMessage.includes('successful') ? '#4ade80' : '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {regMessage}
                </p>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}>
                Register
              </button>

              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => { setShowRegister(false); setShowLogin(true); }}
                >
                  Sign In
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ORDER HISTORY MODAL */}
      {showOrderHistory && (
        <div className="modal-backdrop" onClick={() => setShowOrderHistory(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">My Orders</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowOrderHistory(false)}
              >
                ✕
              </button>
            </div>

            {orderHistory.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                No past orders found for your account.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
                {orderHistory.map((order, i) => (
                  <div key={order.id || i} className="order-summary-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ color: 'var(--accent)' }}>Order #{order.id}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.status || 'Received'}</span>
                    </div>
                    {order.items?.map((it, idx) => (
                      <p key={idx} style={{ fontSize: '0.85rem' }}>
                        {it.quantity || 1}× {it.name}
                      </p>
                    ))}
                    <div className="confirm-divider"></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--warm)' }}>
                      <span>Total</span>
                      <span>${(order.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {cartToast && (
        <div className="toast" role="status">
          ☕ {cartToast}
        </div>
      )}
    </div>
  );
}

export default App;