import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');     // ← Better error handling
  const [cart, setCart] = useState([]);       // ← Simple Cart

  useEffect(() => {
    setLoading(true);
    setError('');

    const fetchProducts = async () => {
      try {
        const [allProducts, featuredProducts] = await Promise.all([
          axios.get('http://localhost:8080/api/products'),
          axios.get('http://localhost:8080/api/products/featured')
        ]);

        setProducts(allProducts.data || []);
        setFeatured(featuredProducts.data || []);
      } catch (err) {
        console.error("Failed to load menu:", err);
        setError("Could not connect to backend. Is Spring Boot running on port 8080?");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setMessage("Please enter a valid email");
      setTimeout(() => setMessage(''), 4000);
      return;
    }

    axios.post('http://localhost:8080/api/subscribe', { email })
      .then(() => {
        setMessage("Thank you for subscribing! ☕");
        setEmail('');
        setTimeout(() => setMessage(''), 5000);
      })
      .catch(() => {
        setMessage("Oops! Try again");
        setTimeout(() => setMessage(''), 4000);
      });
  };

  const handleOrderNow = (product) => {
    setCart([...cart, product]);
    alert(`✅ Added ${product.name} to cart! (${cart.length + 1} items)`);
  };

  return (
    <>
      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 bg-amber-900/95 backdrop-blur-md text-white py-5 shadow-2xl z-50">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <h1 className="text-4xl font-black tracking-tighter">Bean Scene</h1>

          <div className="flex items-center gap-12 text-lg font-medium">
            <a href="#hero" className="hover:text-amber-300 transition-colors">Home</a>
            <a href="#menu" className="hover:text-amber-300 transition-colors">Menu</a>
            <a href="#subscribe" className="hover:text-amber-300 transition-colors">Subscribe</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-2xl hover:text-amber-300 transition relative">
              🛒
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cart.length}</span>}
            </button>
            <button className="px-6 py-2.5 bg-white text-amber-900 rounded-full font-semibold hover:bg-amber-100 transition">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="relative h-screen bg-cover bg-center flex items-center justify-center text-white text-center pt-24"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920')` }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 px-6 max-w-4xl mx-auto text-center">
          <h1 className="text-7xl md:text-9xl font-black mb-6">Bean Scene</h1>
          <p className="text-3xl md:text-5xl mb-12">We've got your morning covered with Coffee</p>
          {featured.length > 0 && (
            <p className="text-4xl font-bold text-amber-300 animate-pulse">
              Today's Special: {featured[0].name} — ₹{featured[0].price}
            </p>
          )}
        </div>
      </section>

      {/* MENU SECTION */}
      <section id="menu" className="py-24 bg-amber-50">
        /**<div className="max-w-7xl mx-auto px-8">
          <h2 className="text-6xl font-bold text-center text-amber-900 mb-16">Our Menu</h2>

          {loading ? (
            <div className="text-center py-32">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-8 border-b-8 border-amber-900"></div>
              <p className="mt-8 text-3xl text-amber-900">Brewing your menu...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600">
              <p className="text-3xl">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl text-amber-900">Menu coming soon!</p>
              <p className="text-2xl text-gray-600 mt-6">We're crafting something special for you ☕</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:scale-105 transition-all duration-300">
                  <img src={p.imageUrl || "https://via.placeholder.com/400x300?text=Coffee"} alt={p.name} className="w-full h-72 object-cover" />
                  <div className="p-8 text-center">
                    <h3 className="text-3xl font-bold text-amber-900 mb-3">{p.name}</h3>
                    <p className="text-gray-600 mb-6">{p.description}</p>
                    <p className="text-4xl font-black text-amber-700 mb-8">₹{p.price}</p>
                    <button onClick={() => handleOrderNow(p)} className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-orange-600 text-white font-bold py-4 px-12 rounded-full text-lg transition-all transform hover:scale-110 shadow-lg">
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SUBSCRIBE & FOOTER - Same as before */}
      <section id="subscribe" className="bg-amber-900 py-24 text-white text-center">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-5xl font-bold mb-10">Subscribe for Latest Offers</h2>
          <form onSubmit={subscribe} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-6">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="flex-1 px-8 py-5 rounded-full text-black text-xl focus:outline-none focus:ring-4 focus:ring-amber-400" />
            <button type="submit" className="bg-amber-600 hover:bg-amber-700 px-12 py-5 rounded-full font-bold text-xl transition whitespace-nowrap">Subscribe</button>
          </form>
          {message && <p className={`mt-8 text-3xl font-semibold ${message.includes('Thank') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}
        </div>
      </section>

      <footer className="bg-amber-950 text-white py-12 text-center">
        <p className="text-xl">© 2026 Bean Scene Coffee Shop • Made with ❤️ and lots of coffee</p>
        <p className="text-lg text-amber-300 mt-2">Full-Stack Project by Vijaya Saradhi</p>
      </footer>
    </>
  );
}

export default App;