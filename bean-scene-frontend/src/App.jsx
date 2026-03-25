import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [products, setProducts] = useState([])
  const [featured, setFeatured] = useState([])
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(res => setProducts(res.data))
    axios.get('http://localhost:8080/api/products/featured')
      .then(res => setFeatured(res.data))
  }, [])

  const subscribe = (e) => {
    e.preventDefault()
    axios.post('http://localhost:8080/api/subscribe', { email })
      .then(() => { setMessage('Thank you for subscribing! ☕'); setEmail('') })
      .catch(() => setMessage('Oops! Try again'))
  }

  return (
    <>
      {/* HERO */}
      <div className="relative h-screen bg-cover bg-center" style={{backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920')`}}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative h-full flex items-center justify-center text-center text-white px-6">
          <div>
            <h1 className="text-7xl md:text-9xl font-black mb-6 animate-pulse">Bean Scene</h1>
            <p className="text-3xl md:text-5xl mb-10">We've got your morning covered with Coffee</p>
            {featured[0] && <p className="text-4xl font-bold animate-bounce">Special: {featured[0].name} – ₹{featured[0].price}</p>}
          </div>
        </div>
      </div>

      {/* MENU */}
      <section className="py-24 bg-amber-50">
        <h2 className="text-6xl text-center font-bold text-amber-900 mb-20">Our Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto px-8">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:scale-105 transition">
              <img src={p.imageUrl || "https://via.placeholder.com/400x300?text=Coffee"} alt={p.name} className="w-full h-72 object-cover" />
              <div className="p-10 text-center">
                <h3 className="text-3xl font-bold text-amber-900 mb-3">{p.name}</h3>
                <p className="text-gray-700 mb-6">{p.description}</p>
                <p className="text-5xl font-black text-amber-700">₹{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* NEWSLETTER */}
      <section className="bg-amber-900 py-24 text-white text-center">
        <h2 className="text-5xl font-bold mb-10">Subscribe for Latest Offers</h2>
        <form onSubmit={subscribe} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-6 px-6">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="flex-1 px-10 py-5 rounded-full text-black text-xl" />
          <button className="bg-amber-600 hover:bg-amber-700 px-12 py-5 rounded-full font-bold text-xl transition">Subscribe</button>
        </form>
        {message && <p className="mt-8 text-3xl font-semibold">{message}</p>}
      </section>
    </>
  )
}


export default App