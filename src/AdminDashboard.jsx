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
  { id: 30, name: 'Smoked Salmon Cream Bagel',   description: 'Toasted sesame bagel with herb cream cheese, capers & salmon',  price: 6.9, image: 'https://images.unsplash.com/photo-1592417817098-8f3d691a4bf5?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.9, reviews: 187, popular: true,  featured: true,  calories: 340, caffeine: '0mg',   badge: '🥯 Savory Artisan'    },
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
    return existing
      ? { ...def, ...existing, image: existing.image || def.image, category: existing.category || def.category }
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
          <div className="admin-kpi-card" style={{ borderTop: '3px solid #4ade80' }}>
            <div className="admin-kpi-top">
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Live Revenue</span>
              <span className="admin-kpi-icon" style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.12)' }}>💰</span>
            </div>
            <div className="admin-kpi-value" style={{ color: '#4ade80' }}>${totalRevenue.toFixed(2)}</div>
            <div className="admin-kpi-sub">
              <span style={{ color: '#4ade80' }}>●</span> UPI QR &amp; Card Gateway Active
            </div>
          </div>

          <div className="admin-kpi-card" style={{ borderTop: '3px solid #f5d0a9' }}>
            <div className="admin-kpi-top">
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Orders</span>
              <span className="admin-kpi-icon" style={{ color: '#f5d0a9', background: 'rgba(245, 208, 169, 0.12)' }}>☕</span>
            </div>
            <div className="admin-kpi-value" style={{ color: 'var(--warm)' }}>{orders.length}</div>
            <div className="admin-kpi-sub">
              <span style={{ color: 'var(--warm)' }}>●</span> 4-Stage Kitchen Prep Queue
            </div>
          </div>

          <div className="admin-kpi-card" style={{ borderTop: '3px solid #c084fc' }}>
            <div className="admin-kpi-top">
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Active Menu Items</span>
              <span className="admin-kpi-icon" style={{ color: '#c084fc', background: 'rgba(192, 132, 252, 0.12)' }}>🥐</span>
            </div>
            <div className="admin-kpi-value" style={{ color: '#fff' }}>{products.length}</div>
            <div className="admin-kpi-sub">
              <span style={{ color: '#c084fc' }}>●</span> Coffee, Iced &amp; Artisan Bakery
            </div>
          </div>

          <div className="admin-kpi-card" style={{ borderTop: '3px solid #f472b6' }}>
            <div className="admin-kpi-top">
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Table Reservations</span>
              <span className="admin-kpi-icon" style={{ color: '#f472b6', background: 'rgba(244, 114, 182, 0.12)' }}>🪑</span>
            </div>
            <div className="admin-kpi-value" style={{ color: '#f472b6' }}>{reservations.length}</div>
            <div className="admin-kpi-sub">
              <span style={{ color: '#f472b6' }}>●</span> 4 VIP Café Seating Zones
            </div>
          </div>

          <div className="admin-kpi-card" style={{ borderTop: '3px solid #38bdf8' }}>
            <div className="admin-kpi-top">
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Users &amp; Subscribers</span>
              <span className="admin-kpi-icon" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)' }}>👥</span>
            </div>
            <div className="admin-kpi-value" style={{ color: '#38bdf8' }}>
              {users.length + subscribers.length}
            </div>
            <div className="admin-kpi-sub">
              <span style={{ color: '#38bdf8' }}>●</span> {visitors.length} Active Visitor Sessions
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
            <div className="admin-glass-panel" style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--warm)', marginBottom: '1.25rem' }}>
                {isEditing ? '✏️ Edit Product' : '➕ Add New Specialty Product'}
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
            <div className="admin-glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
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
                  All Menu Products ({filteredProducts.length})
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

export default AdminDashboard;
