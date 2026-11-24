import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RAW_API_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_URL =
  RAW_API_URL && !RAW_API_URL.includes('localhost') && !RAW_API_URL.includes('127.0.0.1')
    ? RAW_API_URL
    : '';

const INITIAL_PRODUCTS = [
  // Hot Coffee
  { id: 1,  name: 'Cappuccino',                  description: 'Rich espresso with steamed milk foam',                          price: 4.5, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.9, reviews: 218, popular: true,  featured: true,  calories: 120, caffeine: '150mg', badge: '🌱 Oat Option'        },
  { id: 2,  name: 'Latte',                       description: 'Smooth espresso with steamed milk',                             price: 4.8, image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.8, reviews: 195, popular: false, featured: false, calories: 150, caffeine: '150mg', badge: '🥛 Creamy'            },
  { id: 3,  name: 'Americano',                   description: 'Espresso with hot water',                                       price: 3.5, image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.7, reviews: 143, popular: false, featured: false, calories: 15,  caffeine: '165mg', badge: '⚡ Zero Sugar'        },
  { id: 7,  name: 'Caramel Macchiato',           description: 'Vanilla steamed milk marked with espresso and caramel drizzle', price: 5.2, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.9, reviews: 264, popular: true,  featured: true,  calories: 210, caffeine: '150mg', badge: '🍯 Best Seller'       },
  { id: 8,  name: 'Caffè Mocha',                 description: 'Full-bodied espresso with bittersweet chocolate and milk',      price: 5.0, image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.8, reviews: 182, popular: true,  featured: true,  calories: 230, caffeine: '155mg', badge: '🍫 Belgian Choc'      },
  { id: 9,  name: 'Flat White',                  description: 'Velvety microfoam poured over a double ristretto shot',         price: 4.7, image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.7, reviews: 134, popular: false, featured: false, calories: 130, caffeine: '175mg', badge: '✨ Ristretto'         },
  { id: 10, name: 'Espresso Macchiato',          description: 'Bold double espresso topped with a dollop of milk foam',        price: 3.8, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.6, reviews: 97,  popular: false, featured: false, calories: 35,  caffeine: '180mg', badge: '🔥 Strong'            },
  { id: 19, name: 'Pistachio Velvet Latte',      description: 'Double espresso infused with roasted Sicilian pistachio cream', price: 5.4, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.9, reviews: 214, popular: true,  featured: true,  calories: 185, caffeine: '150mg', badge: '🥜 Roasted Pistachio' },
  { id: 20, name: 'Hazelnut Cortado',            description: 'Equal parts rich espresso and warm toasted hazelnut milk',      price: 4.6, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.8, reviews: 152, popular: false, featured: false, calories: 95,  caffeine: '160mg', badge: '🌰 Toasted Hazelnut'  },
  { id: 21, name: 'Spanish Condensed Latte',     description: 'Velvety espresso layered with silky sweetened condensed milk',  price: 5.1, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.9, reviews: 241, popular: true,  featured: true,  calories: 220, caffeine: '155mg', badge: '✨ Sweet & Bold'      },

  // Iced Beverages
  { id: 4,  name: 'Iced Coffee',                 description: 'Chilled coffee over ice',                                       price: 4.2, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.8, reviews: 176, popular: true,  featured: true,  calories: 80,  caffeine: '145mg', badge: '🧊 Chilled'           },
  { id: 11, name: 'Cold Brew',                   description: 'Slow-steeped for 20 hours for an ultra-smooth finish',          price: 4.6, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.9, reviews: 230, popular: true,  featured: true,  calories: 25,  caffeine: '200mg', badge: '⚡ 20h Steep'         },
  { id: 12, name: 'Iced Caramel Latte',          description: 'Chilled espresso, milk, and sweet caramel over ice',            price: 5.1, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.8, reviews: 189, popular: true,  featured: true,  calories: 190, caffeine: '150mg', badge: '🍯 Sweet'             },
  { id: 13, name: 'Iced Matcha Latte',           description: 'Ceremonial-grade green tea whisked with cold milk over ice',    price: 5.3, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.7, reviews: 154, popular: false, featured: false, calories: 140, caffeine: '85mg',  badge: '🍵 Uji Matcha'        },
  { id: 14, name: 'Espresso Frappe',             description: 'Blended iced coffee with rich espresso and whipped cream',      price: 5.5, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.8, reviews: 167, popular: false, featured: false, calories: 280, caffeine: '140mg', badge: '🍦 Blended'           },
  { id: 22, name: 'Brown Sugar Oat Shaken',      description: 'Blonde espresso shaken with brown sugar, cinnamon, and oat milk', price: 5.4, image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.9, reviews: 278, popular: true,  featured: true,  calories: 130, caffeine: '185mg', badge: '🌱 Oat & Cinnamon'    },
  { id: 23, name: 'Pistachio Cream Cold Brew',   description: '20-hour cold brew topped with silky pistachio sweet cold foam', price: 5.6, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.9, reviews: 221, popular: true,  featured: true,  calories: 175, caffeine: '195mg', badge: '🥜 Cold Foam'         },
  { id: 24, name: 'Strawberry Matcha Cloud',     description: 'Ceremonial Uji matcha layered over house strawberry purée',     price: 5.7, image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.9, reviews: 256, popular: true,  featured: true,  calories: 165, caffeine: '85mg',  badge: '🍓 Layered Matcha'    },
  { id: 25, name: 'Salted Caramel Nitro Brew',   description: 'Velvety nitrogen-infused cold brew with sea salt caramel foam', price: 5.3, image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.8, reviews: 164, popular: false, featured: false, calories: 110, caffeine: '210mg', badge: '⚡ Nitro Draft'       },
  { id: 26, name: 'Mango Passion Iced Espresso', description: 'Crisp sparkling tropical mango & passionfruit topped with espresso', price: 4.9, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', category: 'iced', rating: 4.7, reviews: 138, popular: false, featured: false, calories: 115, caffeine: '140mg', badge: '🥭 Tropical Fusion'   },

  // Bakery
  { id: 5,  name: 'Croissant',                   description: 'Buttery, flaky French pastry',                                  price: 3.9, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.6, reviews: 112, popular: false, featured: false, calories: 260, caffeine: '0mg',   badge: '🥐 French Butter'     },
  { id: 6,  name: 'Blueberry Muffin',            description: 'Freshly baked with real blueberries',                           price: 3.5, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.7, reviews: 98,  popular: true,  featured: true,  calories: 290, caffeine: '0mg',   badge: '🫐 Fresh Baked'       },
  { id: 15, name: 'Chocolate Croissant',         description: 'Flaky golden pastry filled with rich dark chocolate',           price: 4.3, image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.9, reviews: 205, popular: true,  featured: true,  calories: 310, caffeine: '15mg',  badge: '🍫 Warm Center'       },
  { id: 16, name: 'Cinnamon Roll',               description: 'Warm spiced swirl topped with cream cheese frosting',           price: 4.5, image: 'https://images.unsplash.com/photo-1583527976767-5399024eeb05?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.8, reviews: 174, popular: true,  featured: true,  calories: 340, caffeine: '0mg',   badge: '✨ House Glaze'       },
  { id: 17, name: 'Banana Walnut Bread',         description: 'Moist house-baked banana slice loaded with toasted walnuts',    price: 3.8, image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.7, reviews: 119, popular: false, featured: false, calories: 270, caffeine: '0mg',   badge: '🌰 Toasted Nuts'      },
  { id: 18, name: 'Avocado Toast',               description: 'Artisan sourdough with smashed avocado and chili flakes',       price: 6.5, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.8, reviews: 142, popular: false, featured: false, calories: 320, caffeine: '0mg',   badge: '🥑 Sourdough'         },
  { id: 27, name: 'Almond Frangipane Croissant', description: 'Double-baked croissant filled with sweet almond cream & flakes', price: 4.8, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.9, reviews: 193, popular: true,  featured: true,  calories: 330, caffeine: '0mg',   badge: '🥐 Double Baked'      },
  { id: 28, name: 'Tiramisu Espresso Cake',      description: 'Espresso-soaked sponge layered with whipped mascarpone & cocoa', price: 5.8, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.9, reviews: 234, popular: true,  featured: true,  calories: 360, caffeine: '35mg',  badge: '🍰 Mascarpone'        },
  { id: 29, name: 'Belgian Waffle & Berries',    description: 'Crisp pearl-sugar Liège waffle topped with warm berry compote', price: 5.5, image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.8, reviews: 162, popular: false, featured: false, calories: 310, caffeine: '0mg',   badge: '🍓 Warm Waffle'       },
  { id: 30, name: 'Smoked Salmon Cream Bagel',   description: 'Toasted sesame bagel with herb cream cheese, capers & salmon',  price: 6.9, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.9, reviews: 187, popular: true,  featured: true,  calories: 340, caffeine: '0mg',   badge: '🥯 Savory Artisan'    },
];

const mergeAdminCatalog = (savedList = [], catalog = INITIAL_PRODUCTS) => {
  if (!Array.isArray(savedList) || savedList.length === 0) return catalog;
  let deletedIds = [];
  try {
    deletedIds = JSON.parse(localStorage.getItem('beanSceneDeletedProductIds') || '[]');
  } catch {
    deletedIds = [];
  }
  const activeCatalog = catalog.filter((def) => !deletedIds.includes(def.id));
  const merged = activeCatalog.map((def) => {
    const existing = savedList.find((item) => item.id === def.id || item.name === def.name);
    const validImage =
      existing?.image && !existing.image.includes('photo-1592417817098-8f3d691a4bf5')
        ? existing.image
        : def.image;
    return existing
      ? { ...def, ...existing, image: validImage, category: existing.category || def.category }
      : def;
  });
  const customExtras = savedList.filter(
    (item) =>
      !deletedIds.includes(item.id) &&
      !catalog.some((def) => def.id === item.id || def.name === item.name)
  );
  return [...merged, ...customExtras];
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [searchFilter, setSearchFilter] = useState('');
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneProducts');
      if (saved) {
        const merged = mergeAdminCatalog(JSON.parse(saved));
        localStorage.setItem('beanSceneProducts', JSON.stringify(merged));
        return merged;
      }
      return INITIAL_PRODUCTS;
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
            saveProductsLocally(mergeAdminCatalog(prodRes.value.data));
          } else {
            try {
              saveProductsLocally(mergeAdminCatalog(JSON.parse(saved)));
            } catch {
              saveProductsLocally(INITIAL_PRODUCTS);
            }
          }
        }
        if (ordRes.status === 'fulfilled' && Array.isArray(ordRes.value.data) && ordRes.value.data.length > 0) {
          setOrders((prev) => {
            const remote = ordRes.value.data;
            const localOnly = prev.filter((loc) => !remote.some((rem) => String(rem.id) === String(loc.id)));
            const mergedOrders = [...localOnly, ...remote];
            localStorage.setItem('beanSceneOrders', JSON.stringify(mergedOrders));
            return mergedOrders;
          });
        }
        if (resvRes.status === 'fulfilled' && Array.isArray(resvRes.value.data) && resvRes.value.data.length > 0) {
          setReservations((prev) => {
            const remote = resvRes.value.data;
            const localOnly = prev.filter((loc) => !remote.some((rem) => String(rem.passId) === String(loc.passId)));
            const mergedResv = [...localOnly, ...remote];
            localStorage.setItem('beanSceneReservations', JSON.stringify(mergedResv));
            return mergedResv;
          });
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
      try {
        const prevDeleted = JSON.parse(localStorage.getItem('beanSceneDeletedProductIds') || '[]');
        if (!prevDeleted.includes(id)) {
          localStorage.setItem('beanSceneDeletedProductIds', JSON.stringify([...prevDeleted, id]));
        }
      } catch {
        // Ignore storage error
      }
      const nextList = products.filter((p) => p.id !== id);
      saveProductsLocally(nextList);
      await axios.delete(`${API_BASE_URL}/api/products/${id}`).catch(() => {});
      setMessage('🗑️ Product deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleResetMenu = () => {
    localStorage.removeItem('beanSceneDeletedProductIds');
    saveProductsLocally(INITIAL_PRODUCTS);
    setMessage(`🔄 Menu restored to all ${INITIAL_PRODUCTS.length} default Bean Scene items!`);
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

  const handleSimulateOrder = () => {
    const demoCode = Math.floor(1000 + Math.random() * 9000);
    const sampleOrder = {
      id: `BSC-${demoCode}`,
      items: [
        { name: 'Pistachio Velvet Latte (Large, oat milk)', quantity: 1, price: 6.2 },
        { name: 'Almond Frangipane Croissant (Warm)', quantity: 1, price: 4.8 },
      ],
      total: 11.0,
      pointsEarned: 110,
      customer: 'Vijaya Saradhi',
      fulfillment: '🪑 Dine-In Table',
      paymentMethod: '📱 UPI / QR Pay',
      transactionId: `UPI-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentStatus: 'Paid ✓',
      placedAt: new Date().toISOString(),
      status: 'Received',
    };
    const next = [sampleOrder, ...orders];
    setOrders(next);
    localStorage.setItem('beanSceneOrders', JSON.stringify(next));
    axios.post(`${API_BASE_URL}/api/orders`, sampleOrder).catch(() => {});
    setMessage(`⚡ Generated Live Demo Order #${sampleOrder.id} in Kitchen Queue!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleExportCsv = () => {
    const rows = [
      ['Category', 'Name', 'Email', 'Role / Action', 'Status / Location'],
      ...users.map((u) => ['Registered User', u.name, u.email, u.role || 'customer', u.lastActive || 'Active']),
      ...subscribers.map((s) => ['Newsletter Subscriber', s.split('@')[0], s, 'FIRST10 Promo', 'Subscribed']),
      ...visitors.map((v) => ['Visitor Session', v.name, v.email, v.action, `${v.device || ''} (${v.location || 'Live'})`]),
    ];
    const csvContent = rows
      .map((r) => r.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bean-scene-admin-analytics.csv';
    a.click();
    URL.revokeObjectURL(url);
    setMessage('📥 Exported Full Users, Subscribers & Traffic CSV Report!');
    setTimeout(() => setMessage(''), 3000);
  };

  const totalRevenue = orders.reduce((acc, o) => acc + Number(o.total || 0), 0);
  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Category Breakdown Analytics
  const coffeeCount = products.filter((p) => (p.category || 'coffee') === 'coffee').length;
  const icedCount = products.filter((p) => p.category === 'iced').length;
  const bakeryCount = products.filter((p) => p.category === 'bakery').length;
  const totalMenuCount = Math.max(1, products.length);
  const coffeePct = Math.round((coffeeCount / totalMenuCount) * 100);
  const icedPct = Math.round((icedCount / totalMenuCount) * 100);
  const bakeryPct = Math.max(0, 100 - coffeePct - icedPct);

  // Payment Gateway & Fulfillment Breakdown Analytics
  const upiOrders = orders.filter((o) => (o.paymentMethod || 'UPI').includes('UPI')).length;
  const cardOrders = orders.filter((o) => (o.paymentMethod || '').includes('Card')).length;
  const counterOrders = orders.filter((o) => (o.paymentMethod || '').includes('Counter')).length;
  const totalOrdersCount = orders.length;
  const upiPct = totalOrdersCount > 0 ? Math.round((upiOrders / totalOrdersCount) * 100) : 64;
  const cardPct = totalOrdersCount > 0 ? Math.round((cardOrders / totalOrdersCount) * 100) : 26;
  const counterPct = totalOrdersCount > 0 ? Math.max(0, 100 - upiPct - cardPct) : 10;

  return (
    <div className="admin-page-shell">
      <div className="admin-page-container">
        {/* Luxury Roastery Executive Hero Banner */}
        <div className="admin-exec-hero">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span className="modal-badge" style={{ marginBottom: 0 }}>⚡ Bean Scene Operations &amp; Analytics</span>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#4ade80',
                  background: 'rgba(74, 222, 128, 0.14)',
                  border: '1px solid rgba(74, 222, 128, 0.35)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 999,
                }}
              >
                ● Cloud DB &amp; Analytics Live
              </span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', margin: '0.15rem 0 0.35rem', letterSpacing: '-0.5px' }}>
              Full-Stack Admin Command Center
            </h1>
            <p style={{ color: '#d8cfe8', margin: 0, fontSize: '0.95rem' }}>
              Manage live menu products, kitchen order queue, table reservations, and real-time production users
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportCsv}
              className="btn-secondary"
              style={{ padding: '0.7rem 1.2rem', fontSize: '0.86rem' }}
            >
              📥 Export CSV Report
            </button>
            <button
              type="button"
              onClick={handleResetMenu}
              className="btn-secondary"
              style={{ padding: '0.7rem 1.2rem', fontSize: '0.86rem' }}
            >
              🔄 Reset Default Menu
            </button>
            <Link
              to="/"
              className="btn-primary"
              style={{ textDecoration: 'none', padding: '0.75rem 1.45rem', fontSize: '0.92rem' }}
            >
              ← Back to Live Website
            </Link>
          </div>
        </div>

        {/* 5 Glowing Glass Executive KPI Cards */}
        <div className="admin-kpi-grid">
          <div
            className="admin-kpi-card"
            style={{
              borderTop: '4px solid #4ade80',
              borderColor: 'rgba(74, 222, 128, 0.35)',
              boxShadow: '0 18px 42px rgba(0, 0, 0, 0.55), 0 0 28px rgba(74, 222, 128, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
              backgroundImage:
                "linear-gradient(155deg, rgba(22, 34, 34, 0.88) 0%, rgba(16, 14, 28, 0.92) 100%), radial-gradient(circle at 85% 15%, rgba(74, 222, 128, 0.22), transparent 60%), url('https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="admin-kpi-top">
              <span className="admin-kpi-title" style={{ color: '#bbf7d0' }}>Total Live Revenue</span>
              <span className="admin-kpi-icon" style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.18)', borderColor: 'rgba(74, 222, 128, 0.45)', boxShadow: '0 0 16px rgba(74, 222, 128, 0.3)' }}>💰</span>
            </div>
            <div className="admin-kpi-value" style={{ color: '#4ade80', textShadow: '0 0 24px rgba(74, 222, 128, 0.45)' }}>${totalRevenue.toFixed(2)}</div>
            <div className="admin-kpi-sub" style={{ color: '#e2e8f0' }}>
              <span style={{ color: '#4ade80' }}>●</span> UPI QR &amp; Card Gateway Active
            </div>
          </div>

          <div
            className="admin-kpi-card"
            style={{
              borderTop: '4px solid #f5d0a9',
              borderColor: 'rgba(245, 208, 169, 0.38)',
              boxShadow: '0 18px 42px rgba(0, 0, 0, 0.55), 0 0 28px rgba(245, 208, 169, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
              backgroundImage:
                "linear-gradient(155deg, rgba(36, 26, 34, 0.88) 0%, rgba(16, 14, 28, 0.92) 100%), radial-gradient(circle at 85% 15%, rgba(245, 208, 169, 0.24), transparent 60%), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="admin-kpi-top">
              <span className="admin-kpi-title" style={{ color: '#fde68a' }}>Total Orders</span>
              <span className="admin-kpi-icon" style={{ color: '#f5d0a9', background: 'rgba(245, 208, 169, 0.18)', borderColor: 'rgba(245, 208, 169, 0.45)', boxShadow: '0 0 16px rgba(245, 208, 169, 0.3)' }}>☕</span>
            </div>
            <div className="admin-kpi-value" style={{ color: '#f5d0a9', textShadow: '0 0 24px rgba(245, 208, 169, 0.45)' }}>{orders.length}</div>
            <div className="admin-kpi-sub" style={{ color: '#e2e8f0' }}>
              <span style={{ color: 'var(--warm)' }}>●</span> 4-Stage Kitchen Prep Queue
            </div>
          </div>

          <div
            className="admin-kpi-card"
            style={{
              borderTop: '4px solid #c084fc',
              borderColor: 'rgba(192, 132, 252, 0.4)',
              boxShadow: '0 18px 42px rgba(0, 0, 0, 0.55), 0 0 28px rgba(192, 132, 252, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
              backgroundImage:
                "linear-gradient(155deg, rgba(32, 20, 48, 0.88) 0%, rgba(16, 14, 28, 0.92) 100%), radial-gradient(circle at 85% 15%, rgba(192, 132, 252, 0.25), transparent 60%), url('https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="admin-kpi-top">
              <span className="admin-kpi-title" style={{ color: '#e9d5ff' }}>Active Menu Items</span>
              <span className="admin-kpi-icon" style={{ color: '#c084fc', background: 'rgba(192, 132, 252, 0.18)', borderColor: 'rgba(192, 132, 252, 0.45)', boxShadow: '0 0 16px rgba(192, 132, 252, 0.3)' }}>🥐</span>
            </div>
            <div className="admin-kpi-value" style={{ color: '#fff', textShadow: '0 0 24px rgba(192, 132, 252, 0.5)' }}>{products.length}</div>
            <div className="admin-kpi-sub" style={{ color: '#e2e8f0' }}>
              <span style={{ color: '#c084fc' }}>●</span> Coffee, Iced &amp; Artisan Bakery
            </div>
          </div>

          <div
            className="admin-kpi-card"
            style={{
              borderTop: '4px solid #f472b6',
              borderColor: 'rgba(244, 114, 182, 0.38)',
              boxShadow: '0 18px 42px rgba(0, 0, 0, 0.55), 0 0 28px rgba(244, 114, 182, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
              backgroundImage:
                "linear-gradient(155deg, rgba(38, 18, 38, 0.88) 0%, rgba(16, 14, 28, 0.92) 100%), radial-gradient(circle at 85% 15%, rgba(244, 114, 182, 0.24), transparent 60%), url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="admin-kpi-top">
              <span className="admin-kpi-title" style={{ color: '#fbcfe8' }}>Table Reservations</span>
              <span className="admin-kpi-icon" style={{ color: '#f472b6', background: 'rgba(244, 114, 182, 0.18)', borderColor: 'rgba(244, 114, 182, 0.45)', boxShadow: '0 0 16px rgba(244, 114, 182, 0.3)' }}>🪑</span>
            </div>
            <div className="admin-kpi-value" style={{ color: '#f472b6', textShadow: '0 0 24px rgba(244, 114, 182, 0.45)' }}>{reservations.length}</div>
            <div className="admin-kpi-sub" style={{ color: '#e2e8f0' }}>
              <span style={{ color: '#f472b6' }}>●</span> 4 VIP Café Seating Zones
            </div>
          </div>

          <div
            className="admin-kpi-card"
            style={{
              borderTop: '4px solid #38bdf8',
              borderColor: 'rgba(56, 189, 248, 0.38)',
              boxShadow: '0 18px 42px rgba(0, 0, 0, 0.55), 0 0 28px rgba(56, 189, 248, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
              backgroundImage:
                "linear-gradient(155deg, rgba(18, 28, 44, 0.88) 0%, rgba(16, 14, 28, 0.92) 100%), radial-gradient(circle at 85% 15%, rgba(56, 189, 248, 0.24), transparent 60%), url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="admin-kpi-top">
              <span className="admin-kpi-title" style={{ color: '#bae6fd' }}>Users &amp; Subscribers</span>
              <span className="admin-kpi-icon" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.18)', borderColor: 'rgba(56, 189, 248, 0.45)', boxShadow: '0 0 16px rgba(56, 189, 248, 0.3)' }}>👥</span>
            </div>
            <div className="admin-kpi-value" style={{ color: '#38bdf8', textShadow: '0 0 24px rgba(56, 189, 248, 0.45)' }}>
              {users.length + subscribers.length}
            </div>
            <div className="admin-kpi-sub" style={{ color: '#e2e8f0' }}>
              <span style={{ color: '#38bdf8' }}>●</span> {visitors.length} Active Visitor Sessions
            </div>
          </div>
        </div>

        {/* Visual Revenue, Category Share & Payment Gateway Analytics Charts */}
        <div className="admin-charts-grid">
          {/* Left Chart Card: Menu & Category Distribution */}
          <div
            className="admin-glass-panel admin-chart-card"
            style={{
              padding: '1.5rem 1.75rem',
              borderTop: '4px solid #f5d0a9',
              borderColor: 'rgba(245, 208, 169, 0.38)',
              boxShadow: '0 22px 50px rgba(0, 0, 0, 0.55), 0 0 32px rgba(245, 208, 169, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
              backgroundImage:
                "linear-gradient(155deg, rgba(28, 20, 44, 0.88) 0%, rgba(16, 13, 28, 0.92) 100%), radial-gradient(circle at 85% 15%, rgba(245, 208, 169, 0.22), transparent 60%), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
              <div>
                <h3 className="admin-chart-title">📊 Category &amp; Menu Share</h3>
                <span className="admin-chart-sub">
                  Distribution across <strong style={{ color: '#f5d0a9' }}>{products.length} active artisan specials</strong>
                </span>
              </div>
              <span
                className="spec-pill"
                style={{
                  background: 'rgba(245, 208, 169, 0.16)',
                  borderColor: 'rgba(245, 208, 169, 0.48)',
                  color: '#fde68a',
                  fontWeight: 700,
                  boxShadow: '0 0 16px rgba(245, 208, 169, 0.22)',
                }}
              >
                ✨ {products.length}-Item Catalog
              </span>
            </div>

            <div className="admin-chart-bars">
              <div className="admin-chart-row">
                <div className="admin-chart-label-row">
                  <span className="admin-chart-row-title">☕ Hot Espresso &amp; Lattes ({coffeeCount} items)</span>
                  <strong className="admin-chart-pct" style={{ color: '#fde68a', textShadow: '0 0 14px rgba(245, 208, 169, 0.45)' }}>{coffeePct}%</strong>
                </div>
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill"
                    style={{
                      width: `${coffeePct}%`,
                      background: 'linear-gradient(90deg, #fde68a, #f59e0b)',
                      boxShadow: '0 0 14px rgba(245, 158, 11, 0.55)',
                    }}
                  />
                </div>
              </div>

              <div className="admin-chart-row">
                <div className="admin-chart-label-row">
                  <span className="admin-chart-row-title">🧊 Iced &amp; Cold Brews ({icedCount} items)</span>
                  <strong className="admin-chart-pct" style={{ color: '#7dd3fc', textShadow: '0 0 14px rgba(56, 189, 248, 0.45)' }}>{icedPct}%</strong>
                </div>
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill"
                    style={{
                      width: `${icedPct}%`,
                      background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                      boxShadow: '0 0 14px rgba(56, 189, 248, 0.55)',
                    }}
                  />
                </div>
              </div>

              <div className="admin-chart-row">
                <div className="admin-chart-label-row">
                  <span className="admin-chart-row-title">🥐 Artisan French Bakery ({bakeryCount} items)</span>
                  <strong className="admin-chart-pct" style={{ color: '#e9d5ff', textShadow: '0 0 14px rgba(192, 132, 252, 0.5)' }}>{bakeryPct}%</strong>
                </div>
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill"
                    style={{
                      width: `${bakeryPct}%`,
                      background: 'linear-gradient(90deg, #c084fc, #f472b6)',
                      boxShadow: '0 0 14px rgba(244, 114, 182, 0.55)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Chart Card: Payment Gateway & Revenue Split */}
          <div
            className="admin-glass-panel admin-chart-card"
            style={{
              padding: '1.5rem 1.75rem',
              borderTop: '4px solid #4ade80',
              borderColor: 'rgba(74, 222, 128, 0.38)',
              boxShadow: '0 22px 50px rgba(0, 0, 0, 0.55), 0 0 32px rgba(74, 222, 128, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
              backgroundImage:
                "linear-gradient(155deg, rgba(20, 32, 38, 0.88) 0%, rgba(16, 13, 28, 0.92) 100%), radial-gradient(circle at 85% 15%, rgba(74, 222, 128, 0.22), transparent 60%), url('https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1000&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
              <div>
                <h3 className="admin-chart-title">💳 Payment Gateway Split</h3>
                <span className="admin-chart-sub">
                  {totalOrdersCount > 0 ? (
                    <>
                      Live split across <strong style={{ color: '#4ade80' }}>{totalOrdersCount} order(s)</strong>
                    </>
                  ) : (
                    'Projected checkout channel share'
                  )}
                </span>
              </div>
              <span
                className="spec-pill"
                style={{
                  background: 'rgba(74, 222, 128, 0.16)',
                  borderColor: 'rgba(74, 222, 128, 0.48)',
                  color: '#4ade80',
                  fontWeight: 700,
                  boxShadow: '0 0 16px rgba(74, 222, 128, 0.25)',
                }}
              >
                🔒 SSL Active
              </span>
            </div>

            <div className="admin-chart-bars">
              <div className="admin-chart-row">
                <div className="admin-chart-label-row">
                  <span className="admin-chart-row-title">📱 UPI / QR Instant Pay ({upiOrders} orders)</span>
                  <strong className="admin-chart-pct" style={{ color: '#4ade80', textShadow: '0 0 14px rgba(74, 222, 128, 0.5)' }}>{upiPct}%</strong>
                </div>
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill"
                    style={{
                      width: `${upiPct}%`,
                      background: 'linear-gradient(90deg, #4ade80, #10b981)',
                      boxShadow: '0 0 14px rgba(74, 222, 128, 0.6)',
                    }}
                  />
                </div>
              </div>

              <div className="admin-chart-row">
                <div className="admin-chart-label-row">
                  <span className="admin-chart-row-title">💳 3D Platinum Card ({cardOrders} orders)</span>
                  <strong className="admin-chart-pct" style={{ color: '#e9d5ff', textShadow: '0 0 14px rgba(192, 132, 252, 0.45)' }}>{cardPct}%</strong>
                </div>
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill"
                    style={{
                      width: `${cardPct}%`,
                      background: 'linear-gradient(90deg, #c084fc, #a855f7)',
                      boxShadow: '0 0 14px rgba(192, 132, 252, 0.55)',
                    }}
                  />
                </div>
              </div>

              <div className="admin-chart-row">
                <div className="admin-chart-label-row">
                  <span className="admin-chart-row-title">💵 Pay at Counter ({counterOrders} orders)</span>
                  <strong className="admin-chart-pct" style={{ color: '#fde68a', textShadow: '0 0 14px rgba(245, 208, 169, 0.45)' }}>{counterPct}%</strong>
                </div>
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill"
                    style={{
                      width: `${counterPct}%`,
                      background: 'linear-gradient(90deg, #fde68a, #fb923c)',
                      boxShadow: '0 0 14px rgba(251, 146, 60, 0.55)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Frosted Glass Navigation Dock */}
        <div className="admin-hub-tabs-dock" style={{ marginBottom: '1.75rem', padding: '0.55rem' }}>
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
              className="admin-glass-panel admin-product-form-card"
              style={{
                marginBottom: '2rem',
                borderTop: '4px solid #c084fc',
                borderColor: 'rgba(192, 132, 252, 0.42)',
                boxShadow:
                  '0 24px 55px rgba(0, 0, 0, 0.58), 0 0 36px rgba(192, 132, 252, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                backgroundImage:
                  "linear-gradient(155deg, rgba(28, 20, 48, 0.88) 0%, rgba(16, 13, 28, 0.92) 100%), radial-gradient(circle at 85% 15%, rgba(192, 132, 252, 0.24), transparent 60%), url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=85')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <span className="modal-badge" style={{ marginBottom: '0.35rem' }}>
                    {isEditing ? '✨ Editing Catalog Item' : '✨ Roastery Menu Studio'}
                  </span>
                  <h2 className="admin-form-highlight-title" style={{ margin: 0 }}>
                    {isEditing ? '✏️ Edit Product' : '➕ Add New Specialty Product'}
                  </h2>
                </div>
                <span
                  className="spec-pill"
                  style={{
                    background: 'rgba(192, 132, 252, 0.16)',
                    borderColor: 'rgba(192, 132, 252, 0.48)',
                    color: '#e9d5ff',
                    fontWeight: 700,
                    boxShadow: '0 0 16px rgba(192, 132, 252, 0.24)',
                  }}
                >
                  ⚡ Instant Cloud &amp; Menu Sync
                </span>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.15rem',
                }}
              >
                <div>
                  <label className="form-label admin-highlight-label">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Hazelnut Cortado"
                    className="modal-input admin-highlight-input"
                  />
                </div>

                <div>
                  <label className="form-label admin-highlight-label">Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    placeholder="4.90"
                    className="modal-input admin-highlight-input"
                  />
                </div>

                <div>
                  <label className="form-label admin-highlight-label">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="modal-input admin-highlight-input">
                    <option value="coffee">☕ Hot Coffee</option>
                    <option value="iced">🧊 Iced Beverage</option>
                    <option value="bakery">🥐 Bakery</option>
                  </select>
                </div>

                <div>
                  <label className="form-label admin-highlight-label">Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="modal-input admin-highlight-input"
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label admin-highlight-label">Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows="2"
                    placeholder="Describe flavor notes and ingredients..."
                    className="modal-input admin-highlight-input"
                  />
                </div>

                <div className="admin-featured-toggle-row" style={{ gridColumn: '1 / -1' }}>
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    style={{ width: 18, height: 18, accentColor: '#c084fc', cursor: 'pointer' }}
                  />
                  <label htmlFor="featuredCheck" style={{ fontWeight: 700, color: '#fde68a', cursor: 'pointer' }}>
                    ⭐ Mark as Popular / Featured on Menu
                  </label>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.85rem', marginTop: '0.35rem' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      padding: '0.8rem 1.95rem',
                      fontSize: '0.96rem',
                      boxShadow: '0 10px 28px rgba(192, 132, 252, 0.45)',
                    }}
                  >
                    {isEditing ? '✨ Update Product' : '➕ Add Product'}
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
              className="admin-glass-panel admin-catalog-table-card"
              style={{
                padding: 0,
                overflow: 'hidden',
                borderTop: '4px solid #f5d0a9',
                borderColor: 'rgba(245, 208, 169, 0.38)',
                boxShadow:
                  '0 24px 55px rgba(0, 0, 0, 0.58), 0 0 36px rgba(245, 208, 169, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
                backgroundImage:
                  "linear-gradient(160deg, rgba(24, 18, 40, 0.91) 0%, rgba(15, 12, 26, 0.94) 100%), radial-gradient(circle at 88% 8%, rgba(245, 208, 169, 0.18), transparent 55%), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div
                style={{
                  padding: '1.5rem 2rem',
                  borderBottom: '1px solid rgba(245, 208, 169, 0.22)',
                  background: 'linear-gradient(135deg, rgba(34, 24, 54, 0.72), rgba(20, 15, 34, 0.78))',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <span className="modal-badge" style={{ marginBottom: '0.3rem' }}>☕ Live Menu Inventory</span>
                  <h2 className="admin-form-highlight-title" style={{ margin: 0 }}>
                    All Menu Products ({filteredProducts.length})
                  </h2>
                </div>
                <input
                  type="text"
                  className="modal-input admin-highlight-input"
                  placeholder="🔍 Filter by name or category..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{ maxWidth: 295 }}
                />
              </div>

              {loading ? (
                <p style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-products-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr className="admin-table-head-row">
                        <th style={{ padding: '1rem 1.5rem' }}>Image</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Name &amp; Flavor Notes</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Category</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Price</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Featured</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => {
                        const cat = (p.category || 'coffee').toLowerCase();
                        const catStyle =
                          cat === 'iced'
                            ? {
                                bg: 'rgba(56, 189, 248, 0.16)',
                                border: 'rgba(56, 189, 248, 0.45)',
                                color: '#7dd3fc',
                                label: '🧊 Iced',
                              }
                            : cat === 'bakery'
                            ? {
                                bg: 'rgba(192, 132, 252, 0.16)',
                                border: 'rgba(192, 132, 252, 0.45)',
                                color: '#e9d5ff',
                                label: '🥐 Bakery',
                              }
                            : {
                                bg: 'rgba(245, 208, 169, 0.16)',
                                border: 'rgba(245, 208, 169, 0.45)',
                                color: '#fde68a',
                                label: '☕ Coffee',
                              };
                        return (
                          <tr key={p.id} className="admin-table-body-row">
                            <td style={{ padding: '0.95rem 1.5rem' }}>
                              <img
                                src={p.imageUrl || p.image}
                                alt={p.name}
                                className="admin-product-thumb"
                              />
                            </td>
                            <td style={{ padding: '0.95rem 1.5rem' }}>
                              <div className="admin-product-row-name">{p.name}</div>
                              <div className="admin-product-row-desc">{p.description}</div>
                            </td>
                            <td style={{ padding: '0.95rem 1.5rem' }}>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  background: catStyle.bg,
                                  border: `1px solid ${catStyle.border}`,
                                  color: catStyle.color,
                                  padding: '0.28rem 0.78rem',
                                  borderRadius: 999,
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                }}
                              >
                                {catStyle.label}
                              </span>
                            </td>
                            <td style={{ padding: '0.95rem 1.5rem' }}>
                              <span className="admin-product-price-pill">
                                ${Number(p.price).toFixed(2)}
                              </span>
                            </td>
                            <td style={{ padding: '0.95rem 1.5rem' }}>
                              {p.featured || p.popular ? (
                                <span
                                  style={{
                                    background: 'rgba(74, 222, 128, 0.18)',
                                    border: '1px solid rgba(74, 222, 128, 0.48)',
                                    color: '#4ade80',
                                    padding: '0.28rem 0.82rem',
                                    borderRadius: 999,
                                    fontSize: '0.76rem',
                                    fontWeight: 800,
                                    boxShadow: '0 0 14px rgba(74, 222, 128, 0.25)',
                                  }}
                                >
                                  ★ Yes
                                </span>
                              ) : (
                                <span
                                  style={{
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.18)',
                                    color: '#cbd5e1',
                                    padding: '0.28rem 0.82rem',
                                    borderRadius: 999,
                                    fontSize: '0.76rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  No
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '0.95rem 1.5rem' }}>
                              <div style={{ display: 'flex', gap: '0.55rem' }}>
                                <button
                                  type="button"
                                  onClick={() => handleEdit(p)}
                                  className="order-btn"
                                  style={{
                                    padding: '0.38rem 0.95rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.24), rgba(245, 208, 169, 0.18))',
                                    borderColor: 'rgba(192, 132, 252, 0.55)',
                                    color: '#f8f5ff',
                                  }}
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(p.id)}
                                  style={{
                                    background: 'rgba(248, 113, 113, 0.2)',
                                    border: '1px solid rgba(248, 113, 113, 0.5)',
                                    color: '#fecaca',
                                    padding: '0.38rem 0.95rem',
                                    borderRadius: 999,
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {orders.length === 0 ? (
              <div className="admin-empty-stage">
                <div className="admin-empty-orb">☕</div>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.4rem' }}>
                  Kitchen Order Queue is Ready
                </h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 1.25rem', fontSize: '0.92rem' }}>
                  No active orders in the queue right now. Simulate a live customer order below or head to the main menu to place an order through the UPI QR &amp; Card Gateway!
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem' }}
                    onClick={handleSimulateOrder}
                  >
                    ⚡ Simulate Live Demo Order
                  </button>
                  <Link
                    to="/"
                    className="btn-secondary"
                    style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem', textDecoration: 'none' }}
                  >
                    ☕ Go to Live Menu →
                  </Link>
                </div>
              </div>
            ) : (
              orders.map((ord, idx) => (
                <div key={ord.id || idx} className="admin-glass-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '1.1rem' }}>
                        Order #{ord.id} • {ord.customer || ord.user || 'Guest'}
                      </strong>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {ord.fulfillment || '🏪 In-Café Pickup'} • {ord.paymentMethod || '📱 UPI / QR Pay'}
                        {ord.transactionId ? ` • Ref #${ord.transactionId}` : ''}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ padding: '0.45rem 1.15rem', fontSize: '0.84rem' }}
                      onClick={() => handleCycleOrderStatus(ord.id, ord.status)}
                    >
                      Status: {ord.status || 'Received'} ↻
                    </button>
                  </div>
                  <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    {(ord.items || []).map((it, i) => (
                      <p key={i} style={{ fontSize: '0.9rem', margin: '0.25rem 0', color: '#e2e8f0' }}>
                        {it.quantity || 1}× {it.name}
                      </p>
                    ))}
                  </div>
                  <div style={{ marginTop: '0.65rem', fontWeight: 800, fontSize: '1.05rem', color: '#4ade80' }}>
                    Total Paid: ${Number(ord.total || 0).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reservations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {reservations.length === 0 ? (
              <div className="admin-empty-stage">
                <div className="admin-empty-orb">🪑</div>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.4rem' }}>
                  VIP Café Seating Lounge is Open
                </h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto 1.25rem', fontSize: '0.92rem' }}>
                  No table passes booked yet. Customers can reserve our Sunlit Window Booth, Lush Garden Patio, Quiet Work Pod, or Roastery Lounge from the main navbar.
                </p>
                <Link
                  to="/"
                  className="btn-primary"
                  style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem', textDecoration: 'none' }}
                >
                  🪑 Book Table on Live Site →
                </Link>
              </div>
            ) : (
              reservations.map((r, idx) => (
                <div key={r.passId || idx} className="admin-glass-panel">
                  <strong style={{ color: 'var(--accent)', fontSize: '1.08rem' }}>
                    Table Pass #{r.passId} — {r.name}
                  </strong>
                  <p style={{ fontSize: '0.92rem', marginTop: '0.35rem', color: '#e2e8f0' }}>
                    {r.zone} • {r.guests} • Reserved for {r.time}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-users-two-col">
            {/* Left Column: Registered Accounts + Newsletter Subscribers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
              <div className="admin-glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.12rem', margin: 0 }}>
                    👤 Registered &amp; Signed-In Users ({users.length})
                  </h3>
                  <span className="spec-pill">🔒 Auth Active</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {users.map((u, idx) => (
                    <div key={u.email || idx} className="admin-user-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div className="admin-avatar-orb">
                          {(u.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ color: '#fff', display: 'block', fontSize: '0.95rem' }}>{u.name}</strong>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{u.email}</span>
                        </div>
                      </div>
                      <span
                        style={{
                          color: u.role === 'admin' ? '#f5d0a9' : '#4ade80',
                          background: u.role === 'admin' ? 'rgba(245, 208, 169, 0.14)' : 'rgba(74, 222, 128, 0.14)',
                          border: `1px solid ${u.role === 'admin' ? 'rgba(245, 208, 169, 0.35)' : 'rgba(74, 222, 128, 0.35)'}`,
                          padding: '0.25rem 0.7rem',
                          borderRadius: 999,
                          fontWeight: 700,
                          fontSize: '0.76rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {u.role === 'admin' ? '⚡ Admin' : '🟢 Active Customer'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.12rem', margin: 0 }}>
                    📩 Newsletter Subscribers ({subscribers.length})
                  </h3>
                  <span className="spec-pill">🎟️ FIRST10 Promo</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {subscribers.map((sub, idx) => (
                    <span
                      key={sub || idx}
                      style={{
                        background: 'linear-gradient(135deg, rgba(192,132,252,0.18), rgba(236,72,153,0.12))',
                        border: '1px solid rgba(192,132,252,0.4)',
                        color: '#f3e8ff',
                        padding: '0.42rem 0.9rem',
                        borderRadius: 999,
                        fontSize: '0.84rem',
                        fontWeight: 600,
                      }}
                    >
                      ✉️ {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Visitor & Real-Time Activity Stream */}
            <div className="admin-glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '1.12rem', margin: 0 }}>
                    🌐 Live Visitor &amp; Activity Stream ({visitors.length})
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Real-time sessions, logins, subscriptions &amp; checkouts
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="btn-secondary"
                  style={{ padding: '0.38rem 0.85rem', fontSize: '0.78rem' }}
                >
                  📥 Download CSV
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '540px', overflowY: 'auto' }}>
                {visitors.map((v, idx) => (
                  <div key={v.id || idx} className="admin-user-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div
                        className="admin-avatar-orb"
                        style={{
                          background: 'linear-gradient(135deg, rgba(245, 208, 169, 0.25), rgba(192, 132, 252, 0.3))',
                          border: '1px solid rgba(245, 208, 169, 0.45)',
                          color: 'var(--warm)',
                        }}
                      >
                        {(v.name || 'G').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div>
                          <strong style={{ color: 'var(--warm)', fontSize: '0.92rem' }}>{v.name}</strong>{' '}
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>({v.email})</span>
                        </div>
                        <div style={{ color: '#e2e8f0', fontSize: '0.83rem', marginTop: '0.18rem' }}>
                          {v.action} • <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{v.device}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        color: '#38bdf8',
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        padding: '0.22rem 0.65rem',
                        borderRadius: 999,
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      📍 {v.location || 'Live Web'}
                    </span>
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

AdminDashboard.displayName = 'BeanSceneAdminDashboard';

export default AdminDashboard;
