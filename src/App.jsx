import { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:8080');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_PRODUCTS = [
  // Hot Coffee
  { id: 1,  name: 'Cappuccino',          description: 'Rich espresso with steamed milk foam',                          price: 4.5, image: '/cappuccino.jpg',                                                                              category: 'coffee', rating: 4.9, reviews: 218, popular: true,  calories: 120, caffeine: '150mg', badge: '🌱 Oat Option' },
  { id: 2,  name: 'Latte',               description: 'Smooth espresso with steamed milk',                             price: 4.8, image: '/latte.jpg',                                                                                   category: 'coffee', rating: 4.8, reviews: 195, popular: false, calories: 150, caffeine: '150mg', badge: '🥛 Creamy'     },
  { id: 3,  name: 'Americano',           description: 'Espresso with hot water',                                       price: 3.5, image: '/americano.jpg',                                                                               category: 'coffee', rating: 4.7, reviews: 143, popular: false, calories: 15,  caffeine: '165mg', badge: '⚡ Zero Sugar' },
  { id: 7,  name: 'Caramel Macchiato',   description: 'Vanilla steamed milk marked with espresso and caramel drizzle', price: 5.2, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.9, reviews: 264, popular: true,  calories: 210, caffeine: '150mg', badge: '🍯 Best Seller' },
  { id: 8,  name: 'Caffè Mocha',         description: 'Full-bodied espresso with bittersweet chocolate and milk',      price: 5.0, image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.8, reviews: 182, popular: true,  calories: 230, caffeine: '155mg', badge: '🍫 Belgian Choc' },
  { id: 9,  name: 'Flat White',          description: 'Velvety microfoam poured over a double ristretto shot',         price: 4.7, image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.7, reviews: 134, popular: false, calories: 130, caffeine: '175mg', badge: '✨ Ristretto'  },
  { id: 10, name: 'Espresso Macchiato',  description: 'Bold double espresso topped with a dollop of milk foam',        price: 3.8, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.6, reviews: 97,  popular: false, calories: 35,  caffeine: '180mg', badge: '🔥 Strong'     },

  // Iced Beverages
  { id: 4,  name: 'Iced Coffee',         description: 'Chilled coffee over ice',                                       price: 4.2, image: '/iced_coffee.jpg',                                                                             category: 'iced',   rating: 4.8, reviews: 176, popular: true,  calories: 80,  caffeine: '145mg', badge: '🧊 Chilled'    },
  { id: 11, name: 'Cold Brew',           description: 'Slow-steeped for 20 hours for an ultra-smooth finish',          price: 4.6, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.9, reviews: 230, popular: true,  calories: 25,  caffeine: '200mg', badge: '⚡ 20h Steep'  },
  { id: 12, name: 'Iced Caramel Latte',  description: 'Chilled espresso, milk, and sweet caramel over ice',            price: 5.1, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.8, reviews: 189, popular: true,  calories: 190, caffeine: '150mg', badge: '🍯 Sweet'      },
  { id: 13, name: 'Iced Matcha Latte',   description: 'Ceremonial-grade green tea whisked with cold milk over ice',    price: 5.3, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.7, reviews: 154, popular: false, calories: 140, caffeine: '85mg',  badge: '🍵 Uji Matcha' },
  { id: 14, name: 'Espresso Frappe',     description: 'Blended iced coffee with rich espresso and whipped cream',      price: 5.5, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.8, reviews: 167, popular: false, calories: 280, caffeine: '140mg', badge: '🍦 Blended'    },

  // Bakery
  { id: 5,  name: 'Croissant',           description: 'Buttery, flaky French pastry',                                  price: 3.9, image: '/croissant.jpg',                                                                               category: 'bakery', rating: 4.6, reviews: 112, popular: false, calories: 260, caffeine: '0mg',   badge: '🥐 French Butter' },
  { id: 6,  name: 'Blueberry Muffin',    description: 'Freshly baked with real blueberries',                           price: 3.5, image: '/blueberry_muffin.jpg',                                                                        category: 'bakery', rating: 4.7, reviews: 98,  popular: true,  calories: 290, caffeine: '0mg',   badge: '🫐 Fresh Baked' },
  { id: 15, name: 'Chocolate Croissant', description: 'Flaky golden pastry filled with rich dark chocolate',           price: 4.3, image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.9, reviews: 205, popular: true,  calories: 310, caffeine: '15mg',  badge: '🍫 Warm Center' },
  { id: 16, name: 'Cinnamon Roll',       description: 'Warm spiced swirl topped with cream cheese frosting',           price: 4.5, image: 'https://images.unsplash.com/photo-1583527976767-5399024eeb05?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.8, reviews: 174, popular: true,  calories: 340, caffeine: '0mg',   badge: '✨ House Glaze' },
  { id: 17, name: 'Banana Walnut Bread', description: 'Moist house-baked banana slice loaded with toasted walnuts',    price: 3.8, image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.7, reviews: 119, popular: false, calories: 270, caffeine: '0mg',   badge: '🌰 Toasted Nuts' },
  { id: 18, name: 'Avocado Toast',       description: 'Artisan sourdough with smashed avocado and chili flakes',       price: 6.5, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.8, reviews: 142, popular: false, calories: 320, caffeine: '0mg',   badge: '🥑 Sourdough'  },
];

const CATEGORIES = [
  { key: 'all',       label: '☕ All'       },
  { key: 'coffee',    label: '☕ Coffee'    },
  { key: 'iced',      label: '🧊 Iced'     },
  { key: 'bakery',    label: '🥐 Bakery'    },
  { key: 'favorites', label: '❤️ Favorites' },
];

const MOOD_PAIRINGS = [
  { key: 'focus', label: '⚡ Power Focus',       drinkId: 10, foodId: 5  },
  { key: 'sweet', label: '🍯 Sweet & Cozy',      drinkId: 7,  foodId: 16 },
  { key: 'chill', label: '🧊 Cool & Refreshing', drinkId: 11, foodId: 6  },
  { key: 'zen',   label: '🍵 Zen & Savory',      drinkId: 13, foodId: 18 },
];

// Visual Cup Builder Options
const CUP_BASES = [
  { key: 'espresso', label: 'Double Espresso', color: '#4a2511', price: 3.20, kcal: 15,  caffeine: 160 },
  { key: 'coldbrew', label: '20h Cold Brew',   color: '#2e1508', price: 3.60, kcal: 20,  caffeine: 195 },
  { key: 'matcha',   label: 'Uji Matcha',      color: '#4d7c2b', price: 3.90, kcal: 45,  caffeine: 85  },
  { key: 'chai',     label: 'Spiced Chai',     color: '#854d27', price: 3.50, kcal: 60,  caffeine: 70  },
];

const CUP_MILKS = [
  { key: 'oat',     label: 'Creamy Oat',     color: '#e7d7c1', price: 0.60, kcal: 70 },
  { key: 'whole',   label: 'Velvet Whole',   color: '#f5ebe0', price: 0.00, kcal: 90 },
  { key: 'almond',  label: 'Toasted Almond', color: '#ebd5b3', price: 0.60, kcal: 40 },
  { key: 'coconut', label: 'Coconut Cream',  color: '#faf3eb', price: 0.70, kcal: 65 },
];

const CUP_SYRUPS = [
  { key: 'caramel',  label: 'Salted Caramel', color: '#d97706', price: 0.50, kcal: 55 },
  { key: 'vanilla',  label: 'Madagascar Vanilla', color: '#f3c677', price: 0.50, kcal: 45 },
  { key: 'mocha',    label: 'Dark Mocha',     color: '#5c2c16', price: 0.60, kcal: 65 },
  { key: 'none',     label: 'Unsweetened',    color: 'transparent', price: 0.00, kcal: 0 },
];

const CUP_TOPPINGS = [
  { key: 'whip',     label: 'Vanilla Cold Foam', color: '#fffdf9', price: 0.70, kcal: 50 },
  { key: 'cinnamon', label: 'Cinnamon Dust',     color: '#b45309', price: 0.25, kcal: 5  },
  { key: 'cocoa',    label: 'Cocoa Nibs',        color: '#3f1d0b', price: 0.40, kcal: 25 },
];

const CUP_SIZES = [
  { key: 'small',   label: 'Small (8oz)',   oz: '8oz',  priceMod: -0.40, kcalMod: 0.8, scale: 0.92 },
  { key: 'regular', label: 'Regular (12oz)', oz: '12oz', priceMod: 0.00,  kcalMod: 1.0, scale: 1.00 },
  { key: 'large',   label: 'Large (16oz)',   oz: '16oz', priceMod: 0.75,  kcalMod: 1.25, scale: 1.08 },
];

const CUP_PRESETS = [
  {
    name: '☁️ Caramel Cloud',
    temp: 'iced',
    size: 'large',
    baseKey: 'coldbrew',
    milkKey: 'oat',
    syrupKey: 'caramel',
    toppingKey: 'whip',
    extraShot: false,
  },
  {
    name: '🍵 Dirty Uji Matcha',
    temp: 'iced',
    size: 'regular',
    baseKey: 'matcha',
    milkKey: 'coconut',
    syrupKey: 'vanilla',
    toppingKey: 'whip',
    extraShot: true,
  },
  {
    name: '🍫 Mocha Velvet',
    temp: 'hot',
    size: 'large',
    baseKey: 'espresso',
    milkKey: 'whole',
    syrupKey: 'mocha',
    toppingKey: 'cocoa',
    extraShot: true,
  },
  {
    name: '🔥 Spiced Chai Latte',
    temp: 'hot',
    size: 'regular',
    baseKey: 'chai',
    milkKey: 'oat',
    syrupKey: 'vanilla',
    toppingKey: 'cinnamon',
    extraShot: false,
  },
];

const CAFE_ZONES = [
  { id: 'window',    title: '🪟 Sunlit Window Booth', desc: 'Cozy natural light & street view (2–4 guests)' },
  { id: 'patio',     title: '🌿 Lush Garden Patio',   desc: 'Breezy outdoor greenery & heaters (2–6 guests)' },
  { id: 'workpod',   title: '💻 Quiet Work Pod',      desc: 'Fast Wi-Fi & power outlets at every seat (1–2 guests)' },
  { id: 'fireplace', title: '🔥 Roastery Lounge',     desc: 'Plush leather armchairs near the roaster (2–6 guests)' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Daily Regular',
    rating: 5.0,
    text: 'The Caramel Macchiato with oat milk and a warm Chocolate Croissant is my everyday morning ritual. Ready in 5 minutes every time!',
  },
  {
    name: 'Liam Carter',
    role: 'Remote Designer',
    rating: 4.9,
    text: 'Best 20-hour Cold Brew in town! Building my own drink in the Live Cup Studio and booking a Quiet Work Pod is a game changer.',
  },
  {
    name: 'Elena Rostova',
    role: 'Pastry Lover',
    rating: 5.0,
    text: 'Their Cinnamon Rolls and Cappuccinos taste straight out of a Parisian café. Earning Bean Points for free drinks is a huge plus!',
  },
];

const PROMO_CODES = {
  BEAN20:  { rate: 0.20, label: '20% OFF Happy Hour' },
  BEAN25:  { rate: 0.25, label: '25% OFF Lucky Wheel Jackpot' },
  FIRST10: { rate: 0.10, label: '10% Welcome Discount' },
};

const getFallbackImage = (category) => {
  if (category === 'iced') return '/iced_coffee.jpg';
  if (category === 'bakery') return '/croissant.jpg';
  return '/cappuccino.jpg';
};

function StarRating({ rating }) {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="star-rating" aria-label={`Rating: ${rating} out of 5`}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
    </span>
  );
}

const HERO_WORDS = ['morning', 'afternoon', 'evening', 'day'];

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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return Boolean(JSON.parse(localStorage.getItem('beanSceneUser') || 'null')?.name);
    } catch {
      return false;
    }
  });
  const [userName, setUserName] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('beanSceneUser') || 'null')?.name || '';
    } catch {
      return '';
    }
  });
  const [userEmail, setUserEmail] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('beanSceneUser') || 'null')?.email || '';
    } catch {
      return '';
    }
  });

  // Products + Filters + Sort + Wishlist + Mood Matcher
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneFavorites');
      return saved ? JSON.parse(saved) : [1, 7, 15];
    } catch {
      return [1, 7, 15];
    }
  });
  const [activeMood, setActiveMood] = useState('sweet');

  // Visual Cup Customizer Studio state
  const [cupTemp, setCupTemp] = useState('hot');
  const [cupSize, setCupSize] = useState(CUP_SIZES[1]);
  const [cupBase, setCupBase] = useState(CUP_BASES[0]);
  const [cupMilk, setCupMilk] = useState(CUP_MILKS[0]);
  const [cupSyrup, setCupSyrup] = useState(CUP_SYRUPS[0]);
  const [cupTopping, setCupTopping] = useState(CUP_TOPPINGS[0]);
  const [extraShot, setExtraShot] = useState(false);
  const [customCupName, setCustomCupName] = useState('');
  const [savedCups, setSavedCups] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneSavedCups');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Table Reservation Modal state
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveZone, setReserveZone] = useState(CAFE_ZONES[0].id);
  const [reserveGuests, setReserveGuests] = useState('2 Guests');
  const [reserveTime, setReserveTime] = useState('10:30 AM');
  const [reserveName, setReserveName] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  // Spin-to-Win Wheel Modal state
  const [showSpinModal, setShowSpinModal] = useState(false);
  const [wheelDeg, setWheelDeg] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [spinPrize, setSpinPrize] = useState('');

  // Loyalty Points & Promo Code
  const [beanPoints, setBeanPoints] = useState(() => {
    const saved = Number(localStorage.getItem('beanScenePoints'));
    return Number.isFinite(saved) && saved > 0 ? saved : 120;
  });
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');

  // Customer Reviews State (Persisted)
  const [reviewsList, setReviewsList] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneReviews');
      return saved ? JSON.parse(saved) : TESTIMONIALS;
    } catch {
      return TESTIMONIALS;
    }
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revName, setRevName] = useState('');
  const [revRole, setRevRole] = useState('Coffee Lover');
  const [revRating, setRevRating] = useState('5.0');
  const [revText, setRevText] = useState('');

  // Animated hero & Promo Video Reel
  const [heroWordIdx, setHeroWordIdx] = useState(0);
  const [heroFade, setHeroFade] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [reelIdx, setReelIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroFade(false);
      setTimeout(() => { setHeroWordIdx((i) => (i + 1) % HERO_WORDS.length); setHeroFade(true); }, 400);
      setReelIdx((i) => (i + 1) % DEFAULT_PRODUCTS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Cart & Ordering (Persisted)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneCart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
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

  // Order Confirmation & Live Prep Tracker
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [prepStage, setPrepStage] = useState(0);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneOrders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Barista / Admin Hub Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminTab, setAdminTab] = useState('orders');
  const [reservationsList, setReservationsList] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneReservations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('coffee');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('✨ Barista Special');

  // Sync Cart, Orders, Reservations & Reviews to localStorage
  useEffect(() => {
    localStorage.setItem('beanSceneCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('beanSceneOrders', JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    localStorage.setItem('beanSceneReservations', JSON.stringify(reservationsList));
  }, [reservationsList]);

  useEffect(() => {
    localStorage.setItem('beanSceneReviews', JSON.stringify(reviewsList));
  }, [reviewsList]);

  // Animate Live Order Preparation Tracker when confirmation modal is open
  useEffect(() => {
    if (!showOrderConfirmation) return;
    const t0 = setTimeout(() => setPrepStage(0), 0);
    const t1 = setTimeout(() => setPrepStage(1), 2200);
    const t2 = setTimeout(() => setPrepStage(2), 4800);
    const t3 = setTimeout(() => setPrepStage(3), 7500);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [showOrderConfirmation]);

  // Navigation & Subscribe
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  // Set website title
  useEffect(() => {
    document.title = "Bean Scene | Premium Coffee & Bakery";
  }, []);

  // Fetch products from backend or fallback to default
  useEffect(() => {
    const fetchProducts = async () => {
      if (!API_BASE_URL) {
        setProducts(DEFAULT_PRODUCTS);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const merged = DEFAULT_PRODUCTS.map((def) => {
            const remote = res.data.find((r) => r.id === def.id || r.name === def.name);
            return remote
              ? { ...def, ...remote, image: remote.image || def.image, category: remote.category || def.category }
              : def;
          });
          const extra = res.data.filter(
            (r) => !DEFAULT_PRODUCTS.some((def) => def.id === r.id || def.name === r.name)
          );
          setProducts([...merged, ...extra]);
        }
      } catch {
        setProducts(DEFAULT_PRODUCTS);
      }
    };
    fetchProducts();
  }, []);

  // Toast feedback
  const showToast = (msg) => {
    setCartToast(msg);
    setTimeout(() => setCartToast(''), 3200);
  };

  // Toggle Favorite
  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      localStorage.setItem('beanSceneFavorites', JSON.stringify(next));
      return next;
    });
  };

  // Quick 1-Click Add to Cart from Menu Card
  const handleQuickAdd = (product) => {
    const quickItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      image: product.image,
      size: 'regular',
      milk: product.category === 'bakery' ? null : 'whole',
      notes: '',
      unitPrice: product.price,
      price: product.price,
      quantity: 1,
    };
    setCart((prev) => [...prev, quickItem]);
    showToast(`Quick-added ${product.name} to cart!`);
  };

  // Add AI Mood Pairing Combo (with 10% bundle discount)
  const handleAddMoodCombo = (drink, food) => {
    if (!drink || !food) return;
    const comboPrice = Number(((drink.price + food.price) * 0.9).toFixed(2));
    const comboItem = {
      id: `combo-${drink.id}-${food.id}-${Date.now()}`,
      name: `✨ Pairing: ${drink.name} + ${food.name}`,
      image: drink.image,
      size: 'regular',
      milk: 'whole',
      unitPrice: comboPrice,
      price: comboPrice,
      quantity: 1,
    };
    setCart((prev) => [...prev, comboItem]);
    showToast(`Added ${drink.name} + ${food.name} Combo (10% OFF)!`);
  };

  // Visual Custom Cup Price & Macros
  const customCupPrice = Math.max(
    2.5,
    cupBase.price + cupMilk.price + cupSyrup.price + cupTopping.price + cupSize.priceMod + (extraShot ? 0.85 : 0)
  );
  const customCupCalories = Math.round(
    (cupBase.kcal + cupMilk.kcal + cupSyrup.kcal + cupTopping.kcal + (extraShot ? 10 : 0)) * cupSize.kcalMod
  );
  const customCupCaffeine = cupBase.caffeine + (extraShot ? 75 : 0);

  const handleAddCustomCup = () => {
    const label = customCupName.trim() || `Custom ${cupBase.label}`;
    const tempLabel = cupTemp === 'hot' ? 'Hot' : 'Iced';
    const shotLabel = extraShot ? ' + Extra Shot' : '';
    const customItem = {
      id: `custom-${Date.now()}`,
      name: `🎨 ${label} (${cupSize.oz} ${tempLabel}${shotLabel} • ${cupMilk.label}, ${cupSyrup.label}, ${cupTopping.label})`,
      image: cupTemp === 'iced' ? '/iced_coffee.jpg' : '/cappuccino.jpg',
      unitPrice: customCupPrice,
      price: customCupPrice,
      quantity: 1,
    };
    setCart((prev) => [...prev, customItem]);
    setCustomCupName('');
    showToast(`Added ${customItem.name} to your cart!`);
  };

  const handleOrderCustomCupNow = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const label = customCupName.trim() || `Custom ${cupBase.label}`;
    const tempLabel = cupTemp === 'hot' ? 'Hot' : 'Iced';
    const shotLabel = extraShot ? ' + Extra Shot' : '';
    const customProduct = {
      id: 99,
      name: `🎨 ${label} (${cupSize.oz} ${tempLabel}${shotLabel})`,
      description: `${cupBase.label} with ${cupMilk.label}, ${cupSyrup.label}, and ${cupTopping.label}`,
      price: customCupPrice,
      image: cupTemp === 'iced' ? '/iced_coffee.jpg' : '/cappuccino.jpg',
      category: cupTemp === 'iced' ? 'iced' : 'coffee',
    };
    openOrderModal(customProduct);
  };

  const applyCupPreset = (preset) => {
    setCupTemp(preset.temp);
    setCupSize(CUP_SIZES.find((s) => s.key === preset.size) || CUP_SIZES[1]);
    setCupBase(CUP_BASES.find((b) => b.key === preset.baseKey) || CUP_BASES[0]);
    setCupMilk(CUP_MILKS.find((m) => m.key === preset.milkKey) || CUP_MILKS[0]);
    setCupSyrup(CUP_SYRUPS.find((s) => s.key === preset.syrupKey) || CUP_SYRUPS[0]);
    setCupTopping(CUP_TOPPINGS.find((t) => t.key === preset.toppingKey) || CUP_TOPPINGS[0]);
    setExtraShot(Boolean(preset.extraShot));
    setCustomCupName(preset.name.replace(/^[^\s]+\s/, ''));
    showToast(`Loaded "${preset.name}" recipe into Cup Studio!`);
  };

  const handleSurpriseCup = () => {
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setCupTemp(Math.random() > 0.5 ? 'iced' : 'hot');
    setCupSize(rand(CUP_SIZES));
    setCupBase(rand(CUP_BASES));
    setCupMilk(rand(CUP_MILKS));
    setCupSyrup(rand(CUP_SYRUPS));
    setCupTopping(rand(CUP_TOPPINGS));
    setExtraShot(Math.random() > 0.6);
    setCustomCupName('Barista Mystery Cup');
    showToast('🎲 Mixed a Surprise Barista Creation for you!');
  };

  const handleSaveCustomCup = () => {
    const label = customCupName.trim() || `Custom ${cupBase.label}`;
    const tempLabel = cupTemp === 'hot' ? 'Hot' : 'Iced';
    const shotLabel = extraShot ? ' + Extra Shot' : '';
    const item = {
      id: `custom-${Date.now()}`,
      name: `🎨 ${label} (${cupSize.oz} ${tempLabel}${shotLabel} • ${cupMilk.label}, ${cupSyrup.label}, ${cupTopping.label})`,
      image: cupTemp === 'iced' ? '/iced_coffee.jpg' : '/cappuccino.jpg',
      unitPrice: customCupPrice,
      price: customCupPrice,
      quantity: 1,
    };
    setSavedCups((prev) => {
      const next = [item, ...prev.slice(0, 5)];
      localStorage.setItem('beanSceneSavedCups', JSON.stringify(next));
      return next;
    });
    showToast('💾 Saved your custom cup recipe to My Saved Creations!');
  };

  // Handle Table Reservation Submit
  const handleReserveSubmit = async (e) => {
    e.preventDefault();
    const zoneObj = CAFE_ZONES.find((z) => z.id === reserveZone) || CAFE_ZONES[0];
    const passId = `VIP-${Math.floor(100 + Math.random() * 900)}`;
    const guestName = reserveName.trim() || (isLoggedIn ? userName : 'Valued Guest');
    const reservationPayload = {
      passId,
      name: guestName,
      zone: zoneObj.title,
      guests: reserveGuests,
      time: reserveTime,
    };

    try {
      await axios.post(`${API_BASE_URL}/api/reservations`, reservationPayload);
    } catch {
      // Fallback locally if backend is offline
    }

    setConfirmedReservation(reservationPayload);
    setReservationsList((prev) => [reservationPayload, ...prev]);
    showToast(`Table Pass #${passId} reserved for ${reserveTime}! 🪑`);
  };

  // Handle Spin-the-Wheel
  const handleSpinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setSpinPrize('');
    const extraSpins = 1440 + Math.floor(Math.random() * 360);
    const nextDeg = wheelDeg + extraSpins;
    setWheelDeg(nextDeg);

    setTimeout(() => {
      setSpinning(false);
      const prizes = [
        { type: 'promo', code: 'BEAN25', msg: '🎉 Jackpot! 25% OFF Code BEAN25 Unlocked & Applied!' },
        { type: 'points', pts: 75, msg: '🏆 +75 Bonus Bean Points Added to Your Wallet!' },
        { type: 'promo', code: 'BEAN20', msg: '🔥 20% OFF Code BEAN20 Unlocked & Applied!' },
      ];
      const won = prizes[Math.floor(Math.random() * prizes.length)];
      setSpinPrize(won.msg);
      if (won.type === 'promo') {
        setAppliedPromo(won.code);
        setPromoInput(won.code);
      } else if (won.type === 'points') {
        setBeanPoints((p) => {
          const updated = p + won.pts;
          localStorage.setItem('beanScenePoints', String(updated));
          return updated;
        });
      }
      showToast(won.msg);
    }, 2450);
  };

  // Apply Promo Code
  const applyPromoCode = (codeStr) => {
    const normalized = (codeStr || promoInput).trim().toUpperCase();
    if (PROMO_CODES[normalized]) {
      setAppliedPromo(normalized);
      setPromoInput(normalized);
      showToast(`Promo ${normalized} applied (${PROMO_CODES[normalized].label})! 🎉`);
    } else {
      showToast('Invalid promo code. Try BEAN20, BEAN25, or FIRST10');
    }
  };

  // Filtered + Sorted products
  const filteredProducts = products
    .filter((p) => {
      const matchCat =
        activeCategory === 'all'
          ? true
          : activeCategory === 'favorites'
          ? favorites.includes(p.id)
          : p.category === activeCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });

  // Current Mood Pairing Objects
  const currentMoodObj = MOOD_PAIRINGS.find((m) => m.key === activeMood) || MOOD_PAIRINGS[0];
  const moodDrink = products.find((p) => p.id === currentMoodObj.drinkId) || products[0];
  const moodFood = products.find((p) => p.id === currentMoodObj.foodId) || products[4];

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
        setSubscribeMessage('Thank you for subscribing! Use code FIRST10 for 10% off ☕');
        setEmail('');
        setTimeout(() => setSubscribeMessage(''), 5000);
      })
      .catch(() => {
        setSubscribeMessage('Thank you for subscribing! Use code FIRST10 for 10% off ☕');
        setEmail('');
        setTimeout(() => setSubscribeMessage(''), 5000);
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
  const isBakeryItem = activeItem?.category === 'bakery' ||
    activeItem?.name?.toLowerCase().includes('croissant') ||
    activeItem?.name?.toLowerCase().includes('muffin');
  const sizeCost = orderSize === 'large' ? 0.80 : 0;
  const milkCost = !isBakeryItem && (orderMilk === 'oat' || orderMilk === 'almond') ? 0.50 : 0;
  const modalUnitPrice = (activeItem?.price || 0) + sizeCost + milkCost;
  const modalTotalPrice = modalUnitPrice * orderQty;

  // Award Loyalty Points helper
  const awardPoints = (amountSpent) => {
    const earned = Math.max(10, Math.round(amountSpent * 10));
    setBeanPoints((prev) => {
      const updated = prev + earned;
      localStorage.setItem('beanScenePoints', String(updated));
      return updated;
    });
    return earned;
  };

  // Add customized item from modal to cart
  const handleAddModalToCart = () => {
    const customizedItem = {
      id: `${activeItem.id}-${Date.now()}`,
      productId: activeItem.id,
      name: activeItem.name,
      image: activeItem.image || DEFAULT_PRODUCTS.find(p => p.id === activeItem.id)?.image,
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

  // Direct checkout from moda
  const handleDirectOrderNow = async (e) => {
    e.preventDefault();
    const customer = orderCustomer.trim() || (isLoggedIn ? userName : 'Guest');
    const orderId = `BSC-${Math.floor(1000 + Math.random() * 9000)}`;
    const earnedPts = awardPoints(modalTotalPrice);

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
      pointsEarned: earnedPts,
      customer: customer,
      placedAt: new Date().toISOString(),
      status: 'Received',
    };

    try {
      await axios.post(`${API_BASE_URL}/api/orders`, {
        items: newOrder.items,
        total: newOrder.total,
        user: customer,
        email: isLoggedIn ? userEmail : 'guest@beanscene.com',
      });
    } catch {
      // Fallback locally if backend server is offline
    }

    setConfirmedOrder(newOrder);
    setOrderHistory((prev) => [newOrder, ...prev]);
    setShowOrderModal(false);
    setShowOrderConfirmation(true);
    showToast(`Order #${orderId} confirmed! +${earnedPts} Bean Points ☕`);
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

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price || item.unitPrice || 0) * (item.quantity || 1), 0);
  const promoDiscountRate = appliedPromo && PROMO_CODES[appliedPromo] ? PROMO_CODES[appliedPromo].rate : 0;
  const cartDiscount = cartSubtotal * promoDiscountRate;
  const pointsDiscount = redeemPoints && beanPoints >= 200 ? Math.min(5.0, Math.max(0, cartSubtotal - cartDiscount)) : 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount - pointsDiscount);
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

    if (redeemPoints && beanPoints >= 200) {
      setBeanPoints((prev) => {
        const afterRedeem = Math.max(0, prev - 200);
        localStorage.setItem('beanScenePoints', String(afterRedeem));
        return afterRedeem;
      });
      setRedeemPoints(false);
    }

    const earnedPts = awardPoints(cartTotal);

    const orderRecord = {
      id: orderId,
      items: [...cart],
      total: cartTotal,
      pointsEarned: earnedPts,
      customer: isLoggedIn ? userName : 'Guest',
      placedAt: new Date().toISOString(),
      status: 'Received',
    };

    setConfirmedOrder(orderRecord);
    setOrderHistory((prev) => [orderRecord, ...prev]);
    setCart([]);
    setAppliedPromo('');
    setPromoInput('');
    setShowCart(false);
    setShowOrderConfirmation(true);
    setPlacingOrder(false);
    showToast(`Order placed! +${earnedPts} Bean Points earned 🎉`);
  };

  // 1-Click Reorder from Order History
  const handleReorder = (pastOrder) => {
    if (!pastOrder || !Array.isArray(pastOrder.items)) return;
    const clonedItems = pastOrder.items.map((it, idx) => ({
      ...it,
      id: `reorder-${Date.now()}-${idx}`,
      unitPrice: it.unitPrice || it.price || 4.5,
      price: it.price || it.unitPrice || 4.5,
      quantity: it.quantity || 1,
    }));
    setCart((prev) => [...prev, ...clonedItems]);
    setShowOrderHistory(false);
    setShowCart(true);
    showToast(`Re-added ${clonedItems.length} item(s) from Order #${pastOrder.id} to cart! 🔁`);
  };

  // Add Customer Review in #reviews
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!revText.trim()) return;
    const author = revName.trim() || (isLoggedIn ? userName : 'Coffee Lover');
    const newRev = {
      name: author,
      role: revRole.trim() || 'Verified Guest',
      rating: parseFloat(revRating) || 5.0,
      text: revText.trim(),
    };
    setReviewsList((prev) => [newRev, ...prev]);
    setRevName('');
    setRevText('');
    setShowReviewForm(false);
    awardPoints(2.5); // +25 bonus points for reviewing
    showToast('Thank you for your review! +25 Bonus Bean Points awarded ☕✨');
  };

  // Print / Save Order Receipt
  const handlePrintReceipt = (order) => {
    if (!order) return;
    const win = window.open('', '_blank', 'width=420,height=600');
    if (!win) {
      window.print();
      return;
    }
    const itemsHtml = (order.items || [])
      .map(
        (it) =>
          `<div style="display:flex;justify-content:space-between;margin:6px 0;font-size:14px;">
            <span>${it.quantity || 1}x ${it.name}</span>
            <span>$${((it.price || it.unitPrice || 0) * (it.quantity || 1)).toFixed(2)}</span>
          </div>`
      )
      .join('');
    win.document.write(`
      <html>
        <head><title>Bean Scene Receipt #${order.id}</title></head>
        <body style="font-family:monospace;padding:24px;color:#111;max-width:360px;margin:0 auto;">
          <h2 style="text-align:center;margin-bottom:4px;">☕ BEAN SCENE</h2>
          <p style="text-align:center;margin-top:0;font-size:12px;color:#555;">Premium Coffee & Artisan Bakery</p>
          <hr/>
          <p style="font-size:13px;"><strong>Order ID:</strong> #${order.id}<br/>
          <strong>Customer:</strong> ${order.customer || order.user || 'Guest'}<br/>
          <strong>Status:</strong> ${order.status || 'Received'}</p>
          <hr/>
          ${itemsHtml}
          <hr/>
          <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:16px;margin-top:8px;">
            <span>TOTAL PAID</span>
            <span>$${Number(order.total || 0).toFixed(2)}</span>
          </div>
          <p style="text-align:center;font-size:12px;margin-top:24px;color:#555;">Thank you for visiting Bean Scene!</p>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  // Open Barista / Admin Hub and sync backend orders & reservations
  const openAdminHub = async () => {
    setShowAdminModal(true);
    if (!API_BASE_URL) return;
    try {
      const [ordRes, resvRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/orders`),
        axios.get(`${API_BASE_URL}/api/reservations`),
      ]);
      if (ordRes.status === 'fulfilled' && Array.isArray(ordRes.value.data) && ordRes.value.data.length > 0) {
        setOrderHistory(ordRes.value.data);
      }
      if (resvRes.status === 'fulfilled' && Array.isArray(resvRes.value.data) && resvRes.value.data.length > 0) {
        setReservationsList(resvRes.value.data);
      }
    } catch {
      // Keep local state if backend is offline
    }
  };

  // Advance Order Status in Barista Hub (Received -> Brewing -> Ready!)
  const handleAdvanceOrderStatus = async (orderId, currentStatus) => {
    const stages = ['Received', 'Brewing', 'Ready!'];
    const nextStatus = stages[(stages.indexOf(currentStatus || 'Received') + 1) % stages.length];
    setOrderHistory((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    try {
      await axios.patch(`${API_BASE_URL}/api/orders/${orderId}`, { status: nextStatus });
    } catch {
      // Updated locally
    }
    showToast(`Order #${orderId} marked as ${nextStatus}`);
  };

  // Create New Menu Item from Barista Hub
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;
    const payload = {
      name: newProdName.trim(),
      price: parseFloat(newProdPrice),
      category: newProdCategory,
      description: newProdDesc.trim() || 'Freshly handcrafted barista specialty',
      badge: newProdBadge.trim() || '✨ Barista Special',
      image: getFallbackImage(newProdCategory),
      rating: 4.9,
      reviews: 1,
      popular: true,
      calories: 160,
      caffeine: newProdCategory === 'bakery' ? '0mg' : '150mg',
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/products`, payload);
      setProducts((prev) => [...prev, res.data]);
    } catch {
      setProducts((prev) => [...prev, { ...payload, id: Date.now() }]);
    }

    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    showToast(`Added "${payload.name}" to the live menu!`);
  };

  // Delete Menu Item from Barista Hub
  const handleDeleteProduct = async (id, name) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
    } catch {
      // Removed locally
    }
    showToast(`Removed "${name}" from menu`);
  };

  return (
    <div>
      {/* STICKY HEADER: FLASH PROMO BANNER + PREMIUM NAVBAR */}
      <header className="site-header">
        <div className="flash-promo-banner">
          <span>🔥 <strong>Happy Hour Deal:</strong> Get 20% OFF any handcrafted coffee or pastry order!</span>
          <button
            type="button"
            className="promo-code-pill"
            onClick={() => applyPromoCode('BEAN20')}
            title="Click to apply 20% discount"
          >
            Use Code: BEAN20
          </button>
          <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>• 🏆 Your Rewards: <strong>{beanPoints} pts</strong></span>
        </div>

        <nav className="navbar">
          <a href="#home" className="logo">
            <span className="logo-emblem">☕</span>
            <span>Bean Scene</span>
          </a>

          {/* Desktop Links inside Glass Pill */}
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#story">Video Story</a></li>
            <li><a href="#customizer">Cup Studio</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#subscribe">Subscribe</a></li>
          </ul>

          <div className="nav-actions">
            <button
              type="button"
              className="nav-book-btn"
              onClick={() => {
                setConfirmedReservation(null);
                setShowReserveModal(true);
              }}
              title="Reserve a table in our café"
            >
              🪑 Book Table
            </button>

            <button
              type="button"
              className="nav-book-btn"
              onClick={openAdminHub}
              title="Open Barista & Admin Control Center"
            >
              ⚡ Barista Hub
            </button>

            <button
              className="cart-btn"
              id="nav-cart-btn"
              onClick={() => setShowCart(true)}
              aria-label="View shopping cart"
            >
              🛒 Cart <span className="cart-badge">{cartItemCount}</span>
            </button>

            {isLoggedIn ? (
              <div className="user-profile-pill">
                <button
                  type="button"
                  className="user-profile-trigger"
                  onClick={() => setShowOrderHistory(true)}
                  title={`Signed in as ${userName} — Click to view My Orders`}
                >
                  <span className="user-avatar-badge">
                    {(userName || 'U').charAt(0).toUpperCase()}
                  </span>
                  <span className="user-name-text">{userName}</span>
                </button>
                <span className="user-pill-divider" />
                <button
                  type="button"
                  className="logout-pill-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
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
      </header>

      {/* Mobile Nav Panel */}
      <div className={`mobile-nav-panel ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
        <a href="#story" onClick={() => setMobileMenuOpen(false)}>Video Story</a>
        <a href="#customizer" onClick={() => setMobileMenuOpen(false)}>Cup Studio</a>
        <a href="#menu" onClick={() => setMobileMenuOpen(false)}>Menu</a>
        <a href="#reviews" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
        <button
          type="button"
          className="btn-secondary"
          style={{ alignSelf: 'flex-start', padding: '0.5rem 1.1rem', fontSize: '0.9rem' }}
          onClick={() => {
            setMobileMenuOpen(false);
            setConfirmedReservation(null);
            setShowReserveModal(true);
          }}
        >
          🪑 Book a Table
        </button>
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

      {/* HERO — BACKGROUND VIDEO + ANIMATED TEXT + STATS */}
      <section className="hero" id="home">
        <video
          className="hero-bg-video"
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-bg.jpg"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-pouring-milk-into-a-cup-of-coffee-41547-large.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-coffee-beans-falling-in-slow-motion-4996-large.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay" />

        <div className="hero-badge">☕ Premium Coffee &amp; Bakery • 🏆 {beanPoints} Bean Points</div>
        <h1>
          We've got your<br />
          <span className={`hero-animated-word ${heroFade ? 'fade-in' : 'fade-out'}`}>
            {HERO_WORDS[heroWordIdx]}
          </span><br />
          covered with Coffee
        </h1>
        <p>Premium beans. Expertly roasted. Perfectly brewed. Start your day the Bean Scene way.</p>
        <div className="hero-cta-group" style={{ flexDirection: 'column', gap: '1.5rem' }}>
          <div className="hero-actions-row">
            <a href="#menu" className="btn-primary">Explore Menu →</a>
            <button
              type="button"
              className="btn-watch-video"
              onClick={() => setShowVideoModal(true)}
            >
              <span className="play-icon-circle">▶</span>
              Watch Promo Video
            </button>
            <a href="#customizer" className="btn-secondary" style={{ textDecoration: 'none' }}>
              🎨 Build Your Cup
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>4.9★</strong><span>Rating</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>5K+</strong><span>Orders</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>{products.length}</strong><span>Specials</span></div>
          </div>
        </div>
      </section>

      {/* LUXURY INFINITE MARQUEE RIBBON */}
      <div className="luxury-marquee" aria-hidden="true">
        <div className="luxury-marquee-track">
          ✦ 100% SINGLE-ORIGIN ARABICA ✦ SMALL-BATCH ROASTED DAILY ✦ ARTISAN FRENCH BAKERY ✦ OAT &amp; ALMOND MILK AVAILABLE ✦ EARN 10 BEAN POINTS PER $1 ✦ READY IN 5–8 MINUTES ✦ 100% SINGLE-ORIGIN ARABICA ✦ SMALL-BATCH ROASTED DAILY ✦ ARTISAN FRENCH BAKERY ✦ OAT &amp; ALMOND MILK AVAILABLE ✦
        </div>
      </div>

      {/* COFFEE CRAFT & MENU VIDEO SHOWCASE */}
      <section className="video-showcase-section" id="story">
        <div className="video-showcase-card">
          <div className="video-player-stage">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/hero-bg.jpg"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-pouring-milk-into-a-cup-of-coffee-41547-large.mp4" type="video/mp4" />
            </video>
            <div className="video-reel-overlay">
              <div className="video-reel-top">
                <span className="live-reel-pill">
                  ● Spotlight {(reelIdx % products.length) + 1}/{products.length}
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="reel-nav-btn"
                    onClick={() => setReelIdx((i) => (i - 1 + products.length) % products.length)}
                    aria-label="Previous spotlight item"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="reel-nav-btn"
                    onClick={() => setReelIdx((i) => (i + 1) % products.length)}
                    aria-label="Next spotlight item"
                  >
                    ›
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '0.38rem 0.85rem', fontSize: '0.78rem' }}
                    onClick={() => setShowVideoModal(true)}
                  >
                    ⛶ Fullscreen
                  </button>
                </div>
              </div>
              {products[reelIdx % products.length] && (
                <div className="reel-slide-card">
                  <img
                    src={products[reelIdx % products.length].image}
                    alt={products[reelIdx % products.length].name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getFallbackImage(products[reelIdx % products.length].category);
                    }}
                  />
                  <div className="reel-slide-info" style={{ flex: 1 }}>
                    <h4>{products[reelIdx % products.length].name}</h4>
                    <p>{products[reelIdx % products.length].description}</p>
                    <span className="reel-slide-price">${products[reelIdx % products.length].price.toFixed(2)}</span>
                  </div>
                  <button
                    type="button"
                    className="order-btn"
                    onClick={() => openOrderModal(products[reelIdx % products.length])}
                  >
                    Order
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="video-showcase-content">
            <span className="modal-badge">Behind Every Cup</span>
            <h2>Crafted from 100% Arabica Beans to Your Cup</h2>
            <p>
              Watch how Bean Scene roasts, grinds, and pours our {products.length} signature hot coffees,
              chilled brews, and French bakery specials fresh every single morning.
            </p>
            <div className="video-highlights">
              <div className="video-highlight-item">☕ Small-Batch Roasted</div>
              <div className="video-highlight-item">🥛 Oat &amp; Almond Options</div>
              <div className="video-highlight-item">🥐 Baked Fresh Daily</div>
              <div className="video-highlight-item">⚡ Ready in 5–8 Mins</div>
            </div>
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <button type="button" className="btn-primary" onClick={() => setShowVideoModal(true)}>
                ▶ Play Full Promo Video
              </button>
              <a href="#menu" className="btn-secondary" style={{ textDecoration: 'none' }}>
                Browse {products.length} Specials
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: INTERACTIVE VISUAL "BUILD YOUR DREAM CUP" STUDIO */}
      <section className="section" id="customizer" style={{ paddingTop: 10, paddingBottom: 40 }}>
        <div className="section-header">
          <span className="modal-badge">Interactive 3D Barista Lab</span>
          <h2>🎨 Build Your Dream Cup</h2>
          <p>Watch your custom creation come to life layer by layer in our interactive Barista Studio</p>

          {/* 1-Click Barista Signature Presets + Surprise Me */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.55rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {CUP_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                className="mood-pill-btn"
                style={{ padding: '0.4rem 0.95rem', fontSize: '0.8rem' }}
                onClick={() => applyCupPreset(preset)}
              >
                {preset.name}
              </button>
            ))}
            <button
              type="button"
              className="mood-pill-btn active"
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
              onClick={handleSurpriseCup}
            >
              🎲 Surprise Me!
            </button>
          </div>
        </div>

        <div className="cup-studio-card">
          {/* Live Layered Glass Visualization */}
          <div className="cup-preview-stage">
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '0.6rem' }}>
              <button
                type="button"
                className={`mood-pill-btn ${cupTemp === 'hot' ? 'active' : ''}`}
                style={{ padding: '0.32rem 0.8rem', fontSize: '0.76rem' }}
                onClick={() => setCupTemp('hot')}
              >
                🔥 Hot Mug
              </button>
              <button
                type="button"
                className={`mood-pill-btn ${cupTemp === 'iced' ? 'active' : ''}`}
                style={{ padding: '0.32rem 0.8rem', fontSize: '0.76rem' }}
                onClick={() => setCupTemp('iced')}
              >
                🧊 Iced Glass
              </button>
              <button
                type="button"
                className={`mood-pill-btn ${extraShot ? 'active' : ''}`}
                style={{ padding: '0.32rem 0.8rem', fontSize: '0.76rem' }}
                onClick={() => setExtraShot((s) => !s)}
              >
                ⚡ +1 Shot (+$0.85)
              </button>
            </div>

            {/* Cup Size Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.65rem' }}>
              {CUP_SIZES.map((sz) => (
                <button
                  key={sz.key}
                  type="button"
                  className={`mood-pill-btn ${cupSize.key === sz.key ? 'active' : ''}`}
                  style={{ padding: '0.26rem 0.7rem', fontSize: '0.74rem' }}
                  onClick={() => setCupSize(sz)}
                >
                  {sz.label}
                </button>
              ))}
            </div>

            {cupTemp === 'hot' ? (
              <div className="steam-lines">
                <span />
                <span />
                <span />
              </div>
            ) : (
              <div style={{ height: 14 }} />
            )}

            <div
              className="cup-glass-wrapper"
              style={{ transform: `scale(${cupSize.scale})`, transition: 'transform 0.3s ease' }}
            >
              <div className="visual-cup-glass">
                {cupTemp === 'iced' && (
                  <div className="ice-cubes-overlay">
                    <span className="ice-cube" />
                    <span className="ice-cube" />
                  </div>
                )}
                <div
                  className="cup-layer"
                  style={{ height: extraShot ? '38%' : '32%', background: cupBase.color }}
                >
                  {cupBase.label}{extraShot ? ' + Shot' : ''}
                </div>
                <div
                  className="cup-layer"
                  style={{ height: '32%', background: cupMilk.color, color: '#222' }}
                >
                  {cupMilk.label}
                </div>
                {cupSyrup.key !== 'none' && (
                  <div
                    className="cup-layer"
                    style={{ height: '14%', background: cupSyrup.color }}
                  >
                    {cupSyrup.label}
                  </div>
                )}
                <div
                  className="cup-layer"
                  style={{ height: '18%', background: cupTopping.color, color: cupTopping.key === 'whip' ? '#222' : '#fff' }}
                >
                  {cupTopping.label}
                </div>
              </div>
              {cupTemp === 'hot' && <div className="cup-handle-ring" />}
            </div>

            <div className="cup-macros-bar">
              <span className="macro-badge">{cupSize.oz} • {cupTemp === 'hot' ? '🔥 Hot' : '🧊 Iced'}</span>
              <span className="macro-badge">⚡ {customCupCaffeine}mg</span>
              <span className="macro-badge">🔥 {customCupCalories} kcal</span>
              <span className="macro-badge">💲 ${customCupPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Layer Controls */}
          <div>
            <div className="form-group">
              <label className="form-label">1. Choose Your Craft Base</label>
              <div className="pill-group">
                {CUP_BASES.map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    className={`mood-pill-btn ${cupBase.key === b.key ? 'active' : ''}`}
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                    onClick={() => setCupBase(b)}
                  >
                    {b.label} (${b.price.toFixed(2)})
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">2. Select Milk Texture</label>
              <div className="pill-group">
                {CUP_MILKS.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    className={`mood-pill-btn ${cupMilk.key === m.key ? 'active' : ''}`}
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                    onClick={() => setCupMilk(m)}
                  >
                    {m.label} {m.price > 0 ? `(+$${m.price.toFixed(2)})` : '(Free)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">3. Artisanal Syrup Swirl</label>
              <div className="pill-group">
                {CUP_SYRUPS.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    className={`mood-pill-btn ${cupSyrup.key === s.key ? 'active' : ''}`}
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                    onClick={() => setCupSyrup(s)}
                  >
                    {s.label} {s.price > 0 ? `(+$${s.price.toFixed(2)})` : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">4. Signature Finishing Topping</label>
              <div className="pill-group">
                {CUP_TOPPINGS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    className={`mood-pill-btn ${cupTopping.key === t.key ? 'active' : ''}`}
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                    onClick={() => setCupTopping(t)}
                  >
                    {t.label} (+${t.price.toFixed(2)})
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1.1rem' }}>
              <input
                type="text"
                className="modal-input"
                placeholder="Name your creation (e.g. Alex's Cloud Latte)"
                value={customCupName}
                onChange={(e) => setCustomCupName(e.target.value)}
                style={{ flex: 1, minWidth: 195 }}
              />
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.75rem 1.1rem', fontSize: '0.88rem' }}
                onClick={handleSaveCustomCup}
                title="Save this recipe to your Saved Creations"
              >
                💾 Save
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.75rem 1.2rem', fontSize: '0.88rem' }}
                onClick={handleAddCustomCup}
              >
                + Add to Cart
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '0.75rem 1.35rem', fontSize: '0.9rem' }}
                onClick={handleOrderCustomCupNow}
              >
                ⚡ Order Cup (${customCupPrice.toFixed(2)})
              </button>
            </div>
          </div>
        </div>

        {/* Saved Custom Cup Creations Shelf */}
        {savedCups.length > 0 && (
          <div
            className="mood-matcher-box"
            style={{ maxWidth: 1120, margin: '1.5rem auto 0', padding: '1.2rem 1.6rem', textAlign: 'left' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <strong style={{ color: 'var(--warm)', fontSize: '0.95rem' }}>
                💾 Your Saved Barista Creations ({savedCups.length})
              </strong>
              <button
                type="button"
                onClick={() => {
                  setSavedCups([]);
                  localStorage.removeItem('beanSceneSavedCups');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                Clear Saved
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {savedCups.map((sc) => (
                <div
                  key={sc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    padding: '0.5rem 0.85rem',
                  }}
                >
                  <span style={{ fontSize: '0.83rem', color: '#fff', fontWeight: 600 }}>{sc.name}</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--warm)' }}>${sc.price.toFixed(2)}</strong>
                  <button
                    type="button"
                    className="order-btn"
                    style={{ padding: '0.28rem 0.7rem', fontSize: '0.75rem' }}
                    onClick={() => {
                      setCart((prev) => [...prev, { ...sc, id: `saved-${Date.now()}` }]);
                      showToast(`Added ${sc.name} to cart!`);
                    }}
                  >
                    + Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* MENU SECTION */}
      <section className="section" id="menu">
        <div className="section-header">
          <h2>Our Menu</h2>
          <p>Freshly brewed favorites, made just for you</p>
        </div>

        {/* AI BARISTA MOOD MATCHER */}
        <div className="mood-matcher-box">
          <div className="mood-matcher-header">
            <div>
              <span className="modal-badge">✨ AI Coffee Sommelier</span>
              <h3>Not sure what to order? Match your mood!</h3>
              <p>Pick your vibe below for a curated Drink + Bakery pairing with <strong>10% Combo Savings</strong></p>
            </div>
          </div>

          <div className="mood-pills">
            {MOOD_PAIRINGS.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`mood-pill-btn ${activeMood === m.key ? 'active' : ''}`}
                onClick={() => setActiveMood(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>

          {moodDrink && moodFood && (
            <div className="mood-result-card">
              <div className="mood-pair-items">
                <div className="mood-pair-item">
                  <img
                    src={moodDrink.image}
                    alt={moodDrink.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getFallbackImage(moodDrink.category);
                    }}
                  />
                  <div>
                    <strong style={{ color: '#fff', display: 'block' }}>{moodDrink.name}</strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>${moodDrink.price.toFixed(2)}</span>
                  </div>
                </div>

                <span className="mood-plus">+</span>

                <div className="mood-pair-item">
                  <img
                    src={moodFood.image}
                    alt={moodFood.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getFallbackImage(moodFood.category);
                    }}
                  />
                  <div>
                    <strong style={{ color: '#fff', display: 'block' }}>{moodFood.name}</strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>${moodFood.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginRight: '0.4rem' }}>
                    ${(moodDrink.price + moodFood.price).toFixed(2)}
                  </span>
                  <strong style={{ fontSize: '1.35rem', color: 'var(--warm)' }}>
                    ${((moodDrink.price + moodFood.price) * 0.9).toFixed(2)}
                  </strong>
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '0.7rem 1.4rem', fontSize: '0.92rem' }}
                  onClick={() => handleAddMoodCombo(moodDrink, moodFood)}
                >
                  + Add Pairing (Save 10%)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search + Sort Controls */}
        <div className="menu-controls-row">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              id="menu-search"
              type="text"
              className="search-input"
              placeholder="Search menu items…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">✕</button>
            )}
          </div>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort menu items"
          >
            <option value="featured">🔥 Sort: Featured</option>
            <option value="rating">⭐ Sort: Top Rated</option>
            <option value="price-asc">💲 Price: Low to High</option>
            <option value="price-desc">💲 Price: High to Low</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs" role="tablist">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              role="tab"
              aria-selected={activeCategory === cat.key}
              className={`category-tab ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
              {cat.key === 'favorites' ? ` (${favorites.length})` : ''}
            </button>
          ))}
        </div>

        {/* Cards Grid or No Results */}
        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <span>😔</span>
            <p>No items match your current filter</p>
            <button className="btn-secondary" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>Clear Filters</button>
          </div>
        ) : (
          <div className="menu-grid">
            {filteredProducts.map((product) => {
              const btnId = `order-btn-${product.name?.toLowerCase().replace(/\s+/g, '-')}`;
              const isFav = favorites.includes(product.id);
              return (
                <div key={product.id || product.name} className="menu-card">
                  <button
                    type="button"
                    className={`card-fav-btn ${isFav ? 'active' : ''}`}
                    onClick={() => toggleFavorite(product.id)}
                    aria-label={`Toggle favorite for ${product.name}`}
                    title={isFav ? 'Remove from Favorites' : 'Save to Favorites'}
                  >
                    {isFav ? '♥' : '♡'}
                  </button>
                  {product.popular && <div className="popular-badge">🔥 Popular</div>}
                  {product.image && (
                    <div className="menu-card-img-wrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="menu-card-img"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getFallbackImage(product.category);
                        }}
                      />
                    </div>
                  )}
                  <div className="menu-card-body">
                    <div className="menu-card-meta">
                      <StarRating rating={product.rating || 4.5} />
                      <span className="review-count">({product.reviews || 0})</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p style={{ marginBottom: '0.9rem' }}>{product.description}</p>
                    <div className="card-spec-pills">
                      {product.badge && <span className="spec-pill">{product.badge}</span>}
                      {product.calories && <span className="spec-pill">🔥 {product.calories} kcal</span>}
                      {product.caffeine && product.caffeine !== '0mg' && (
                        <span className="spec-pill">⚡ {product.caffeine}</span>
                      )}
                    </div>
                    <div className="card-footer">
                      <span className="price">${product.price.toFixed(2)}</span>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="card-QuickAdd-btn"
                          onClick={() => handleQuickAdd(product)}
                          title="Quick add Regular to Cart"
                          aria-label={`Quick add ${product.name} to cart`}
                        >
                          +
                        </button>
                        <button
                          id={btnId}
                          type="button"
                          className="order-btn"
                          onClick={() => openOrderModal(product)}
                          aria-label={`Order ${product.name} for $${product.price.toFixed(2)}`}
                        >
                          Customize
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CUSTOMER LOVE / REVIEWS SECTION */}
      <section className="section" id="reviews" style={{ paddingTop: 20 }}>
        <div className="section-header">
          <h2>Loved by Coffee Lovers</h2>
          <p>Over 5,000+ handcrafted cups served with a 4.9★ community rating</p>
          <div style={{ marginTop: '1rem' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}
              onClick={() => setShowReviewForm((prev) => !prev)}
            >
              {showReviewForm ? '✕ Close Review Form' : '✍️ Share Your Experience (+25 Bean Points)'}
            </button>
          </div>
        </div>

        {showReviewForm && (
          <form
            onSubmit={handleAddReview}
            className="mood-matcher-box"
            style={{ maxWidth: 680, margin: '0 auto 2rem' }}
          >
            <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.85rem' }}>
              ✍️ Write a Community Review
            </h3>
            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder={isLoggedIn ? userName : 'e.g. Aarav Verma'}
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Your Vibe / Role</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="e.g. Espresso Enthusiast"
                  value={revRole}
                  onChange={(e) => setRevRole(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ width: 130 }}>
                <label className="form-label">Rating</label>
                <select
                  className="modal-input"
                  value={revRating}
                  onChange={(e) => setRevRating(e.target.value)}
                >
                  <option value="5.0">★★★★★ (5.0)</option>
                  <option value="4.9">★★★★★ (4.9)</option>
                  <option value="4.5">★★★★½ (4.5)</option>
                  <option value="4.0">★★★★☆ (4.0)</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Your Review</label>
              <input
                type="text"
                className="modal-input"
                placeholder="Tell us about your favorite coffee or pastry at Bean Scene..."
                value={revText}
                onChange={(e) => setRevText(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
              Post Review &amp; Claim +25 Pts
            </button>
          </form>
        )}

        <div className="testimonials-grid">
          {reviewsList.map((t, i) => (
            <div key={i} className="testimonial-card">
              <StarRating rating={t.rating} />
              <p style={{ color: 'var(--text)', fontSize: '0.96rem', lineHeight: 1.6 }}>"{t.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{(t.name || 'G')[0]}</div>
                <div>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '0.95rem' }}>{t.name}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUBSCRIBE SECTION */}
      <section id="subscribe">
        <div className="subscribe">
          <h2>Subscribe for Latest Offers</h2>
          <p>Get exclusive deals, secret menu drops, and 10% off your next cup</p>
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
        <p style={{ marginTop: '0.5rem' }}>
          Full-Stack Project by <a href="#home">Vijaya Saradhi</a> •{' '}
          <button
            type="button"
            onClick={openAdminHub}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'underline',
            }}
          >
            ⚡ Open Barista / Admin Hub
          </button>
        </p>
      </footer>

      {/* FLOATING SPIN & WIN LUCKY WHEEL BUTTON */}
      <button
        type="button"
        className="floating-spin-btn"
        onClick={() => setShowSpinModal(true)}
      >
        🎡 Spin &amp; Win 25% OFF
      </button>

      {/* SPIN THE WHEEL MODAL */}
      {showSpinModal && (
        <div className="modal-backdrop" onClick={() => setShowSpinModal(false)}>
          <div className="modal-card" style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-badge">Daily Barista Jackpot</span>
                <h3 className="modal-title">🎡 Spin the Bean Wheel</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setShowSpinModal(false)}>✕</button>
            </div>
            <p className="modal-desc">Spin to win instant 25% OFF promo codes or bonus Bean Points!</p>

            <div
              className="spin-wheel-circle"
              style={{ transform: `rotate(${wheelDeg}deg)` }}
            >
              <div className="spin-wheel-center">☕</div>
            </div>

            {spinPrize && (
              <p style={{ color: '#4ade80', fontWeight: 700, marginBottom: '1rem' }}>
                {spinPrize}
              </p>
            )}

            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={spinning}
              onClick={handleSpinWheel}
            >
              {spinning ? 'Spinning...' : '🎯 Spin Now!'}
            </button>
          </div>
        </div>
      )}

      {/* TABLE RESERVATION MODAL */}
      {showReserveModal && (
        <div className="modal-backdrop" onClick={() => setShowReserveModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-badge">VIP Café Lounge</span>
                <h3 className="modal-title">🪑 Reserve Your Cozy Spot</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setShowReserveModal(false)}>✕</button>
            </div>

            {confirmedReservation ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div className="confirm-icon">🪑✨</div>
                <h4 style={{ fontSize: '1.35rem', marginBottom: '0.4rem', color: '#fff' }}>
                  Table Pass #{confirmedReservation.passId} Confirmed!
                </h4>
                <div className="order-summary-box" style={{ marginTop: '1rem' }}>
                  <p><strong>Guest:</strong> {confirmedReservation.name}</p>
                  <p><strong>Seating Zone:</strong> {confirmedReservation.zone}</p>
                  <p><strong>Party Size:</strong> {confirmedReservation.guests}</p>
                  <p><strong>Arrival Time:</strong> Today at {confirmedReservation.time}</p>
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => setShowReserveModal(false)}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleReserveSubmit}>
                <p className="modal-desc">Select your favorite seating zone in our café:</p>
                <div className="zone-grid">
                  {CAFE_ZONES.map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      className={`zone-card-btn ${reserveZone === z.id ? 'active' : ''}`}
                      onClick={() => setReserveZone(z.id)}
                    >
                      <strong>{z.title}</strong>
                      <span>{z.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">Party Size</label>
                    <select
                      className="modal-input"
                      value={reserveGuests}
                      onChange={(e) => setReserveGuests(e.target.value)}
                    >
                      <option>1 Guest (Solo Pod)</option>
                      <option>2 Guests</option>
                      <option>4 Guests</option>
                      <option>6 Guests</option>
                    </select>
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">Time Slot</label>
                    <select
                      className="modal-input"
                      value={reserveTime}
                      onChange={(e) => setReserveTime(e.target.value)}
                    >
                      <option>09:00 AM</option>
                      <option>10:30 AM</option>
                      <option>01:00 PM</option>
                      <option>04:30 PM</option>
                      <option>07:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="e.g. Alex Doe"
                    value={reserveName}
                    onChange={(e) => setReserveName(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Confirm Table Reservation
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* INTERACTIVE ORDER MODAL — WITH IMAGE BANNER */}
      {showOrderModal && (
        <div className="modal-backdrop" onClick={() => setShowOrderModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {activeItem.image && (
              <div className="modal-img-banner">
                <img
                  src={activeItem.image}
                  alt={activeItem.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackImage(activeItem.category);
                  }}
                />
                <div className="modal-img-overlay" />
              </div>
            )}
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

      {/* ORDER CONFIRMATION MODAL WITH LIVE TRACKER */}
      {showOrderConfirmation && confirmedOrder && (
        <div className="modal-backdrop" onClick={() => setShowOrderConfirmation(false)}>
          <div className="modal-card modal-confirmation" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">☕✨</div>
            <h3>Order Placed Successfully!</h3>
            <p className="order-id">Order ID: <strong>#{confirmedOrder.id}</strong></p>

            {/* Live 4-Stage Preparation Tracker */}
            <div className="order-tracker-steps">
              <div className={`tracker-step ${prepStage >= 0 ? 'active' : ''}`}>
                <span>📝</span>
                <span>Received</span>
              </div>
              <div className={`tracker-step ${prepStage >= 1 ? 'active' : ''}`}>
                <span>🫘</span>
                <span>Grinding</span>
              </div>
              <div className={`tracker-step ${prepStage >= 2 ? 'active' : ''}`}>
                <span>🥛</span>
                <span>Pouring</span>
              </div>
              <div className={`tracker-step ${prepStage >= 3 ? 'active' : ''}`}>
                <span>🔔</span>
                <span>Ready!</span>
              </div>
            </div>

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
              {confirmedOrder.pointsEarned && (
                <p style={{ color: '#4ade80', fontSize: '0.82rem', marginTop: '0.4rem', fontWeight: 600 }}>
                  🏆 +{confirmedOrder.pointsEarned} Bean Points added to your wallet!
                </p>
              )}
            </div>

            <p className="prep-time">⏱️ Estimated ready time: <strong>5 - 8 minutes</strong></p>
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => handlePrintReceipt(confirmedOrder)}
              >
                🖨️ Print Receipt
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1.5, justifyContent: 'center' }}
                onClick={() => setShowOrderConfirmation(false)}
              >
                Done &amp; Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER WITH LOYALTY PROGRESS & PROMO CODES */}
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
              {/* Loyalty Progress Card */}
              <div className="loyalty-banner-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700 }}>
                  <span style={{ color: 'var(--warm)' }}>🏆 Bean Rewards: {beanPoints} / 200 pts</span>
                  <span style={{ color: 'var(--accent)' }}>
                    {beanPoints >= 200 ? '🎁 Free Drink Unlocked!' : `${200 - beanPoints} pts to free cup`}
                  </span>
                </div>
                <div className="loyalty-progress-track">
                  <div
                    className="loyalty-progress-fill"
                    style={{ width: `${Math.min(100, (beanPoints / 200) * 100)}%` }}
                  />
                </div>
                {beanPoints >= 200 && (
                  <button
                    type="button"
                    className={redeemPoints ? 'btn-primary' : 'btn-secondary'}
                    style={{ width: '100%', marginTop: '0.6rem', padding: '0.42rem 0.8rem', fontSize: '0.8rem', justifyContent: 'center' }}
                    onClick={() => setRedeemPoints((prev) => !prev)}
                  >
                    {redeemPoints ? '✓ Redeeming 200 Pts (−$5.00 OFF)' : '🎁 Redeem 200 Pts for $5.00 OFF'}
                  </button>
                )}
              </div>

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
              {/* Promo Code Input */}
              <div className="cart-promo-row">
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Promo code (BEAN20 / BEAN25)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                  onClick={() => applyPromoCode(promoInput)}
                >
                  Apply
                </button>
              </div>

              {appliedPromo && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#4ade80', marginBottom: '0.5rem' }}>
                  <span>Discount ({appliedPromo})</span>
                  <span>−${cartDiscount.toFixed(2)}</span>
                </div>
              )}

              {pointsDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#4ade80', marginBottom: '0.5rem' }}>
                  <span>Bean Rewards (200 pts)</span>
                  <span>−${pointsDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="cart-total-row">
                <span>Total</span>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, color: 'var(--warm)' }}>
                      <span>Total: ${(order.total || 0).toFixed(2)}</span>
                      <div style={{ display: 'flex', gap: '0.45rem' }}>
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: '0.32rem 0.75rem', fontSize: '0.76rem' }}
                          onClick={() => handleReorder(order)}
                        >
                          🔁 Reorder
                        </button>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '0.32rem 0.75rem', fontSize: '0.76rem' }}
                          onClick={() => handlePrintReceipt(order)}
                        >
                          🖨️ Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* BARISTA / ADMIN HUB MODAL (LIVE BACKEND CRUD & KITCHEN QUEUE) */}
      {showAdminModal && (
        <div className="modal-backdrop" onClick={() => setShowAdminModal(false)}>
          <div className="modal-card video-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-badge">Full-Stack Control Center</span>
                <h3 className="modal-title">⚡ Barista &amp; Admin Hub</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowAdminModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="pill-group" style={{ marginBottom: '1.2rem' }}>
              <button
                type="button"
                className={`mood-pill-btn ${adminTab === 'orders' ? 'active' : ''}`}
                onClick={() => setAdminTab('orders')}
              >
                ☕ Live Orders ({orderHistory.length})
              </button>
              <button
                type="button"
                className={`mood-pill-btn ${adminTab === 'menu' ? 'active' : ''}`}
                onClick={() => setAdminTab('menu')}
              >
                🥐 Menu Manager ({products.length})
              </button>
              <button
                type="button"
                className={`mood-pill-btn ${adminTab === 'reservations' ? 'active' : ''}`}
                onClick={() => setAdminTab('reservations')}
              >
                🪑 Table Passes ({reservationsList.length})
              </button>
            </div>

            {adminTab === 'orders' && (
              <div style={{ maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {orderHistory.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                    No active orders in the queue yet. Place an order to test live status updates!
                  </p>
                ) : (
                  orderHistory.map((ord, idx) => (
                    <div key={ord.id || idx} className="order-summary-box" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                        <strong style={{ color: '#fff' }}>Order #{ord.id} • {ord.customer || ord.user || 'Guest'}</strong>
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: '0.32rem 0.85rem', fontSize: '0.76rem' }}
                          onClick={() => handleAdvanceOrderStatus(ord.id, ord.status)}
                        >
                          Status: {ord.status || 'Received'} ↻
                        </button>
                      </div>
                      {(ord.items || []).map((it, i) => (
                        <p key={i} style={{ fontSize: '0.84rem' }}>{it.quantity || 1}× {it.name}</p>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--warm)', fontWeight: 700 }}>
                        <span>Total: ${Number(ord.total || 0).toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => handlePrintReceipt(ord)}
                          style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                        >
                          🖨️ Print Ticket
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {adminTab === 'menu' && (
              <div>
                <form onSubmit={handleCreateProduct} className="order-summary-box" style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: '#fff', marginBottom: '0.65rem', fontSize: '0.95rem' }}>+ Add New Specialty to Menu</h4>
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <input
                        type="text"
                        className="modal-input"
                        placeholder="Item Name (e.g. Pistachio Latte)"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ width: 110 }}>
                      <input
                        type="number"
                        step="0.10"
                        className="modal-input"
                        placeholder="Price ($)"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ width: 130 }}>
                      <select
                        className="modal-input"
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                      >
                        <option value="coffee">☕ Coffee</option>
                        <option value="iced">🧊 Iced</option>
                        <option value="bakery">🥐 Bakery</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <input
                        type="text"
                        className="modal-input"
                        placeholder="Short description..."
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ width: 160 }}>
                      <input
                        type="text"
                        className="modal-input"
                        placeholder="Badge (e.g. ✨ New)"
                        value={newProdBadge}
                        onChange={(e) => setNewProdBadge(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.86rem' }}>
                      + Add Item
                    </button>
                  </div>
                </form>

                <div style={{ maxHeight: '36vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {products.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.55rem 0.85rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{p.name}</strong>{' '}
                        <span style={{ color: 'var(--warm)', fontSize: '0.84rem', fontWeight: 700 }}>${p.price.toFixed(2)}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem', marginLeft: '0.5rem' }}>({p.category})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        style={{
                          background: 'rgba(248,113,113,0.14)',
                          border: '1px solid rgba(248,113,113,0.3)',
                          color: '#fca5a5',
                          borderRadius: 8,
                          padding: '0.28rem 0.65rem',
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminTab === 'reservations' && (
              <div style={{ maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reservationsList.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                    No table reservations booked yet. Use &quot;🪑 Book Table&quot; in the navbar to reserve a spot!
                  </p>
                ) : (
                  reservationsList.map((r, i) => (
                    <div key={r.passId || i} className="order-summary-box" style={{ marginBottom: 0 }}>
                      <strong style={{ color: 'var(--accent)' }}>Pass #{r.passId} — {r.name}</strong>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{r.zone} • {r.guests} • Today at {r.time}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROMO VIDEO MODAL */}
      {showVideoModal && (
        <div className="modal-backdrop" onClick={() => setShowVideoModal(false)}>
          <div className="modal-card video-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-badge">Official Promo</span>
                <h3 className="modal-title">Bean Scene — Premium Coffee &amp; Bakery</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowVideoModal(false)}
                aria-label="Close video modal"
              >
                ✕
              </button>
            </div>

            <div className="video-modal-frame">
              <video
                controls
                autoPlay
                loop
                playsInline
                poster="/hero-bg.jpg"
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-pouring-milk-into-a-cup-of-coffee-41547-large.mp4" type="video/mp4" />
                <source src="https://assets.mixkit.co/videos/preview/mixkit-coffee-beans-falling-in-slow-motion-4996-large.mp4" type="video/mp4" />
              </video>
            </div>

            {products[reelIdx % products.length] && (
              <div className="reel-slide-card">
                <img
                  src={products[reelIdx % products.length].image}
                  alt={products[reelIdx % products.length].name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackImage(products[reelIdx % products.length].category);
                  }}
                />
                <div className="reel-slide-info" style={{ flex: 1 }}>
                  <h4>Featured Now: {products[reelIdx % products.length].name}</h4>
                  <p>{products[reelIdx % products.length].description}</p>
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '0.6rem 1.3rem', fontSize: '0.9rem' }}
                  onClick={() => {
                    setShowVideoModal(false);
                    openOrderModal(products[reelIdx % products.length]);
                  }}
                >
                  Order ${products[reelIdx % products.length].price.toFixed(2)}
                </button>
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
