import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [products, setProducts] = useState([])
  const [featured, setFeatured] = useState([])
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios.get('http://localhost:8080/api/products')
      .then(res => setProducts(res.data))
    axios.get('http://localhost:8080/api/products/featured')
      .then(res => setFeatured(res.data))
      .finally(() => setLoading(false))
  }, [])

  const subscribe = (e) => {
    e.preventDefault()
    if (!email.includes('@')) {
      setMessage('Please enter a valid email')
      setTimeout(() => setMessage(''), 5000)
      return
    }
    axios.post('http://localhost:8080/api/subscribe', { email })
      .then(() => {
        setMessage('Thank you for subscribing! ☕')
        setEmail('')
      })
      .catch(() => setMessage('Oops! Try again'))
      .finally(() => setTimeout(() => setMessage(''), 5000))
  }

  return (
    <>
      {/* HERO */}
      <div id="hero" className="relative h-screen bg-cover bg-center flex items-center justify-center text-white text-center" style={{backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920')`}}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 px-6">
          <h1 className="text-7xl md:text-9xl font-black mb-6 animate-pulse">Bean Scene</h1>
          <p className="text-3xl md:text-5xl mb-10">We've got your morning covered with Coffee</p>
          {featured[0] && (
            <p className="text-4xl font-bold animate-bounce">
              Special: {featured[0].name} – ₹{featured[0].price}
            </p>
          )}
        </div>
      </div>

      {/* MENU */}
      <section id="menu" className="py-24 bg-amber-50">
        <h2 className="text-6xl text-center font-bold text-amber-900 mb-20">Our Menu</h2>
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-8 border-b-8 border-amber-900"></div>
            <p className="mt-8 text-3xl text-amber-900">Brewing your menu...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-4xl text-amber-900 font-medium">Menu coming soon!</p>
            <p className="text-2xl text-gray-600 mt-6">We're crafting something special for you ☕</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto px-8">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:scale-105 transition duration-300">
                <img src={p.imageUrl || "https://via.placeholder.com/400x300?text=Coffee"} alt={p.name} className="w-full h-72 object-cover" />
                <div className="p-10 text-center">
                  <h3 className="text-3xl font-bold text-amber-900 mb-3">{p.name}</h3>
                  <p className="text-gray-700 mb-6">{p.description}</p>
                  <p className="text-5xl font-black text-amber-700 mb-8">₹{p.price}</p>
                  <button className="mt-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all transform hover:scale-110 hover:shadow-2xl shadow-lg">
  Order Now
</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

{/* NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 bg-amber-900/95 backdrop-blur-md text-white py-6 shadow-2xl z-50">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <h1 className="text-4xl font-black">Bean Scene</h1>
          <div className="space-x-12 text-xl font-medium">
            <a href="#hero" className="hover:text-amber-300 transition">Home</a>
            <a href="#menu" className="hover:text-amber-300 transition">Menu</a>
            <a href="#subscribe" className="hover:text-amber-300 transition">Subscribe</a>
          </div>
        </div>
      </nav>

      {/* Padding so hero isn't hidden under navbar */}
      <div className="pt-32"></div>
      {/* NEWSLETTER */}
      <section id="subscribe" className="bg-amber-900 py-24 text-white text-center">
        <h2 className="text-5xl font-bold mb-10">Subscribe for Latest Offers</h2>
        <form onSubmit={subscribe} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-6 px-6">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="flex-1 px-10 py-5 rounded-full text-black text-xl" />
          <button className="bg-amber-600 hover:bg-amber-700 px-12 py-5 rounded-full font-bold text-xl transition">Subscribe</button>
        </form>
        {message && (
          <p className={`mt-8 text-3xl font-semibold transition-all duration-500 ${
            message.includes('Thank') ? 'text-green-400' : 'text-red-400'
          }`}>
            {message}
          </p>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-amber-950 text-white py-12 text-center">
        <p className="text-xl mb-4">© 2026 Bean Scene Coffee Shop • Made with ❤️ and lots of coffee</p>
        <p className="text-lg text-amber-300 font-medium">
          Full-Stack Project by Vijaya Saradhi
        </p>
      </footer>
    </>
  )
}

export default App