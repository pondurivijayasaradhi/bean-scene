import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
  setLoading(true);
  setError('');

  const fetchProducts = async () => {
    try {
      const [allProducts, featuredProducts] = await Promise.all([
        axios.get('http://localhost:8080/api/products', { withCredentials: true }),
        axios.get('http://localhost:8080/api/products/featured', { withCredentials: true })
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

  axios.post('http://localhost:8080/api/subscribe', { email }, { withCredentials: true })
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
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans">

      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-b border-purple-500/30 py-4 z-50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Bean Scene
          </h1>

          <div className="hidden md:flex items-center gap-10 text-lg font-medium">
            <a href="#hero" className="hover:text-purple-400 transition">Home</a>
            <a href="#menu" className="hover:text-purple-400 transition">Menu</a>
            <a href="#subscribe" className="hover:text-purple-400 transition">Subscribe</a>
          </div>

          <div className="flex items-center gap-5">
            <button className="text-2xl relative hover:text-purple-400 transition">
              🛒
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:from-purple-500 hover:to-pink-500 transition">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Futuristic Style */}
      <section
        id="hero"
        className="relative h-screen flex items-center justify-center text-center pt-16 overflow-hidden"
      >
        {/* Background Image + Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a]/90 via-purple-900/70 to-[#0a0a1a]/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)]"></div>

        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight bg-gradient-to-r from-purple-300 via-pink-400 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
            Bean Scene
          </h1>
          <p className="text-2xl md:text-4xl mb-10 font-light text-gray-200">
            We've got your morning covered with Coffee
          </p>

          {featured.length > 0 && (
            <div className="inline-block bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-md px-8 py-4 rounded-full border border-purple-400/40">
              <p className="text-xl md:text-2xl font-semibold">
                Today's Special: {featured[0].name} — ₹{featured[0].price}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* MENU SECTION */}
      <section id="menu" className="py-24 bg-[#0f0f23]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Our Menu
          </h2>
          <p className="text-xl text-gray-400 mb-16">Handcrafted with love</p>

          {loading ? (
            <div className="py-24">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
              <p className="mt-6 text-2xl text-purple-300">Brewing your menu...</p>
            </div>
          ) : error ? (
            <div className="py-16 bg-[#1a1a2e] rounded-3xl shadow-2xl max-w-2xl mx-auto p-10 border border-purple-500/30">
              <p className="text-2xl text-pink-400 font-medium mb-3">{error}</p>
              <p className="text-gray-400">Please start your Spring Boot backend on port 8080</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20">
              <p className="text-4xl text-purple-300 font-medium">Menu coming soon!</p>
              <p className="text-xl text-gray-400 mt-4">We're crafting something special for you ☕</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#1a1a2e] rounded-3xl overflow-hidden border border-purple-500/20 hover:border-purple-400/50 hover:scale-105 transition duration-300 shadow-xl"
                >
                  <img
                    src={p.imageUrl || "https://via.placeholder.com/400x300?text=Coffee"}
                    alt={p.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-3">{p.name}</h3>
                    <p className="text-gray-400 mb-5">{p.description}</p>
                    <p className="text-3xl font-black text-purple-400 mb-6">₹{p.price}</p>
                    <button
                      onClick={() => handleOrderNow(p)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-10 rounded-full transition transform hover:scale-105"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SUBSCRIBE SECTION */}
      <section id="subscribe" className="py-24 bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Subscribe for Latest Offers</h2>
          <p className="text-purple-200 mb-10 text-lg">Get exclusive deals and new coffee launches</p>

          <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-8 py-4 rounded-full text-black text-lg focus:outline-none focus:ring-4 focus:ring-purple-400"
            />
            <button
              type="submit"
              className="bg-white text-purple-900 hover:bg-purple-100 px-10 py-4 rounded-full font-bold text-lg transition"
            >
              Subscribe
            </button>
          </form>

          {message && (
            <p className={`mt-8 text-2xl font-semibold ${message.includes('Thank') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-12 text-center border-t border-purple-500/20">
        <p className="text-lg">© 2026 Bean Scene Coffee Shop • Made with ❤️ and lots of coffee</p>
        <p className="text-purple-400 mt-2">Full-Stack Project by Vijaya Saradhi</p>
      </footer>
    </div>
  );
}

export default App;