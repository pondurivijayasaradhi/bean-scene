import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
{
  message && (
    <p className={`mt-8 text-3xl font-semibold transition-all duration-500 ${message.includes('Thank') ? 'text-green-400' : 'text-red-400'
      }`}>
      {message}
    </p>
  )
}
<button className="mt-8 bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-10 rounded-full text-xl transition transform hover:scale-110 shadow-lg">
  Order Now
</button>
{
  products.length === 0 && !loading && (
    <div className="text-center py-34">
      <p className="text-4xl text-amber-900 font-medium">Menu coming soon!</p>
      <p className="text-2xl text-gray-700 mt-6">We're crafting something special for you ☕</p>
    </div>

  )
}
<footer className="bg-amber-950 text-white py-12 text-center">
  <p className="text-xl">© 2026 Bean Scene Coffee Shop • Made with ❤️ and lots of coffee</p>
</footer>