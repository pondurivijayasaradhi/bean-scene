import { useDebugValue, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const RAW_API_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_URL =
  RAW_API_URL && !RAW_API_URL.includes('localhost') && !RAW_API_URL.includes('127.0.0.1')
    ? RAW_API_URL
    : '';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_PRODUCTS = [
  // Hot Coffee
  { id: 1,  name: 'Cappuccino',                  description: 'Rich espresso with steamed milk foam',                          price: 4.5, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.9, reviews: 218, popular: true,  calories: 120, caffeine: '150mg', badge: '🌱 Oat Option'        },
  { id: 2,  name: 'Latte',                       description: 'Smooth espresso with steamed milk',                             price: 4.8, image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.8, reviews: 195, popular: false, calories: 150, caffeine: '150mg', badge: '🥛 Creamy'            },
  { id: 3,  name: 'Americano',                   description: 'Espresso with hot water',                                       price: 3.5, image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.7, reviews: 143, popular: false, calories: 15,  caffeine: '165mg', badge: '⚡ Zero Sugar'        },
  { id: 7,  name: 'Caramel Macchiato',           description: 'Vanilla steamed milk marked with espresso and caramel drizzle', price: 5.2, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.9, reviews: 264, popular: true,  calories: 210, caffeine: '150mg', badge: '🍯 Best Seller'       },
  { id: 8,  name: 'Caffè Mocha',                 description: 'Full-bodied espresso with bittersweet chocolate and milk',      price: 5.0, image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.8, reviews: 182, popular: true,  calories: 230, caffeine: '155mg', badge: '🍫 Belgian Choc'      },
  { id: 9,  name: 'Flat White',                  description: 'Velvety microfoam poured over a double ristretto shot',         price: 4.7, image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.7, reviews: 134, popular: false, calories: 130, caffeine: '175mg', badge: '✨ Ristretto'         },
  { id: 10, name: 'Espresso Macchiato',          description: 'Bold double espresso topped with a dollop of milk foam',        price: 3.8, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.6, reviews: 97,  popular: false, calories: 35,  caffeine: '180mg', badge: '🔥 Strong'            },
  { id: 19, name: 'Pistachio Velvet Latte',      description: 'Double espresso infused with roasted Sicilian pistachio cream', price: 5.4, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.9, reviews: 214, popular: true,  calories: 185, caffeine: '150mg', badge: '🥜 Roasted Pistachio' },
  { id: 20, name: 'Hazelnut Cortado',            description: 'Equal parts rich espresso and warm toasted hazelnut milk',      price: 4.6, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.8, reviews: 152, popular: false, calories: 95,  caffeine: '160mg', badge: '🌰 Toasted Hazelnut'  },
  { id: 21, name: 'Spanish Condensed Latte',     description: 'Velvety espresso layered with silky sweetened condensed milk',  price: 5.1, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80', category: 'coffee', rating: 4.9, reviews: 241, popular: true,  calories: 220, caffeine: '155mg', badge: '✨ Sweet & Bold'      },

  // Iced Beverages
  { id: 4,  name: 'Iced Coffee',                 description: 'Chilled coffee over ice',                                       price: 4.2, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.8, reviews: 176, popular: true,  calories: 80,  caffeine: '145mg', badge: '🧊 Chilled'           },
  { id: 11, name: 'Cold Brew',                   description: 'Slow-steeped for 20 hours for an ultra-smooth finish',          price: 4.6, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.9, reviews: 230, popular: true,  calories: 25,  caffeine: '200mg', badge: '⚡ 20h Steep'         },
  { id: 12, name: 'Iced Caramel Latte',          description: 'Chilled espresso, milk, and sweet caramel over ice',            price: 5.1, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.8, reviews: 189, popular: true,  calories: 190, caffeine: '150mg', badge: '🍯 Sweet'             },
  { id: 13, name: 'Iced Matcha Latte',           description: 'Ceremonial-grade green tea whisked with cold milk over ice',    price: 5.3, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.7, reviews: 154, popular: false, calories: 140, caffeine: '85mg',  badge: '🍵 Uji Matcha'        },
  { id: 14, name: 'Espresso Frappe',             description: 'Blended iced coffee with rich espresso and whipped cream',      price: 5.5, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.8, reviews: 167, popular: false, calories: 280, caffeine: '140mg', badge: '🍦 Blended'           },
  { id: 22, name: 'Brown Sugar Oat Shaken',      description: 'Blonde espresso shaken with brown sugar, cinnamon, and oat milk', price: 5.4, image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.9, reviews: 278, popular: true,  calories: 130, caffeine: '185mg', badge: '🌱 Oat & Cinnamon'    },
  { id: 23, name: 'Pistachio Cream Cold Brew',   description: '20-hour cold brew topped with silky pistachio sweet cold foam', price: 5.6, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.9, reviews: 221, popular: true,  calories: 175, caffeine: '195mg', badge: '🥜 Cold Foam'         },
  { id: 24, name: 'Strawberry Matcha Cloud',     description: 'Ceremonial Uji matcha layered over house strawberry purée',     price: 5.7, image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.9, reviews: 256, popular: true,  calories: 165, caffeine: '85mg',  badge: '🍓 Layered Matcha'    },
  { id: 25, name: 'Salted Caramel Nitro Brew',   description: 'Velvety nitrogen-infused cold brew with sea salt caramel foam', price: 5.3, image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=600&q=80', category: 'iced',   rating: 4.8, reviews: 164, popular: false, calories: 110, caffeine: '210mg', badge: '⚡ Nitro Draft'       },
  { id: 26, name: 'Mango Passion Iced Espresso', description: 'Crisp sparkling tropical mango & passionfruit topped with espresso', price: 4.9, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', category: 'iced', rating: 4.7, reviews: 138, popular: false, calories: 115, caffeine: '140mg', badge: '🥭 Tropical Fusion'   },

  // Bakery
  { id: 5,  name: 'Croissant',                   description: 'Buttery, flaky French pastry',                                  price: 3.9, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.6, reviews: 112, popular: false, calories: 260, caffeine: '0mg',   badge: '🥐 French Butter'     },
  { id: 6,  name: 'Blueberry Muffin',            description: 'Freshly baked with real blueberries',                           price: 3.5, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.7, reviews: 98,  popular: true,  calories: 290, caffeine: '0mg',   badge: '🫐 Fresh Baked'       },
  { id: 15, name: 'Chocolate Croissant',         description: 'Flaky golden pastry filled with rich dark chocolate',           price: 4.3, image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.9, reviews: 205, popular: true,  calories: 310, caffeine: '15mg',  badge: '🍫 Warm Center'       },
  { id: 16, name: 'Cinnamon Roll',               description: 'Warm spiced swirl topped with cream cheese frosting',           price: 4.5, image: 'https://images.unsplash.com/photo-1583527976767-5399024eeb05?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.8, reviews: 174, popular: true,  calories: 340, caffeine: '0mg',   badge: '✨ House Glaze'       },
  { id: 17, name: 'Banana Walnut Bread',         description: 'Moist house-baked banana slice loaded with toasted walnuts',    price: 3.8, image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.7, reviews: 119, popular: false, calories: 270, caffeine: '0mg',   badge: '🌰 Toasted Nuts'      },
  { id: 18, name: 'Avocado Toast',               description: 'Artisan sourdough with smashed avocado and chili flakes',       price: 6.5, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.8, reviews: 142, popular: false, calories: 320, caffeine: '0mg',   badge: '🥑 Sourdough'         },
  { id: 27, name: 'Almond Frangipane Croissant', description: 'Double-baked croissant filled with sweet almond cream & flakes', price: 4.8, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.9, reviews: 193, popular: true,  calories: 330, caffeine: '0mg',   badge: '🥐 Double Baked'      },
  { id: 28, name: 'Tiramisu Espresso Cake',      description: 'Espresso-soaked sponge layered with whipped mascarpone & cocoa', price: 5.8, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.9, reviews: 234, popular: true,  calories: 360, caffeine: '35mg',  badge: '🍰 Mascarpone'        },
  { id: 29, name: 'Belgian Waffle & Berries',    description: 'Crisp pearl-sugar Liège waffle topped with warm berry compote', price: 5.5, image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.8, reviews: 162, popular: false, calories: 310, caffeine: '0mg',   badge: '🍓 Warm Waffle'       },
  { id: 30, name: 'Smoked Salmon Cream Bagel',   description: 'Toasted sesame bagel with herb cream cheese, capers & salmon',  price: 6.9, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.9, reviews: 187, popular: true,  calories: 340, caffeine: '0mg',   badge: '🥯 Savory Artisan'    },
];

const mergeProductCatalog = (savedList = [], catalog = DEFAULT_PRODUCTS) => {
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

// Built-in resilient API adapter when no external backend URL is configured
if (!API_BASE_URL) {
  axios.defaults.adapter = async (config) => {
    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();
    let body = {};
    if (config.data) {
      try {
        body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      } catch {
        body = {};
      }
    }

    let responseData = { status: 'ok' };
    let status = 200;

    if (url.includes('/api/products')) {
      if (method === 'get') {
        try {
          const savedProds = JSON.parse(localStorage.getItem('beanSceneProducts') || 'null');
          responseData = Array.isArray(savedProds) && savedProds.length > 0
            ? mergeProductCatalog(savedProds)
            : mergeProductCatalog(DEFAULT_PRODUCTS);
        } catch {
          responseData = DEFAULT_PRODUCTS;
        }
      } else if (method === 'post') {
        status = 201;
        responseData = { id: body.id || Date.now(), ...body };
      } else {
        responseData = { ...body };
      }
    } else if (url.includes('/api/subscribe')) {
      responseData = {
        message: 'Subscribed successfully!',
        promoCode: 'FIRST10',
        email: body.email || null,
      };
    } else if (url.includes('/api/orders')) {
      if (method === 'get') {
        try {
          responseData = JSON.parse(localStorage.getItem('beanSceneOrders') || '[]');
        } catch {
          responseData = [];
        }
      } else if (method === 'post') {
        const createdOrder = { id: body.id || `BSC-${Date.now()}`, ...body, status: body.status || 'Received' };
        try {
          const prevOrders = JSON.parse(localStorage.getItem('beanSceneOrders') || '[]');
          const exists = prevOrders.some((o) => String(o.id) === String(createdOrder.id));
          if (!exists) {
            localStorage.setItem('beanSceneOrders', JSON.stringify([createdOrder, ...prevOrders]));
          }
        } catch {
          // Ignore storage error
        }
        responseData = {
          message: 'Order placed successfully!',
          order: createdOrder,
        };
      } else if (method === 'patch') {
        const orderIdFromUrl = url.split('/api/orders/')[1]?.split('?')[0] || body.id;
        try {
          const prevOrders = JSON.parse(localStorage.getItem('beanSceneOrders') || '[]');
          const nextOrders = prevOrders.map((o) =>
            String(o.id) === String(orderIdFromUrl) ? { ...o, status: body.status || o.status } : o
          );
          localStorage.setItem('beanSceneOrders', JSON.stringify(nextOrders));
        } catch {
          // Ignore storage error
        }
        responseData = { id: orderIdFromUrl, ...body };
      } else {
        responseData = { ...body };
      }
    } else if (url.includes('/api/reservations')) {
      if (method === 'get') {
        try {
          responseData = JSON.parse(localStorage.getItem('beanSceneReservations') || '[]');
        } catch {
          responseData = [];
        }
      } else {
        status = 201;
        responseData = { ...body, createdAt: new Date().toISOString() };
      }
    } else if (url.includes('/api/register')) {
      responseData = {
        message: 'Registration successful!',
        user: { name: body.name || 'Coffee Lover', email: body.email || '' },
      };
    } else if (url.includes('/api/login')) {
      const emailStr = body.email || 'guest@beanscene.com';
      responseData = {
        message: 'Login successful',
        token: 'bean-scene-jwt-token',
        user: { name: emailStr.split('@')[0], email: emailStr, role: 'customer' },
      };
    } else if (url.includes('/api/visitors')) {
      let savedVisitors = [];
      let savedUsers = [];
      let savedSubs = [];
      try {
        savedVisitors = JSON.parse(localStorage.getItem('beanSceneVisitors') || '[]');
        savedUsers = JSON.parse(localStorage.getItem('beanSceneUsersList') || '[]');
        savedSubs = JSON.parse(localStorage.getItem('beanSceneSubscribers') || '[]');
      } catch {
        // Fallback empty arrays
      }
      if (method === 'post') {
        const entry = {
          id: `vis-${Date.now()}`,
          name: body.name || 'Guest Visitor',
          email: body.email || 'Anonymous Session',
          action: body.action || 'Viewing Bean Scene Live App',
          device: body.device || 'Web Browser',
          location: body.location || 'Live Web',
          time: new Date().toISOString(),
        };
        savedVisitors = [entry, ...savedVisitors.slice(0, 49)];
        localStorage.setItem('beanSceneVisitors', JSON.stringify(savedVisitors));
      }
      responseData = {
        status: 'ok',
        visitors: savedVisitors,
        users: savedUsers,
        subscribers: savedSubs,
      };
    }

    return {
      data: responseData,
      status,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      request: {},
    };
  };
}

const CATEGORIES = [
  { key: 'all',       label: '☕ All'       },
  { key: 'coffee',    label: '☕ Coffee'    },
  { key: 'iced',      label: '🧊 Iced'     },
  { key: 'bakery',    label: '🥐 Bakery'    },
  { key: 'favorites', label: '❤️ Favorites' },
];

const MOOD_PAIRINGS = [
  { key: 'focus',     label: '⚡ Power Focus',       drinkId: 10, foodId: 5  },
  { key: 'sweet',     label: '🍯 Sweet & Cozy',      drinkId: 7,  foodId: 16 },
  { key: 'pistachio', label: '🥜 Pistachio Luxe',    drinkId: 19, foodId: 27 },
  { key: 'chill',     label: '🧊 Cool & Refreshing', drinkId: 11, foodId: 6  },
  { key: 'berry',     label: '🍓 Berry Matcha Bliss', drinkId: 24, foodId: 28 },
  { key: 'zen',       label: '🍵 Zen & Savory',      drinkId: 13, foodId: 30 },
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

const GIFT_CARD_TIERS = [
  { amount: 15, label: '☕ Morning Treat',   bonusPts: 150, desc: 'Covers 3 handcrafted espresso drinks' },
  { amount: 25, label: '🥐 Café Duo Pass',   bonusPts: 300, desc: 'Most popular gift for coffee & pastry lovers' },
  { amount: 50, label: '👑 VIP Roastery Box', bonusPts: 650, desc: 'Ultimate coffee connoisseur experience' },
];

const BEAN_SUBSCRIPTION_PLANS = [
  {
    id: 'sub-ethiopia',
    name: '📦 Ethiopian Yirgacheffe Whole Bean Box',
    roast: 'Light-Medium Roast • Floral, Bergamot & Honey Notes',
    bagSize: '340g (12oz) Freshly Roasted Bag',
    price: 16.5,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
    badge: '🌿 Single Origin',
  },
  {
    id: 'sub-colombia',
    name: '📦 Colombian Supremo Espresso Reserve',
    roast: 'Medium-Dark Roast • Rich Caramel, Cocoa & Hazelnut',
    bagSize: '340g (12oz) Freshly Roasted Bag',
    price: 18.0,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    badge: '🔥 Barista Blend',
  },
  {
    id: 'sub-taster',
    name: '📦 World Roastery Trio Flight (3 × 200g)',
    roast: 'Assorted Single-Origin Micro-Lots + Tasting Flight Guide',
    bagSize: '600g Total (3 Artisan Pouches)',
    price: 26.0,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
    badge: '🏆 Best Value',
  },
];

const CAFE_BRANCHES = [
  {
    id: 'downtown',
    name: 'Bean Scene Flagship Roastery',
    address: '420 Artisan Roastery Way, Downtown Arts District',
    hours: '07:00 AM – 10:00 PM Daily',
    status: '🟢 Open Now • Closes at 10:00 PM',
    phone: '+1 (555) 234-BEAN',
    wifi: '⚡ 650 Mbps Fiber Wi-Fi • Pass: brew2026',
    features: ['🔥 Live Copper Drum Roaster', '💻 16 Quiet Work Pods', '🌿 Heated Garden Patio', '🔌 USB-C at Every Table'],
    mapQuery: 'Coffee+Roastery+Downtown',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'lakeside',
    name: 'Bean Scene Lakeside Glasshouse',
    address: '88 Waterfront Promenade, Marina Bay',
    hours: '07:30 AM – 10:30 PM Daily',
    status: '🟢 Open Now • Closes at 10:30 PM',
    phone: '+1 (555) 890-CAFE',
    wifi: '⚡ 500 Mbps Mesh Wi-Fi • Pass: latte2026',
    features: ['🌊 Panoramic Sunset Deck', '🥐 On-Site French Bakery Oven', '🎶 Acoustic Vinyl Evenings', '🐕 Pet-Friendly Patio'],
    mapQuery: 'Waterfront+Coffee+Cafe',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
  },
];

// Synthesize a pleasant 2-tone Barista Bell Chime via Web Audio API
const playBaristaBellChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const playTone = (freq, startOffset, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startOffset);
      osc.stop(ctx.currentTime + startOffset + duration);
    };
    // Ding-Dong service bell chord (E6 -> G#6)
    playTone(1318.5, 0, 0.55);
    playTone(1661.2, 0.18, 0.85);
  } catch {
    // Ignore if browser blocks audio before interaction
  }
};

// Farm-to-Cup Bean Origin & Traceability Passport Generator
const getOriginPassport = (product) => {
  if (!product) return null;
  const name = (product.name || '').toLowerCase();
  if (name.includes('matcha')) {
    return {
      origin: 'Uji, Kyoto Prefecture, Japan 🇯🇵',
      farm: 'Marukyu Ceremonial Shade-Grown Estate',
      altitude: '420m – 650m Hillside Terraces',
      process: 'First-Harvest Stone-Milled Tencha Leaf',
      roastLevel: 2,
      roastLabel: 'Ceremonial Emerald Grade',
      brewMethod: '80°C Bamboo Chasen Whisk (70g water)',
      notes: ['🌿 Umami Sweet', '🍵 Creamy Vegetal', '✨ White Chocolate'],
      lotCode: `UJI-2026-${product.id || 13}`,
    };
  }
  if (product.category === 'bakery') {
    return {
      origin: 'Normandy & Loire Valley, France 🇫🇷',
      farm: 'Moulin Tradition T65 Organic Stone-Mill',
      altitude: 'Artisan Hearth Oven • 210°C Steam Bake',
      process: '48-Hour Cold Laminated AOC Cultured Butter',
      roastLevel: 3,
      roastLabel: 'Golden Flaky Crust Bake',
      brewMethod: 'Best Served Warm (180°C 3-Min Refresh)',
      notes: ['🧈 Cultured Butter', '🌾 Toasted Brioche', '🍯 Caramelized Crust'],
      lotCode: `BAK-2026-${product.id || 5}`,
    };
  }
  if (name.includes('pistachio') || name.includes('hazelnut') || name.includes('spanish')) {
    return {
      origin: 'Antioquia & Huila, Colombia 🇨🇴',
      farm: 'Finca El Paraíso High-Altitude Micro-Lot',
      altitude: '1,850m – 2,050m Above Sea Level',
      process: 'Honey-Washed & Sun-Dried on Raised Beds',
      roastLevel: 4,
      roastLabel: 'Medium-Dark Velvet Espresso Roast',
      brewMethod: '93°C Double Ristretto Extraction (18g → 36g in 28s)',
      notes: ['🥜 Roasted Nut Praline', '🍫 Dark Cacao', '🍯 Brown Sugar'],
      lotCode: `COL-2026-${product.id || 19}`,
    };
  }
  if (product.category === 'iced') {
    return {
      origin: 'Yirgacheffe & Sidamo, Ethiopia 🇪🇹',
      farm: 'Kongas Cooperative Organic Wash Station',
      altitude: '1,950m – 2,150m Above Sea Level',
      process: '20-Hour Slow Cold Immersion & Triple Filtered',
      roastLevel: 3,
      roastLabel: 'Medium Omni-Roast for Cold Extraction',
      brewMethod: '20h Steep at 4°C or Flash-Chilled Japanese Pour',
      notes: ['🍊 Bergamot Citrus', '🍫 Silky Milk Choc', '🌸 Jasmine Finish'],
      lotCode: `ETH-2026-${product.id || 11}`,
    };
  }
  return {
    origin: 'Cerrado Mineiro & Mogiana, Brazil 🇧🇷',
    farm: 'Fazenda Santa Inês Rainforest Alliance Estate',
    altitude: '1,650m – 1,850m Above Sea Level',
    process: 'Natural Pulped Sun-Dried Arabica Bourbon',
    roastLevel: 4,
    roastLabel: 'Signature Medium-Dark Espresso Roast',
    brewMethod: '9 Bars @ 93.5°C (18.5g dose → 38g yield in 27s)',
    notes: ['🍫 Bittersweet Cocoa', '🌰 Toasted Hazelnut', '🍯 Velvety Crema'],
    lotCode: `BRA-2026-${product.id || 1}`,
  };
};

const VIP_LOYALTY_TIERS = [
  {
    key: 'bronze',
    name: '🥉 Bronze Barista',
    minPts: 0,
    maxPts: 149,
    color: '#d97706',
    perks: ['Earn 10 Bean Points per $1 spent', 'Free Birthday Pastry Coupon', 'Access to 3D Cup Studio'],
  },
  {
    key: 'silver',
    name: '🥈 Silver Roaster',
    minPts: 150,
    maxPts: 349,
    color: '#cbd5e1',
    perks: ['Free Oat & Almond Milk Upgrades', 'Redeem 200 Pts for $5.00 OFF any order', 'Double Points on Tuesday Mornings'],
  },
  {
    key: 'gold',
    name: '👑 Gold Reserve VIP',
    minPts: 350,
    maxPts: 99999,
    color: '#fbbf24',
    perks: ['⚡ Priority 3-Minute Fast-Track Pickup Lane', 'Complimentary Extra Espresso Shot', 'VIP Window & Fireplace Table Priority', 'Exclusive Single-Origin Secret Menu'],
  },
];

const GROUP_TEAMMATES = ['👤 You', '👩‍💻 Priya', '👨‍💻 Rahul', '🎨 Maya', '🚀 Alex'];

// 1. Interactive Home Brew Timer & Barista Recipe Guide Data
const BREW_GUIDES = [
  {
    id: 'v60',
    name: '☕ V60 Pour-Over',
    icon: '⏳',
    ratio: '1 : 15.5',
    coffeeG: 18,
    waterMl: 280,
    temp: '93°C (200°F)',
    grind: 'Medium-Fine (Sea Salt)',
    totalSec: 165,
    recommendedBeanId: 11,
    steps: [
      { label: '1. Bloom Pour (60ml)', startSec: 0, endSec: 45, tip: 'Pour 60ml in slow spirals to degas fresh CO₂ and unlock floral aromatics.' },
      { label: '2. First Center Pour (to 170ml)', startSec: 45, endSec: 105, tip: 'Pour steadily in concentric circles from center outward without hitting the paper wall.' },
      { label: '3. Final Sweet Pour & Drawdown (to 280ml)', startSec: 105, endSec: 165, tip: 'Gentle final pour and give the dripper a 1-second swirl for a flat espresso-grade bed.' },
    ],
  },
  {
    id: 'frenchpress',
    name: '🫖 French Press',
    icon: '🫖',
    ratio: '1 : 15',
    coffeeG: 24,
    waterMl: 360,
    temp: '95°C (203°F)',
    grind: 'Coarse (Cracked Pepper)',
    totalSec: 240,
    recommendedBeanId: 1,
    steps: [
      { label: '1. Full Immersion Pour (360ml)', startSec: 0, endSec: 60, tip: 'Pour all 360ml of hot water vigorously over coarse grounds so every particle is saturated.' },
      { label: '2. Crust Break & Gentle Stir', startSec: 60, endSec: 180, tip: 'At 1:00, gently stir the top crust 3 times with a wooden spoon so grounds settle.' },
      { label: '3. Slow Plunge & Decant', startSec: 180, endSec: 240, tip: 'Press the mesh filter slowly over 20 seconds and pour immediately to avoid over-extraction.' },
    ],
  },
  {
    id: 'aeropress',
    name: '🧪 AeroPress Championship',
    icon: '🧪',
    ratio: '1 : 13.5',
    coffeeG: 16,
    waterMl: 220,
    temp: '88°C (190°F)',
    grind: 'Fine-Medium (Table Salt)',
    totalSec: 110,
    recommendedBeanId: 19,
    steps: [
      { label: '1. Rapid Saturation & Paddle Stir', startSec: 0, endSec: 35, tip: 'Add 220ml water in 15 seconds, stir back-and-forth 10 times, and attach the cap.' },
      { label: '2. Vacuum Steep Infusion', startSec: 35, endSec: 80, tip: 'Pull plunger up 5mm to create a vacuum seal that prevents dripping while flavors develop.' },
      { label: '3. 30-Second Pneumatic Press', startSec: 80, endSec: 110, tip: 'Press down with steady forearm weight until you hear the signature hiss.' },
    ],
  },
  {
    id: 'mokapot',
    name: '🔥 Italian Moka Pot',
    icon: '🔥',
    ratio: '1 : 10',
    coffeeG: 20,
    waterMl: 200,
    temp: 'Pre-Boiled 98°C Bottom Chamber',
    grind: 'Fine ( slightly coarser than Espresso)',
    totalSec: 150,
    recommendedBeanId: 10,
    steps: [
      { label: '1. Fill Boiler with Pre-Heated Water', startSec: 0, endSec: 50, tip: 'Fill bottom chamber to just below the brass safety valve with hot water and level the basket.' },
      { label: '2. Low-Flame Pressure Build', startSec: 50, endSec: 110, tip: 'Heat on medium-low flame with the lid open until rich honey-colored crema begins to rise.' },
      { label: '3. Cool Base Under Tap & Pour', startSec: 110, endSec: 150, tip: 'As soon as sputtering starts, run cold water on the boiler base to lock in sweetness.' },
    ],
  },
];

// 2. Interactive Visual Café Floor Plan Tables (12 Tables across 4 Zones)
const CAFE_FLOOR_TABLES = [
  { id: 'T1',  zone: 'window',    seats: 2, label: 'T1 • Window Duo',     status: 'available', perk: '☀️ Sunlit + Outlet' },
  { id: 'T2',  zone: 'window',    seats: 4, label: 'T2 • Corner Bay',     status: 'available', perk: '🪟 Panoramic View' },
  { id: 'T3',  zone: 'window',    seats: 2, label: 'T3 • Street Perch',   status: 'occupied',  perk: '☀️ Natural Light' },
  { id: 'T4',  zone: 'patio',     seats: 4, label: 'T4 • Olive Tree',     status: 'available', perk: '🌿 Heated Pergola' },
  { id: 'T5',  zone: 'patio',     seats: 6, label: 'T5 • Garden Cabana',  status: 'available', perk: '🐕 Pet Friendly' },
  { id: 'T6',  zone: 'patio',     seats: 2, label: 'T6 • Fountain Bistro', status: 'occupied', perk: '🌸 Breeze Spot' },
  { id: 'T7',  zone: 'workpod',   seats: 1, label: 'T7 • Focus Pod A',    status: 'available', perk: '⚡ 650Mbps + USB-C' },
  { id: 'T8',  zone: 'workpod',   seats: 2, label: 'T8 • Dual Studio Pod', status: 'available', perk: '🖥️ Monitor Dock' },
  { id: 'T9',  zone: 'workpod',   seats: 1, label: 'T9 • Quiet Booth B',  status: 'occupied',  perk: '🎧 Acoustic Glass' },
  { id: 'T10', zone: 'fireplace', seats: 4, label: 'T10 • HearthChester', status: 'available', perk: '🔥 Near Fireplace' },
  { id: 'T11', zone: 'fireplace', seats: 6, label: 'T11 • Roaster Sofa',  status: 'available', perk: '🥁 Roaster View' },
  { id: 'T12', zone: 'fireplace', seats: 2, label: 'T12 • Velvet Armchair', status: 'available', perk: '🎶 Vinyl Corner' },
];

// 3. Roastery Events, Cupping Workshops & Latte Art Masterclasses
const ROASTERY_EVENTS = [
  {
    id: 'evt-latte-art',
    title: '🎨 Sunday Latte Art & Microfoam Masterclass',
    date: 'This Sunday • 11:00 AM – 12:30 PM',
    host: 'Head Barista Marco Rossi (WLAC Finalist)',
    price: 24.0,
    spotsLeft: 4,
    badge: '🔥 Only 4 Spots Left',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80',
    desc: 'Hands-on steaming & free-pour workshop on our La Marzocco Linea PB. Learn hearts, tulips, and rosettas + take home a 200g espresso bag!',
    perks: ['🥛 Unlimited Oat & Whole Milk Practice', '🎁 Free 200g Bean Bag Included', '📜 Certified Barista Certificate'],
  },
  {
    id: 'evt-cupping',
    title: '🌍 Ethiopian & Colombian Micro-Lot Cupping Flight',
    date: 'Saturday • 04:00 PM – 05:30 PM',
    host: 'Q-Grader & Head Roaster Elena Vance',
    price: 18.0,
    spotsLeft: 6,
    badge: '🌿 Sensory Flight',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
    desc: 'Taste 5 rare high-altitude single-origin coffees side by side using SCA cupping protocols and aroma vials.',
    perks: ['☕ 5 Rare Micro-Lot Tastings', '🥐 Artisan French Pastry Pairing', '🏅 +200 Bonus Bean Points'],
  },
  {
    id: 'evt-vinyl',
    title: '🎶 Acoustic Vinyl, Cold Brew & Tiramsu Night',
    date: 'Friday Evening • 07:30 PM – 09:30 PM',
    host: 'DJ Kavi & Bean Scene Pastry Chef',
    price: 15.0,
    spotsLeft: 7,
    badge: '✨ Evening Lounge',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    desc: 'Unwind by the copper roaster with analog jazz vinyl sets, a flight of 3 signature cold brews, and house mascarpone tiramisu.',
    perks: ['🧊 3-Glass Cold Brew Flight', '🍰 Full Tiramisu Slice Included', '🪑 Reserved Fireplace Lounge Seat'],
  },
];

// 5. Multi-Currency Rates & Pre-Order Pickup Slots
const CURRENCY_CONFIG = {
  USD: { code: 'USD', symbol: '$', rate: 1,    label: '🇺🇸 $ USD' },
  INR: { code: 'INR', symbol: '₹', rate: 84,   label: '🇮🇳 ₹ INR' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: '🇪🇺 € EUR' },
};

const PICKUP_TIME_SLOTS = [
  '⚡ ASAP (Ready in 5–8 mins)',
  '🕣 Today • 08:30 AM (Morning Commute)',
  '🕥 Today • 10:30 AM (Mid-Morning Break)',
  '🕐 Today • 01:15 PM (Lunch Pairing)',
  '🕟 Today • 04:30 PM (Afternoon Boost)',
  '🕖 Today • 07:00 PM (Evening Roastery)',
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

const FALLBACK_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%231e142b'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='48'>☕</text></svg>";

const getFallbackImage = () => FALLBACK_SVG;

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
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneProducts');
      if (saved) {
        const merged = mergeProductCatalog(JSON.parse(saved));
        localStorage.setItem('beanSceneProducts', JSON.stringify(merged));
        return merged;
      }
      return DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [dietFilter, setDietFilter] = useState('all');
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

  // Interactive AI Barista Concierge Chat state
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi! ☕ I’m your AI Barista Concierge. Ask me for low-calorie drinks, max caffeine, oat milk specials, promo codes, or order tracking!',
      products: [DEFAULT_PRODUCTS[3], DEFAULT_PRODUCTS[8]],
    },
  ]);

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
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [reelIdx, setReelIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroWordIdx((i) => (i + 1) % HERO_WORDS.length);
      setReelIdx((i) => (i + 1) % Math.max(1, products.length));
    }, 5500);
    return () => clearInterval(interval);
  }, [products.length]);

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
  const [orderFulfillment, setOrderFulfillment] = useState('🏪 In-Café Pickup');
  const [paymentMethod, setPaymentMethod] = useState('📱 UPI / QR Pay');

  // Interactive UPI QR & Card Payment Gateway Modal state
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [upiIdInput, setUpiIdInput] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

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
  const [visitorsList, setVisitorsList] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneVisitors');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'vis-init',
              name: 'Vijaya Saradhi',
              email: 'vijayasaradhiponduri@gmail.com',
              action: 'Active Session • Menu & Cup Studio',
              device: 'Chrome • Desktop',
              location: 'Live Web App',
              time: 'Just now',
            },
          ];
    } catch {
      return [];
    }
  });
  const [usersList, setUsersList] = useState(() => {
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
  const [subscribersList, setSubscribersList] = useState(() => {
    try {
      const saved = localStorage.getItem('beanSceneSubscribers');
      return saved ? JSON.parse(saved) : ['vijayasaradhiponduri@gmail.com', 'hello@beanscene.com'];
    } catch {
      return ['vijayasaradhiponduri@gmail.com'];
    }
  });
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('coffee');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('✨ Barista Special');

  // Light / Dark Roastery Theme Toggle ("dark" Espresso vs "light" Oat Milk Cream)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('beanSceneTheme') || 'dark';
    } catch {
      return 'dark';
    }
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Digital Gift Card & Whole-Bean Subscription Box State
  const [giftAmount, setGiftAmount] = useState(25);
  const [giftRecipientName, setGiftRecipientName] = useState('');
  const [giftRecipientEmail, setGiftRecipientEmail] = useState('');
  const [giftMessage, setGiftMessage] = useState('Enjoy a warm cup on me! ☕✨');
  const [beanSubFrequency, setBeanSubFrequency] = useState('Weekly (Save 15%)');

  // Café Location & Store Finder State
  const [activeBranchId, setActiveBranchId] = useState(CAFE_BRANCHES[0].id);

  // 1. Bean Origin & Farm-to-Cup Traceability Passport Modal State
  const [passportProduct, setPassportProduct] = useState(null);

  // 2. Group Order / Office Coffee Run Split-Bill State
  const [groupOrderMode, setGroupOrderMode] = useState(false);
  const [activeMemberTag, setActiveMemberTag] = useState(GROUP_TEAMMATES[0]);
  const [customMemberInput, setCustomMemberInput] = useState('');
  const [groupMembers, setGroupMembers] = useState(GROUP_TEAMMATES);

  // 3. VIP Loyalty Tier Membership Card Modal State
  const [showVipModal, setShowVipModal] = useState(false);

  // 4. Voice-Enabled AI Barista Concierge State
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceSpeakEnabled, setVoiceSpeakEnabled] = useState(true);

  // 5. Installable PWA Prompt & Modal State
  const [deferredPwaPrompt, setDeferredPwaPrompt] = useState(null);
  const [showPwaModal, setShowPwaModal] = useState(false);

  // NEW BATCH:
  // 1. Home Brew Timer & Barista Recipe Guide State
  const [selectedBrewId, setSelectedBrewId] = useState(BREW_GUIDES[0].id);
  const [brewTimerSec, setBrewTimerSec] = useState(0);
  const [brewTimerRunning, setBrewTimerRunning] = useState(false);

  // 2. Interactive Visual Floor Plan Table Picker State
  const [selectedTableId, setSelectedTableId] = useState('T1');

  // 3. Roastery Events & Workshops State
  const [bookedEventIds, setBookedEventIds] = useState([]);

  // 4. Personal Daily Caffeine & Hydration Wellness Tracker Modal State
  const [showWellnessModal, setShowWellnessModal] = useState(false);
  const [waterGlasses, setWaterGlasses] = useState(3);

  // 5. Multi-Currency ($ USD / ₹ INR / € EUR) & Scheduled Pre-Order Pickup Slot State
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem('beanSceneCurrency') || 'USD';
    } catch {
      return 'USD';
    }
  });
  const [pickupSlot, setPickupSlot] = useState(PICKUP_TIME_SLOTS[0]);

  // Built-in React DevTools Live State & Props Inspector Modal
  const [showReactDevTools, setShowReactDevTools] = useState(false);

  // Expose live state label to browser React Developer Tools extension
  useDebugValue(
    `BeanScene(items=${products.length}, cart=${cart.length}, pts=${beanPoints}, theme=${theme}, curr=${currency})`
  );

  const activeBrewGuide = BREW_GUIDES.find((b) => b.id === selectedBrewId) || BREW_GUIDES[0];

  useEffect(() => {
    try {
      localStorage.setItem('beanSceneCurrency', currency);
    } catch {
      // Ignore storage error
    }
  }, [currency]);

  // Live 1-Second Interval for Interactive Home Brew Timer
  useEffect(() => {
    if (!brewTimerRunning) return;
    const timer = setInterval(() => {
      setBrewTimerSec((prev) => {
        if (prev + 1 >= activeBrewGuide.totalSec) {
          setBrewTimerRunning(false);
          if (soundEnabled) playBaristaBellChime();
          return activeBrewGuide.totalSec;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [brewTimerRunning, activeBrewGuide.totalSec, soundEnabled]);

  // Multi-Currency Price Formatter Helper
  const currObj = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
  const formatPrice = (usdAmount) => {
    const num = Number(usdAmount || 0) * currObj.rate;
    return currency === 'INR'
      ? `${currObj.symbol}${Math.round(num)}`
      : `${currObj.symbol}${num.toFixed(2)}`;
  };
  const cycleCurrency = () => {
    const order = ['USD', 'INR', 'EUR'];
    const next = order[(order.indexOf(currency) + 1) % order.length];
    setCurrency(next);
    showToast(`Switched store currency to ${CURRENCY_CONFIG[next].label}! 🌍`);
  };

  // Calculate Live Personal Daily Caffeine (mg) & Calories (kcal) across Cart + Today's Orders
  const parseMg = (str) => parseInt(String(str || '0').replace(/\D/g, ''), 10) || 0;
  const cartCaffeineMg = cart.reduce((sum, it) => {
    const prod = products.find((p) => p.id === it.productId || p.name === it.name);
    const unitMg = prod ? parseMg(prod.caffeine) : it.name?.toLowerCase().includes('matcha') ? 85 : 140;
    return sum + unitMg * (it.quantity || 1);
  }, 0);
  const cartCaloriesKcal = cart.reduce((sum, it) => {
    const prod = products.find((p) => p.id === it.productId || p.name === it.name);
    const unitCal = prod ? Number(prod.calories || 150) : 160;
    return sum + unitCal * (it.quantity || 1);
  }, 0);
  const orderedCaffeineMg = orderHistory.slice(0, 2).reduce((sum, ord) => {
    return (
      sum +
      (ord.items || []).reduce((s, it) => {
        const prod = products.find((p) => p.id === it.productId || it.name?.includes(p.name));
        return s + (prod ? parseMg(prod.caffeine) : 120) * (it.quantity || 1);
      }, 0)
    );
  }, 0);
  const totalDailyCaffeine = cartCaffeineMg + orderedCaffeineMg;
  const recommendedWaterCups = Math.max(4, Math.ceil(totalDailyCaffeine / 65) + 2);

  // Book a Workshop / Roastery Event Ticket
  const handleBookEventWorkshop = (evt) => {
    setCart((prev) => [
      ...prev,
      {
        id: `${evt.id}-${prev.length + 1}`,
        name: `🎟️ Event Pass: ${evt.title}`,
        image: evt.image,
        size: 'VIP Seat',
        milk: null,
        notes: `${evt.date} • ${evt.host}`,
        unitPrice: evt.price,
        price: evt.price,
        quantity: 1,
      },
    ]);
    if (!bookedEventIds.includes(evt.id)) {
      setBookedEventIds((prev) => [...prev, evt.id]);
    }
    showToast(`Reserved your seat for "${evt.title}"! Added pass to cart 🎟️`);
  };

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      setDeferredPwaPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('beanSceneTheme', theme);
  }, [theme]);

  // Sync Cart, Orders, Reservations, Reviews & Live Users to localStorage
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

  useEffect(() => {
    localStorage.setItem('beanSceneVisitors', JSON.stringify(visitorsList));
  }, [visitorsList]);

  useEffect(() => {
    localStorage.setItem('beanSceneUsersList', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('beanSceneSubscribers', JSON.stringify(subscribersList));
  }, [subscribersList]);

  // Animate Live Order Preparation Tracker when confirmation modal is open
  useEffect(() => {
    if (!showOrderConfirmation) return;
    const t0 = setTimeout(() => setPrepStage(0), 0);
    const t1 = setTimeout(() => setPrepStage(1), 2200);
    const t2 = setTimeout(() => setPrepStage(2), 4800);
    const t3 = setTimeout(() => {
      setPrepStage(3);
      if (soundEnabled) {
        playBaristaBellChime();
      }
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('☕ Bean Scene Order Ready!', {
            body: 'Your handcrafted order is hot and ready for pickup at the Espresso Bar!',
          });
        } catch {
          // Ignore notification errors
        }
      }
    }, 7500);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [showOrderConfirmation, soundEnabled]);

  // Navigation & Subscribe
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  // Set website title & record live production visit
  useEffect(() => {
    document.title = "Bean Scene | Premium Coffee & Bakery";
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isMobile = /Mobi|Android|iPhone/i.test(ua);
    const browser = ua.includes('Edg')
      ? 'Edge'
      : ua.includes('Chrome')
      ? 'Chrome'
      : ua.includes('Firefox')
      ? 'Firefox'
      : ua.includes('Safari')
      ? 'Safari'
      : 'Browser';
    const deviceLabel = `${browser} • ${isMobile ? 'Mobile' : 'Desktop'}`;

    let currentUser = null;
    try {
      currentUser = JSON.parse(localStorage.getItem('beanSceneUser') || 'null');
    } catch {
      currentUser = null;
    }

    axios
      .post(`${API_BASE_URL}/api/visitors`, {
        type: 'visit',
        name: currentUser?.name || 'Guest Visitor',
        email: currentUser?.email || 'Anonymous Session',
        action: 'Opened Bean Scene Live Web App',
        device: deviceLabel,
      })
      .then((res) => {
        if (Array.isArray(res.data?.visitors) && res.data.visitors.length > 0) {
          setVisitorsList(res.data.visitors);
        }
        if (Array.isArray(res.data?.users) && res.data.users.length > 0) {
          setUsersList(res.data.users);
        }
        if (Array.isArray(res.data?.subscribers) && res.data.subscribers.length > 0) {
          setSubscribersList(res.data.subscribers);
        }
      })
      .catch(() => {
        // Keep local visitor state
      });
  }, []);

  // Fetch products from backend or fallback to default
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const saved = localStorage.getItem('beanSceneProducts');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mergedLocal = mergeProductCatalog(parsed);
            localStorage.setItem('beanSceneProducts', JSON.stringify(mergedLocal));
            setProducts(mergedLocal);
            return;
          }
        }
        const res = await axios.get(`${API_BASE_URL}/api/products`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mergedRemote = mergeProductCatalog(res.data);
          localStorage.setItem('beanSceneProducts', JSON.stringify(mergedRemote));
          setProducts(mergedRemote);
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

  // Quick 1-Click Add to Cart from Menu Card (merges quantities if already in cart)
  const handleQuickAdd = (product) => {
    const defaultSize = 'regular';
    const defaultMilk = product.category === 'bakery' ? null : 'whole';
    const memberOwner = groupOrderMode ? activeMemberTag : '👤 You';
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.size === defaultSize &&
          item.milk === defaultMilk &&
          (item.member || '👤 You') === memberOwner &&
          !item.notes
      );
      if (existingIdx > -1) {
        return prev.map((item, idx) =>
          idx === existingIdx ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `${product.id}-${prev.length + 1}-${product.name}`,
          productId: product.id,
          name: product.name,
          image: product.image,
          size: defaultSize,
          milk: defaultMilk,
          member: memberOwner,
          notes: '',
          unitPrice: product.price,
          price: product.price,
          quantity: 1,
        },
      ];
    });
    showToast(
      groupOrderMode
        ? `Added ${product.name} for ${memberOwner}!`
        : `Quick-added ${product.name} to cart!`
    );
  };

  // Assign a cart item to a specific Group Order Teammate
  const handleAssignItemMember = (itemId, memberName) => {
    setCart((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, member: memberName } : it))
    );
  };

  // Add a custom teammate to the Office / Group Coffee Run
  const handleAddGroupTeammate = (e) => {
    e.preventDefault();
    const clean = customMemberInput.trim();
    if (!clean) return;
    const tagged = clean.startsWith('👤') ? clean : `👤 ${clean}`;
    if (!groupMembers.includes(tagged)) {
      setGroupMembers((prev) => [...prev, tagged]);
    }
    setActiveMemberTag(tagged);
    setCustomMemberInput('');
    showToast(`Added ${tagged} to your Group Coffee Run! 👥`);
  };

  // Add AI Mood Pairing Combo (with 10% bundle discount)
  const handleAddMoodCombo = (drink, food) => {
    if (!drink || !food) return;
    const comboPrice = Number(((drink.price + food.price) * 0.9).toFixed(2));
    setCart((prev) => [
      ...prev,
      {
        id: `combo-${drink.id}-${food.id}-${prev.length + 1}`,
        name: `✨ Pairing: ${drink.name} + ${food.name}`,
        image: drink.image,
        size: 'regular',
        milk: 'whole',
        unitPrice: comboPrice,
        price: comboPrice,
        quantity: 1,
      },
    ]);
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
    const itemName = `🎨 ${label} (${cupSize.oz} ${tempLabel}${shotLabel} • ${cupMilk.label}, ${cupSyrup.label}, ${cupTopping.label})`;
    setCart((prev) => [
      ...prev,
      {
        id: `custom-${prev.length + 1}-${label}`,
        name: itemName,
        image: cupTemp === 'iced'
          ? 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
        unitPrice: customCupPrice,
        price: customCupPrice,
        quantity: 1,
      },
    ]);
    setCustomCupName('');
    showToast(`Added ${itemName} to your cart!`);
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
      image: cupTemp === 'iced'
        ? 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
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
    setCupTemp((prev) => (prev === 'hot' ? 'iced' : 'hot'));
    setCupSize((prev) => CUP_SIZES[(CUP_SIZES.indexOf(prev) + 1) % CUP_SIZES.length]);
    setCupBase((prev) => CUP_BASES[(CUP_BASES.indexOf(prev) + 1) % CUP_BASES.length]);
    setCupMilk((prev) => CUP_MILKS[(CUP_MILKS.indexOf(prev) + 1) % CUP_MILKS.length]);
    setCupSyrup((prev) => CUP_SYRUPS[(CUP_SYRUPS.indexOf(prev) + 1) % CUP_SYRUPS.length]);
    setCupTopping((prev) => CUP_TOPPINGS[(CUP_TOPPINGS.indexOf(prev) + 1) % CUP_TOPPINGS.length]);
    setExtraShot((prev) => !prev);
    setCustomCupName('Barista Mystery Cup');
    showToast('🎲 Mixed a Surprise Barista Creation for you!');
  };

  const handleSaveCustomCup = () => {
    const label = customCupName.trim() || `Custom ${cupBase.label}`;
    const tempLabel = cupTemp === 'hot' ? 'Hot' : 'Iced';
    const shotLabel = extraShot ? ' + Extra Shot' : '';
    setSavedCups((prev) => {
      const item = {
        id: `custom-saved-${prev.length + 1}-${label}`,
        name: `🎨 ${label} (${cupSize.oz} ${tempLabel}${shotLabel} • ${cupMilk.label}, ${cupSyrup.label}, ${cupTopping.label})`,
        image: cupTemp === 'iced'
          ? 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
        unitPrice: customCupPrice,
        price: customCupPrice,
        quantity: 1,
      };
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
    const passId = `VIP-${100 + ((reservationsList.length * 73 + 41) % 899)}`;
    const guestName = reserveName.trim() || (isLoggedIn ? userName : 'Valued Guest');
    const reservationPayload = {
      passId,
      name: guestName,
      zone: `${zoneObj.title} (Table ${selectedTableId})`,
      tableId: selectedTableId,
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
    setVisitorsList((prev) => [
      {
        id: `vis-resv-${prev.length + 1}`,
        name: guestName,
        email: isLoggedIn ? userEmail : 'Table Guest',
        action: `Reserved Table Pass #${passId} (${zoneObj.title} • ${reserveTime})`,
        device: 'Web App',
        location: 'Live Web',
        time: 'Just now',
      },
      ...prev,
    ]);
    axios
      .post(`${API_BASE_URL}/api/visitors`, {
        type: 'reservation',
        name: guestName,
        email: isLoggedIn ? userEmail : 'Table Guest',
        action: `Reserved Table Pass #${passId} (${zoneObj.title} • ${reserveTime})`,
      })
      .catch(() => {});
    showToast(`Table Pass #${passId} reserved for ${reserveTime}! 🪑`);
  };

  // Handle Spin-the-Wheel
  const handleSpinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setSpinPrize('');
    const nextDeg = wheelDeg + 1560;
    setWheelDeg(nextDeg);

    setTimeout(() => {
      setSpinning(false);
      const prizes = [
        { type: 'promo', code: 'BEAN25', msg: '🎉 Jackpot! 25% OFF Code BEAN25 Unlocked & Applied!' },
        { type: 'points', pts: 75, msg: '🏆 +75 Bonus Bean Points Added to Your Wallet!' },
        { type: 'promo', code: 'BEAN20', msg: '🔥 20% OFF Code BEAN20 Unlocked & Applied!' },
      ];
      const won = prizes[Math.floor((nextDeg / 120) % prizes.length)];
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
      const caffNum = parseInt(String(p.caffeine || '0').replace(/\D/g, ''), 10) || 0;
      const calNum = Number(p.calories || 0);
      const matchDiet =
        dietFilter === 'all'
          ? true
          : dietFilter === 'low-cal'
          ? calNum > 0 && calNum <= 140
          : dietFilter === 'high-caffeine'
          ? caffNum >= 155
          : dietFilter === 'bestseller'
          ? Boolean(p.popular)
          : true;
      return matchCat && matchSearch && matchDiet;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });

  // Interactive AI Barista Concierge Handler
  const handleAiAsk = (rawQuery) => {
    const q = (rawQuery || aiInput).trim();
    if (!q) return;
    const lower = q.toLowerCase();
    let replyText = '';
    let suggested = [];

    if (lower.includes('low cal') || lower.includes('100') || lower.includes('light') || lower.includes('diet') || lower.includes('sugar')) {
      suggested = products.filter((p) => (p.calories || 200) <= 120).slice(0, 3);
      replyText = '🍃 Here are our lightest, lowest-calorie handcrafted picks (15–120 kcal):';
    } else if (lower.includes('caffeine') || lower.includes('strong') || lower.includes('wake') || lower.includes('energy') || lower.includes('focus')) {
      suggested = products
        .filter((p) => (parseInt(String(p.caffeine || '0').replace(/\D/g, ''), 10) || 0) >= 160)
        .slice(0, 3);
      replyText = '⚡ Need a serious boost? These have our highest caffeine kick (165mg–200mg):';
    } else if (lower.includes('oat') || lower.includes('vegan') || lower.includes('matcha') || lower.includes('milk')) {
      suggested = products.filter((p) => p.id === 22 || p.id === 24 || p.id === 13 || p.id === 1).slice(0, 3);
      replyText = '🌱 Our Brown Sugar Oat Shaken Espresso, Strawberry Matcha Cloud, and Cappuccino are incredible with Oat milk:';
    } else if (lower.includes('pistachio') || lower.includes('nut') || lower.includes('hazelnut')) {
      suggested = products.filter((p) => p.id === 19 || p.id === 23 || p.id === 20 || p.id === 27).slice(0, 3);
      replyText = '🥜 Here are our rich roasted Pistachio & Toasted Hazelnut artisan creations:';
    } else if (lower.includes('bakery') || lower.includes('pastry') || lower.includes('food') || lower.includes('eat') || lower.includes('croissant')) {
      suggested = products.filter((p) => p.category === 'bakery').slice(0, 3);
      replyText = '🥐 Fresh out of our ovens this morning:';
    } else if (lower.includes('promo') || lower.includes('discount') || lower.includes('coupon') || lower.includes('deal')) {
      applyPromoCode('BEAN25');
      replyText = '🎉 I just unlocked and applied promo code BEAN25 (25% OFF) directly to your cart! You can also use BEAN20 or FIRST10.';
    } else if (lower.includes('track') || lower.includes('order') || lower.includes('status')) {
      if (orderHistory.length > 0) {
        const latest = orderHistory[0];
        setConfirmedOrder(latest);
        setShowOrderConfirmation(true);
        replyText = `📦 Opening live tracker for your latest Order #${latest.id} (${latest.status || 'Received'} • ${latest.fulfillment || '🏪 In-Café Pickup'})!`;
      } else {
        replyText = '📦 You don’t have an active order yet. Pick any drink below to place your first order!';
        suggested = products.filter((p) => p.popular).slice(0, 2);
      }
    } else {
      const matched = products.filter(
        (p) => p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower)
      );
      suggested = (matched.length > 0 ? matched : products.filter((p) => p.popular)).slice(0, 3);
      replyText =
        matched.length > 0
          ? `☕ Here is what I found on our menu for "${q}":`
          : '🔥 Here are our top-rated Barista Best Sellers today:';
    }

    setAiMessages((prev) => [
      ...prev,
      { sender: 'user', text: q },
      { sender: 'bot', text: replyText, products: suggested },
    ]);
    setAiInput('');

    // Speak AI Barista response out loud when voice reply is enabled
    if (voiceSpeakEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const cleanSpeech = replyText.replace(/[^\w\s.,!?$%-]/g, '');
        const utter = new SpeechSynthesisUtterance(cleanSpeech);
        utter.rate = 1.04;
        utter.pitch = 1.02;
        window.speechSynthesis.speak(utter);
      } catch {
        // Ignore speech synthesis errors
      }
    }
  };

  // Start Web Speech API Voice Recognition for AI Barista
  const handleStartVoiceOrder = () => {
    const SpeechRec =
      typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRec) {
      showToast('Voice recognition is supported in Chrome & Edge browsers. Try typing or clicking a chip! 🎤');
      return;
    }
    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      setIsListeningVoice(true);
      showToast('🎙️ Listening... Speak your coffee order or question!');

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        setIsListeningVoice(false);
        if (transcript) {
          setAiInput(transcript);
          handleAiAsk(transcript);
        }
      };
      recognition.onerror = () => {
        setIsListeningVoice(false);
      };
      recognition.onend = () => {
        setIsListeningVoice(false);
      };
      recognition.start();
    } catch {
      setIsListeningVoice(false);
    }
  };

  // Handle PWA Install App Click
  const handleInstallPwa = async () => {
    if (deferredPwaPrompt) {
      deferredPwaPrompt.prompt();
      await deferredPwaPrompt.userChoice.catch(() => {});
      setDeferredPwaPrompt(null);
      showToast('📲 Installing Bean Scene App to your device!');
    } else {
      setShowPwaModal(true);
    }
  };

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
      setUsersList((prev) => {
        const filtered = prev.filter((u) => u.email !== regEmail);
        return [{ name: regName, email: regEmail, role: 'customer', lastActive: 'Just registered' }, ...filtered];
      });
      setVisitorsList((prev) => [
        {
          id: `vis-${Date.now()}`,
          name: regName,
          email: regEmail,
          action: 'Created Account (Registered)',
          device: 'Web App',
          location: 'Live Web',
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
      axios
        .post(`${API_BASE_URL}/api/visitors`, {
          type: 'register',
          name: regName,
          email: regEmail,
          action: 'Created Account (Registered)',
        })
        .catch(() => {});
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
      setUsersList((prev) => {
        const filtered = prev.filter((u) => u.email !== mail);
        return [{ name, email: mail, role: res.data.user?.role || 'customer', lastActive: 'Signed in now' }, ...filtered];
      });
      setVisitorsList((prev) => [
        {
          id: `vis-${Date.now()}`,
          name,
          email: mail,
          action: 'Signed In to Account',
          device: 'Web App',
          location: 'Live Web',
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
      axios
        .post(`${API_BASE_URL}/api/visitors`, {
          type: 'login',
          name,
          email: mail,
          action: 'Signed In to Account',
        })
        .catch(() => {});

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
        setUsersList((prev) => {
          const filtered = prev.filter((u) => u.email !== loginEmail);
          return [{ name, email: loginEmail, role: 'customer', lastActive: 'Signed in now' }, ...filtered];
        });
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
    const subEmail = email.trim();
    setSubscribersList((prev) => (prev.includes(subEmail) ? prev : [subEmail, ...prev]));
    setVisitorsList((prev) => [
      {
        id: `vis-${Date.now()}`,
        name: subEmail.split('@')[0],
        email: subEmail,
        action: 'Subscribed to Newsletter (FIRST10)',
        device: 'Web App',
        location: 'Live Web',
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
    axios
      .post(`${API_BASE_URL}/api/visitors`, {
        type: 'subscribe',
        name: subEmail.split('@')[0],
        email: subEmail,
        action: 'Subscribed to Newsletter (FIRST10)',
      })
      .catch(() => {});
    axios
      .post(`${API_BASE_URL}/api/subscribe`, { email: subEmail })
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
  const isBakeryItem =
    activeItem?.category === 'bakery' ||
    activeItem?.name?.toLowerCase().includes('croissant') ||
    activeItem?.name?.toLowerCase().includes('muffin') ||
    activeItem?.name?.toLowerCase().includes('cake') ||
    activeItem?.name?.toLowerCase().includes('waffle') ||
    activeItem?.name?.toLowerCase().includes('bagel') ||
    activeItem?.name?.toLowerCase().includes('toast');
  const sizeCost = !isBakeryItem && orderSize === 'large' ? 0.80 : 0;
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

  // Add customized item from modal to cart (merges quantities if identical config exists)
  const handleAddModalToCart = () => {
    const cleanNotes = orderNotes.trim();
    const itemSize = isBakeryItem ? 'regular' : orderSize;
    const itemMilk = isBakeryItem ? null : orderMilk;
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === activeItem.id &&
          item.size === itemSize &&
          item.milk === itemMilk &&
          (item.notes || '') === cleanNotes
      );
      if (existingIdx > -1) {
        return prev.map((item, idx) =>
          idx === existingIdx ? { ...item, quantity: (item.quantity || 1) + orderQty } : item
        );
      }
      const customizedItem = {
        id: `${activeItem.id}-${prev.length + 1}-${itemSize}`,
        productId: activeItem.id,
        name: activeItem.name,
        image: activeItem.image || DEFAULT_PRODUCTS.find((p) => p.id === activeItem.id)?.image,
        size: itemSize,
        milk: itemMilk,
        notes: cleanNotes,
        unitPrice: modalUnitPrice,
        price: modalUnitPrice,
        quantity: orderQty,
      };
      return [...prev, customizedItem];
    });
    setShowOrderModal(false);
    showToast(`Added ${orderQty}× ${activeItem.name} to cart`);
  };

  // Finalize & persist order after payment verification or Pay at Counter
  const finalizeOrderCheckout = async (draft, transactionId) => {
    if (!draft) return;
    setPlacingOrder(true);
    const orderNum = 1000 + ((orderHistory.length * 137 + Math.round(draft.total * 100)) % 8999);
    const orderId = `BSC-${orderNum}`;

    if (draft.source === 'cart' && draft.redeemPts && beanPoints >= 200) {
      setBeanPoints((prev) => {
        const afterRedeem = Math.max(0, prev - 200);
        localStorage.setItem('beanScenePoints', String(afterRedeem));
        return afterRedeem;
      });
      setRedeemPoints(false);
    }

    const earnedPts = awardPoints(draft.total);

    const newOrder = {
      id: orderId,
      items: draft.items,
      total: draft.total,
      pointsEarned: earnedPts,
      customer: draft.customer,
      fulfillment: orderFulfillment,
      pickupSlot: pickupSlot,
      paymentMethod: paymentMethod,
      transactionId: transactionId || 'COUNTER-PAY',
      paymentStatus: paymentMethod === '💵 Pay at Counter' ? 'Pay at Counter' : 'Paid ✓',
      placedAt: 'Just now',
      status: 'Received',
    };

    try {
      await axios.post(`${API_BASE_URL}/api/orders`, {
        id: orderId,
        items: newOrder.items,
        total: newOrder.total,
        user: draft.customer,
        customer: draft.customer,
        email: draft.email,
        fulfillment: orderFulfillment,
        pickupSlot: pickupSlot,
        paymentMethod: paymentMethod,
        transactionId: newOrder.transactionId,
        paymentStatus: newOrder.paymentStatus,
        currency: currency,
      });
    } catch {
      // Fallback locally if backend server is offline
    }

    setVisitorsList((prev) => [
      {
        id: `vis-ord-${prev.length + 1}`,
        name: draft.customer,
        email: draft.email,
        action: `Order #${orderId} ($${draft.total.toFixed(2)} • ${paymentMethod} • ${newOrder.transactionId})`,
        device: 'Web App',
        location: orderFulfillment,
        time: 'Just now',
      },
      ...prev,
    ]);
    axios
      .post(`${API_BASE_URL}/api/visitors`, {
        type: 'order',
        name: draft.customer,
        email: draft.email,
        action: `Order #${orderId} ($${draft.total.toFixed(2)} • ${paymentMethod} • ${newOrder.transactionId})`,
        location: orderFulfillment,
      })
      .catch(() => {});

    if (draft.source === 'cart') {
      setCart([]);
      setAppliedPromo('');
      setPromoInput('');
      setShowCart(false);
    } else {
      setShowOrderModal(false);
    }

    setShowPaymentGateway(false);
    setPendingCheckout(null);
    setVerifyingPayment(false);
    setPlacingOrder(false);
    setConfirmedOrder(newOrder);
    setOrderHistory((prev) => [newOrder, ...prev]);
    setShowOrderConfirmation(true);
    showToast(`Payment verified (${newOrder.transactionId})! Order #${orderId} confirmed ☕`);
  };

  // Direct checkout from modal (opens Payment Gateway for UPI/Card)
  const handleDirectOrderNow = async (e) => {
    e.preventDefault();
    const customer = orderCustomer.trim() || (isLoggedIn ? userName : 'Guest');
    const itemDesc = isBakeryItem
      ? `${activeItem.name}${orderNotes.trim() ? ` (${orderNotes.trim()})` : ''}`
      : `${activeItem.name} (${orderSize === 'large' ? 'Large' : 'Regular'}, ${orderMilk} milk${orderNotes.trim() ? ` • ${orderNotes.trim()}` : ''})`;
    const draft = {
      source: 'modal',
      items: [
        {
          name: itemDesc,
          quantity: orderQty,
          price: modalUnitPrice,
        },
      ],
      total: modalTotalPrice,
      customer,
      email: isLoggedIn ? userEmail : 'guest@beanscene.com',
      redeemPts: false,
    };

    if (paymentMethod === '💵 Pay at Counter') {
      await finalizeOrderCheckout(draft, 'COUNTER-DUE');
    } else {
      setPendingCheckout(draft);
      setShowOrderModal(false);
      setShowPaymentGateway(true);
    }
  };

  // Handle UPI / Card Gateway Verification Submit
  const handleVerifyGatewayPayment = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!pendingCheckout || verifyingPayment) return;
    setVerifyingPayment(true);
    const prefix = paymentMethod.includes('UPI') ? 'UPI' : paymentMethod.includes('Card') ? 'CARD' : 'COUNTER';
    const txnCode = 100000 + ((orderHistory.length * 4813 + Math.round(pendingCheckout.total * 100)) % 899999);
    const txnId = `${prefix}-${txnCode}`;
    setTimeout(() => {
      finalizeOrderCheckout(pendingCheckout, txnId);
    }, 650);
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

  // Place order from Cart (opens Payment Gateway for UPI/Card)
  const placeCartOrder = async () => {
    if (cart.length === 0) return;
    const customerLabel = isLoggedIn ? userName : 'Guest';
    const customerEmail = isLoggedIn ? userEmail : 'guest@beanscene.com';
    const draft = {
      source: 'cart',
      items: [...cart],
      total: cartTotal,
      customer: customerLabel,
      email: customerEmail,
      redeemPts: Boolean(redeemPoints && beanPoints >= 200),
    };

    if (paymentMethod === '💵 Pay at Counter') {
      await finalizeOrderCheckout(draft, 'COUNTER-DUE');
    } else {
      setPendingCheckout(draft);
      setShowCart(false);
      setShowPaymentGateway(true);
    }
  };

  // 1-Click Reorder from Order History
  const handleReorder = (pastOrder) => {
    if (!pastOrder || !Array.isArray(pastOrder.items)) return;
    const clonedItems = pastOrder.items.map((it, idx) => ({
      ...it,
      id: `reorder-${pastOrder.id || 'ord'}-${idx}`,
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
          <strong>Fulfillment:</strong> ${order.fulfillment || '🏪 In-Café Pickup'}<br/>
          <strong>Payment:</strong> ${order.paymentMethod || '📱 UPI / QR Pay'} (${order.paymentStatus || 'Paid ✓'})<br/>
          <strong>Transaction Ref:</strong> #${order.transactionId || 'UPI-VERIFIED'}<br/>
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

  // Open Barista / Admin Hub and sync backend orders, reservations & live visitors
  const openAdminHub = async () => {
    setShowAdminModal(true);
    try {
      const [ordRes, resvRes, visRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/orders`),
        axios.get(`${API_BASE_URL}/api/reservations`),
        axios.get(`${API_BASE_URL}/api/visitors`),
      ]);
      if (ordRes.status === 'fulfilled' && Array.isArray(ordRes.value.data) && ordRes.value.data.length > 0) {
        setOrderHistory((prev) => {
          const remote = ordRes.value.data;
          const localOnly = prev.filter((loc) => !remote.some((rem) => String(rem.id) === String(loc.id)));
          return [...localOnly, ...remote];
        });
      }
      if (resvRes.status === 'fulfilled' && Array.isArray(resvRes.value.data) && resvRes.value.data.length > 0) {
        setReservationsList((prev) => {
          const remote = resvRes.value.data;
          const localOnly = prev.filter((loc) => !remote.some((rem) => String(rem.passId) === String(loc.passId)));
          return [...localOnly, ...remote];
        });
      }
      if (visRes.status === 'fulfilled' && visRes.value.data) {
        if (Array.isArray(visRes.value.data.visitors) && visRes.value.data.visitors.length > 0) {
          setVisitorsList(visRes.value.data.visitors);
        }
        if (Array.isArray(visRes.value.data.users) && visRes.value.data.users.length > 0) {
          setUsersList(visRes.value.data.users);
        }
        if (Array.isArray(visRes.value.data.subscribers) && visRes.value.data.subscribers.length > 0) {
          setSubscribersList(visRes.value.data.subscribers);
        }
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
    setConfirmedOrder((prev) =>
      prev && prev.id === orderId ? { ...prev, status: nextStatus } : prev
    );
    if (nextStatus === 'Ready!' && soundEnabled) {
      playBaristaBellChime();
    }
    try {
      await axios.patch(`${API_BASE_URL}/api/orders/${orderId}`, { status: nextStatus });
    } catch {
      // Updated locally
    }
    showToast(`Order #${orderId} marked as ${nextStatus} ${nextStatus === 'Ready!' ? '🔔' : ''}`);
  };

  // Add Digital Gift Card to Cart
  const handleAddGiftCard = (e) => {
    e.preventDefault();
    const tier = GIFT_CARD_TIERS.find((t) => t.amount === giftAmount) || GIFT_CARD_TIERS[1];
    const recipient = giftRecipientName.trim() || 'Coffee Friend';
    const noteText = giftMessage.trim() || tier.label;
    setCart((prev) => [
      ...prev,
      {
        id: `gift-${giftAmount}-${prev.length + 1}`,
        name: `🎁 $${giftAmount} Bean Scene Digital Gift Card (For: ${recipient})`,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        size: 'digital',
        milk: null,
        notes: noteText,
        unitPrice: giftAmount,
        price: giftAmount,
        quantity: 1,
      },
    ]);
    setGiftRecipientName('');
    setGiftRecipientEmail('');
    showToast(`Added $${giftAmount} Digital Gift Card for ${recipient} (+${tier.bonusPts} Bonus Pts on checkout)! 🎁`);
  };

  // Subscribe / Add Whole-Bean Roastery Box to Cart
  const handleAddBeanSubscription = (plan) => {
    const isDiscounted = beanSubFrequency.includes('15%');
    const finalPrice = isDiscounted ? Number((plan.price * 0.85).toFixed(2)) : plan.price;
    setCart((prev) => [
      ...prev,
      {
        id: `${plan.id}-${prev.length + 1}`,
        name: `${plan.name} (${beanSubFrequency})`,
        image: plan.image,
        size: 'regular',
        milk: null,
        notes: plan.bagSize,
        unitPrice: finalPrice,
        price: finalPrice,
        quantity: 1,
      },
    ]);
    showToast(`Added ${plan.name} (${beanSubFrequency}) to cart! 📦`);
  };

  // Create New Menu Item from Barista Hub
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;
    const categoryDefaultImg =
      newProdCategory === 'iced'
        ? 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'
        : newProdCategory === 'bakery'
        ? 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80';
    const payload = {
      name: newProdName.trim(),
      price: parseFloat(newProdPrice),
      category: newProdCategory,
      description: newProdDesc.trim() || 'Freshly handcrafted barista specialty',
      badge: newProdBadge.trim() || '✨ Barista Special',
      image: categoryDefaultImg,
      rating: 4.9,
      reviews: 1,
      popular: true,
      calories: 160,
      caffeine: newProdCategory === 'bakery' ? '0mg' : '150mg',
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/products`, payload);
      setProducts((prev) => {
        const next = [...prev, res.data];
        localStorage.setItem('beanSceneProducts', JSON.stringify(next));
        return next;
      });
    } catch {
      setProducts((prev) => {
        const next = [...prev, { ...payload, id: Date.now() }];
        localStorage.setItem('beanSceneProducts', JSON.stringify(next));
        return next;
      });
    }

    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    showToast(`Added "${payload.name}" to the live menu!`);
  };

  // Delete Menu Item from Barista Hub
  const handleDeleteProduct = async (id, name) => {
    try {
      const prevDeleted = JSON.parse(localStorage.getItem('beanSceneDeletedProductIds') || '[]');
      if (!prevDeleted.includes(id)) {
        localStorage.setItem('beanSceneDeletedProductIds', JSON.stringify([...prevDeleted, id]));
      }
    } catch {
      // Ignore storage errors
    }
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem('beanSceneProducts', JSON.stringify(next));
      return next;
    });
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
    } catch {
      // Removed locally
    }
    showToast(`Removed "${name}" from menu`);
  };

  // Reset Menu to all 30 Default Specialties
  const handleRestoreDefaultProducts = () => {
    localStorage.removeItem('beanSceneDeletedProductIds');
    localStorage.setItem('beanSceneProducts', JSON.stringify(DEFAULT_PRODUCTS));
    setProducts(DEFAULT_PRODUCTS);
    showToast(`Restored all ${DEFAULT_PRODUCTS.length} default menu items! 🔄`);
  };

  // Navbar horizontal scroll reference & controls + active nav highlight
  const [activeNavSection, setActiveNavSection] = useState('home');
  const navScrollRef = useRef(null);
  const handleNavScroll = (direction) => {
    if (!navScrollRef.current) return;
    navScrollRef.current.scrollBy({
      left: direction === 'left' ? -240 : 240,
      behavior: 'smooth',
    });
  };
  const handleNavWheelScroll = (e) => {
    if (!navScrollRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      navScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  useEffect(() => {
    const sectionIds = ['home', 'customizer', 'menu', 'brewguide', 'events', 'giftcards', 'visit', 'reviews'];
    const handleScrollSpy = () => {
      const scrollY = window.scrollY + 180;
      let current = 'home';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      setActiveNavSection(current);
    };
    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

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
          <button
            type="button"
            onClick={() => setShowVipModal(true)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(245, 208, 169, 0.45)',
              color: '#fff',
              borderRadius: 999,
              padding: '0.16rem 0.7rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            title="Click to open your 3D VIP Loyalty Membership Pass"
          >
            👑 VIP Pass: <strong>{beanPoints} pts</strong>
          </button>
        </div>

        <nav className="navbar">
          <a href="#home" className="logo">
            <span className="logo-emblem">☕</span>
            <span>Bean Scene</span>
          </a>

          <button
            type="button"
            className="nav-scroll-arrow"
            onClick={() => handleNavScroll('left')}
            title="Scroll navbar left"
            aria-label="Scroll navbar left"
          >
            ‹
          </button>

          <div
            className="nav-scroll-track"
            ref={navScrollRef}
            onWheel={handleNavWheelScroll}
          >
            {/* Desktop Links inside Glass Pill */}
            <ul className="nav-links">
              {[
                { id: 'home', label: 'Home' },
                { id: 'customizer', label: 'Cup Studio' },
                { id: 'menu', label: 'Menu' },
                { id: 'brewguide', label: 'Brew Lab' },
                { id: 'events', label: 'Events' },
                { id: 'giftcards', label: 'Gift Cards' },
                { id: 'visit', label: 'Visit Café' },
                { id: 'reviews', label: 'Reviews' },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={activeNavSection === item.id ? 'active' : ''}
                    onClick={() => setActiveNavSection(item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="nav-actions">
              <button
                type="button"
                className="nav-book-btn"
                onClick={cycleCurrency}
                title="Switch Store Currency ($ USD / ₹ INR / € EUR)"
              >
                {currObj.label}
              </button>

              <button
                type="button"
                className="nav-book-btn"
                onClick={() => setShowWellnessModal(true)}
                title="Open Personal Daily Caffeine & Hydration Wellness Tracker"
              >
                ⚡ {totalDailyCaffeine}mg
              </button>

              <button
                type="button"
                className="nav-book-btn"
                onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                title={theme === 'dark' ? 'Switch to Oat Milk Cream Light Theme' : 'Switch to Espresso Dark Theme'}
                aria-label="Toggle color theme"
              >
                {theme === 'dark' ? '☀️ Cream' : '🌙 Espresso'}
              </button>

              <button
                type="button"
                className="nav-book-btn"
                onClick={() => setShowVipModal(true)}
                title="Open 3D VIP Loyalty Membership Card & Tier Perks"
              >
                👑 VIP ({beanPoints})
              </button>

              <button
                type="button"
                className="nav-book-btn"
                onClick={handleInstallPwa}
                title="Install Bean Scene as a Desktop or Mobile App"
              >
                📲 Install App
              </button>

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
                type="button"
                className="nav-book-btn"
                onClick={() => setShowReactDevTools(true)}
                title="Open Built-In React DevTools Live State & Component Inspector"
                style={{ borderColor: 'rgba(56, 189, 248, 0.45)', color: '#38bdf8' }}
              >
                ⚛️ DevTools
              </button>

              {orderHistory.length > 0 && (
                <button
                  type="button"
                  className="nav-book-btn"
                  onClick={() => {
                    setConfirmedOrder(orderHistory[0]);
                    setShowOrderConfirmation(true);
                  }}
                  title="View live 4-stage preparation tracker for your latest order"
                  style={{ borderColor: 'rgba(74, 222, 128, 0.45)', color: '#4ade80' }}
                >
                  📦 Track #{orderHistory[0].id}
                </button>
              )}

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
            </div>
          </div>

          <button
            type="button"
            className="nav-scroll-arrow"
            onClick={() => handleNavScroll('right')}
            title="Scroll navbar right"
            aria-label="Scroll navbar right"
          >
            ›
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </nav>
      </header>

      {/* Mobile Nav Panel */}
      <div className={`mobile-nav-panel ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
        <a href="#customizer" onClick={() => setMobileMenuOpen(false)}>Cup Studio</a>
        <a href="#menu" onClick={() => setMobileMenuOpen(false)}>Menu</a>
        <a href="#brewguide" onClick={() => setMobileMenuOpen(false)}>Home Brew Lab</a>
        <a href="#events" onClick={() => setMobileMenuOpen(false)}>Roastery Events</a>
        <a href="#giftcards" onClick={() => setMobileMenuOpen(false)}>Gift Cards &amp; Beans</a>
        <a href="#visit" onClick={() => setMobileMenuOpen(false)}>Visit Café</a>
        <a href="#reviews" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.88rem' }}
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? '☀️ Oat Cream Mode' : '🌙 Espresso Dark Mode'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.88rem' }}
            onClick={() => {
              setMobileMenuOpen(false);
              setConfirmedReservation(null);
              setShowReserveModal(true);
            }}
          >
            🪑 Book a Table
          </button>
        </div>
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

      {/* HERO — BACKGROUND IMAGE + ANIMATED TEXT + STATS */}
      <section className="hero" id="home">
        <div className="hero-video-overlay" />

        <div className="hero-badge">☕ Premium Coffee &amp; Bakery • 🏆 {beanPoints} Bean Points</div>
        <h1>
          We've got your<br />
          <span className="hero-animated-word fade-in">
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
            <img
              src={products[reelIdx % products.length]?.image || DEFAULT_PRODUCTS[0].image}
              alt="Bean Scene Espresso Roastery Showcase"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.72)' }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getFallbackImage();
              }}
            />
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

        <div
          className="cup-studio-card"
          style={{
            backgroundImage:
              "linear-gradient(145deg, rgba(20, 14, 34, 0.84) 0%, rgba(13, 10, 22, 0.88) 100%), radial-gradient(circle at 22% 25%, rgba(192, 132, 252, 0.25), transparent 65%), url('https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1500&q=85')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Live Layered Glass Visualization */}
          <div
            className="cup-preview-stage"
            style={{
              backgroundImage:
                "linear-gradient(160deg, rgba(16, 12, 26, 0.82) 0%, rgba(11, 8, 18, 0.88) 100%), radial-gradient(circle at 50% 35%, rgba(245, 208, 169, 0.16), transparent 65%), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
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
                ⚡ +1 Shot (+{formatPrice(0.85)})
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
              <span className="macro-badge">💲 {formatPrice(customCupPrice)}</span>
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
                    {b.label} ({formatPrice(b.price)})
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
                    {m.label} {m.price > 0 ? `(+${formatPrice(m.price)})` : '(Free)'}
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
                    {s.label} {s.price > 0 ? `(+${formatPrice(s.price)})` : ''}
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
                    {t.label} (+{formatPrice(t.price)})
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
                ⚡ Order Cup ({formatPrice(customCupPrice)})
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
                  <strong style={{ fontSize: '0.85rem', color: 'var(--warm)' }}>{formatPrice(sc.price)}</strong>
                  <button
                    type="button"
                    className="order-btn"
                    style={{ padding: '0.28rem 0.7rem', fontSize: '0.75rem' }}
                    onClick={() => {
                      setCart((prev) => [...prev, { ...sc, id: `saved-${prev.length + 1}` }]);
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
        <div
          className="mood-matcher-box"
          style={{
            backgroundImage:
              "linear-gradient(145deg, rgba(20, 14, 34, 0.82) 0%, rgba(14, 11, 22, 0.86) 100%), radial-gradient(ellipse at 50% 0%, rgba(192, 132, 252, 0.26) 0%, transparent 65%), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
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
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{formatPrice(moodDrink.price)}</span>
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
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{formatPrice(moodFood.price)}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginRight: '0.4rem' }}>
                    {formatPrice(moodDrink.price + moodFood.price)}
                  </span>
                  <strong style={{ fontSize: '1.35rem', color: 'var(--warm)' }}>
                    {formatPrice((moodDrink.price + moodFood.price) * 0.9)}
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

        {/* Dietary & Nutrition Quick-Filter Chips */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
          {[
            { key: 'all', label: '✨ All Macros' },
            { key: 'bestseller', label: '🔥 Best Sellers Only' },
            { key: 'low-cal', label: '🍃 Light (≤ 140 kcal)' },
            { key: 'high-caffeine', label: '⚡ High Caffeine (155mg+)' },
          ].map((df) => (
            <button
              key={df.key}
              type="button"
              className={`mood-pill-btn ${dietFilter === df.key ? 'active' : ''}`}
              style={{ padding: '0.35rem 0.9rem', fontSize: '0.78rem' }}
              onClick={() => setDietFilter(df.key)}
            >
              {df.label}
            </button>
          ))}
        </div>

        {/* Cards Grid or No Results */}
        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <span>😔</span>
            <p>No items match your current filter</p>
            <button
              className="btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setDietFilter('all');
              }}
            >
              Clear All Filters
            </button>
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
                      <button
                        type="button"
                        className="spec-pill origin-passport-trigger"
                        onClick={() => setPassportProduct(product)}
                        title="View Farm-to-Cup Origin & Brew Specs Passport"
                      >
                        🌍 Origin Passport
                      </button>
                    </div>
                    <div className="card-footer">
                      <span className="price">{formatPrice(product.price)}</span>
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
                          aria-label={`Order ${product.name} for ${formatPrice(product.price)}`}
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

      {/* 1. INTERACTIVE HOME BREW TIMER & BARISTA RECIPE GUIDE (#brewguide) */}
      <section className="section" id="brewguide" style={{ paddingTop: 20 }}>
        <div className="section-header">
          <span className="modal-badge">Barista Home Brewing Lab</span>
          <h2>⏱️ Interactive Home Brew Timer &amp; Recipe Guide</h2>
          <p>Master specialty extraction at home with precision coffee-to-water ratios and a live step-by-step pour timer</p>
        </div>

        {/* Brew Method Selector Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {BREW_GUIDES.map((bg) => (
            <button
              key={bg.id}
              type="button"
              className={`mood-pill-btn ${selectedBrewId === bg.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedBrewId(bg.id);
                setBrewTimerRunning(false);
                setBrewTimerSec(0);
              }}
            >
              {bg.name}
            </button>
          ))}
        </div>

        {(() => {
          const progressPct = Math.min(100, Math.round((brewTimerSec / activeBrewGuide.totalSec) * 100));
          const currentStep =
            activeBrewGuide.steps.find((st) => brewTimerSec >= st.startSec && brewTimerSec < st.endSec) ||
            activeBrewGuide.steps[activeBrewGuide.steps.length - 1];
          const fmtSec = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
          const recProduct = products.find((p) => p.id === activeBrewGuide.recommendedBeanId) || products[0];

          return (
            <div className="brew-lab-grid">
              {/* Left Column: Live Circular Pour Timer */}
              <div className="mood-matcher-box brew-timer-stage" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '0.75rem' }}>
                  <span className="modal-badge" style={{ marginBottom: 0 }}>Live Extraction Clock</span>
                  <span className="spec-pill">Target: {fmtSec(activeBrewGuide.totalSec)}</span>
                </div>

                <div
                  className="brew-timer-dial"
                  style={{
                    background: `conic-gradient(var(--accent) ${progressPct * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                  }}
                >
                  <div className="brew-timer-dial-inner">
                    <span style={{ fontSize: '1.5rem' }}>{activeBrewGuide.icon}</span>
                    <div className="brew-timer-digits">{fmtSec(brewTimerSec)}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--warm)', fontWeight: 700 }}>
                      {brewTimerSec >= activeBrewGuide.totalSec
                        ? '🎉 Brew Complete!'
                        : brewTimerRunning
                        ? '💧 Pouring Live...'
                        : 'Ready to Brew'}
                    </span>
                  </div>
                </div>

                <div className="brew-active-step-banner">
                  <strong style={{ color: 'var(--warm)', fontSize: '0.9rem', display: 'block', marginBottom: '0.2rem' }}>
                    {currentStep.label}
                  </strong>
                  <p style={{ color: '#e2e8f0', fontSize: '0.8rem', margin: 0 }}>{currentStep.tip}</p>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', width: '100%', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ flex: 1.5, justifyContent: 'center', padding: '0.7rem 1.2rem', fontSize: '0.9rem' }}
                    onClick={() => {
                      if (brewTimerSec >= activeBrewGuide.totalSec) {
                        setBrewTimerSec(0);
                        setBrewTimerRunning(true);
                      } else {
                        setBrewTimerRunning((r) => !r);
                      }
                    }}
                  >
                    {brewTimerRunning
                      ? '⏸ Pause Timer'
                      : brewTimerSec >= activeBrewGuide.totalSec
                      ? '🔄 Restart Pour'
                      : '▶ Start Live Pour Timer'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 0.7, justifyContent: 'center', padding: '0.7rem 1rem', fontSize: '0.86rem' }}
                    onClick={() => {
                      setBrewTimerRunning(false);
                      setBrewTimerSec(0);
                    }}
                  >
                    ↺ Reset
                  </button>
                </div>
              </div>

              {/* Right Column: Precision Barista Ratios & 3-Stage Steps */}
              <div className="mood-matcher-box" style={{ marginBottom: 0 }}>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.35rem' }}>
                  {activeBrewGuide.name} Master Recipe
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '1rem' }}>
                  Calibrated by Bean Scene Q-Graders for peak sweetness, clarity, and aromatic balance.
                </p>

                <div className="passport-specs-grid" style={{ marginBottom: '1.1rem' }}>
                  <div className="passport-spec-box">
                    <span>⚖️ Golden Ratio</span>
                    <strong>{activeBrewGuide.ratio} ({activeBrewGuide.coffeeG}g : {activeBrewGuide.waterMl}ml)</strong>
                  </div>
                  <div className="passport-spec-box">
                    <span>🌡️ Water Temp</span>
                    <strong>{activeBrewGuide.temp}</strong>
                  </div>
                  <div className="passport-spec-box">
                    <span>⚙️ Grind Size</span>
                    <strong>{activeBrewGuide.grind}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.15rem' }}>
                  {activeBrewGuide.steps.map((st, idx) => {
                    const isCurrent = brewTimerSec >= st.startSec && brewTimerSec < st.endSec;
                    const isDone = brewTimerSec >= st.endSec;
                    return (
                      <div
                        key={idx}
                        className={`brew-step-row ${isCurrent ? 'active' : ''} ${isDone ? 'done' : ''}`}
                        onClick={() => setBrewTimerSec(st.startSec)}
                        title="Click to jump timer to this stage"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <strong style={{ color: isCurrent ? 'var(--warm)' : '#fff', fontSize: '0.88rem' }}>
                            {isDone ? '✓ ' : ''}{st.label}
                          </strong>
                          <span className="spec-pill" style={{ fontSize: '0.72rem' }}>
                            {fmtSec(st.startSec)} – {fmtSec(st.endSec)}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.79rem', margin: 0 }}>{st.tip}</p>
                      </div>
                    );
                  })}
                </div>

                {recProduct && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.9rem',
                      borderRadius: 14,
                      background: 'rgba(192, 132, 252, 0.1)',
                      border: '1px solid rgba(192, 132, 252, 0.3)',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--warm)', fontWeight: 700, display: 'block' }}>
                        🏆 BARISTA PAIRED CUP FOR THIS METHOD
                      </span>
                      <strong style={{ color: '#fff', fontSize: '0.9rem' }}>
                        {recProduct.name} ({formatPrice(recProduct.price)})
                      </strong>
                    </div>
                    <button
                      type="button"
                      className="order-btn"
                      style={{ padding: '0.38rem 0.85rem', fontSize: '0.78rem' }}
                      onClick={() => handleQuickAdd(recProduct)}
                    >
                      + Order Cup
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </section>

      {/* 3. ROASTERY EVENTS, CUPPING WORKSHOPS & LATTE ART MASTERCLASSES (#events) */}
      <section className="section" id="events" style={{ paddingTop: 20 }}>
        <div className="section-header">
          <span className="modal-badge">Community &amp; Coffee Academy</span>
          <h2>🎓 Roastery Events &amp; Barista Workshops</h2>
          <p>Reserve your spot for hands-on latte art training, rare single-origin cuppings, and acoustic vinyl nights</p>
        </div>

        <div className="events-grid">
          {ROASTERY_EVENTS.map((evt) => {
            const isBooked = bookedEventIds.includes(evt.id);
            const remaining = Math.max(1, evt.spotsLeft - (isBooked ? 1 : 0));
            return (
              <div key={evt.id} className="menu-card event-workshop-card">
                <div className="menu-card-img-wrap" style={{ height: 195 }}>
                  <img src={evt.image} alt={evt.title} className="menu-card-img" />
                  <span
                    className="popular-badge"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}
                  >
                    {evt.badge}
                  </span>
                </div>
                <div className="menu-card-body">
                  <span style={{ fontSize: '0.76rem', color: 'var(--warm)', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                    📅 {evt.date}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.3rem' }}>{evt.title}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600, display: 'block', marginBottom: '0.6rem' }}>
                    🎙️ Hosted by {evt.host}
                  </span>
                  <p style={{ fontSize: '0.84rem', marginBottom: '0.85rem' }}>{evt.desc}</p>

                  <div className="card-spec-pills" style={{ marginBottom: '1rem' }}>
                    {evt.perks.map((pk) => (
                      <span key={pk} className="spec-pill" style={{ fontSize: '0.72rem' }}>
                        {pk}
                      </span>
                    ))}
                  </div>

                  <div className="card-footer">
                    <div>
                      <span className="price" style={{ display: 'block' }}>{formatPrice(evt.price)}</span>
                      <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 700 }}>
                        🟢 {remaining} seats available
                      </span>
                    </div>
                    <button
                      type="button"
                      className={isBooked ? 'btn-secondary' : 'order-btn'}
                      style={{ padding: '0.5rem 1.05rem', fontSize: '0.82rem' }}
                      onClick={() => handleBookEventWorkshop(evt)}
                    >
                      {isBooked ? '✓ Seat Added (+1 More)' : '🎟️ Book Workshop'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DIGITAL COFFEE GIFT CARDS & MONTHLY WHOLE-BEAN SUBSCRIPTION BOX (#giftcards) */}
      <section className="section" id="giftcards" style={{ paddingTop: 20 }}>
        <div className="section-header">
          <span className="modal-badge">Roastery Club &amp; Gifting</span>
          <h2>🎁 Digital Gift Cards &amp; Bean Subscriptions</h2>
          <p>Treat a fellow coffee lover to an instant Digital Gift Card or get fresh single-origin beans delivered</p>
        </div>

        <div className="gift-sub-grid">
          {/* Left Card: Interactive Digital Gift Card Builder */}
          <div
            className="mood-matcher-box gift-card-builder-box"
            style={{
              marginBottom: 0,
              backgroundImage:
                "linear-gradient(145deg, rgba(20, 14, 34, 0.84) 0%, rgba(14, 11, 22, 0.88) 100%), radial-gradient(ellipse at 85% 0%, rgba(192, 132, 252, 0.25) 0%, transparent 65%), url('https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=85')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <span className="modal-badge">Instant Digital Delivery</span>
            <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.4rem' }}>
              💳 Send a Bean Scene Gift Card
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.1rem' }}>
              Choose an amount, personalize your card, and earn bonus Bean Points automatically!
            </p>

            {/* Live Gift Card Preview */}
            <div
              className="digital-gift-card-preview"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 85% 20%, rgba(245, 208, 169, 0.28), transparent 50%), linear-gradient(135deg, rgba(43, 22, 68, 0.82) 0%, rgba(76, 29, 149, 0.78) 52%, rgba(157, 23, 77, 0.82) 100%), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: 0.5 }}>☕ BEAN SCENE</span>
                <span className="spec-pill" style={{ background: 'rgba(255,255,255,0.16)', color: '#fff' }}>
                  {GIFT_CARD_TIERS.find((t) => t.amount === giftAmount)?.label}
                </span>
              </div>
              <div style={{ margin: '1.15rem 0 0.85rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1.4, opacity: 0.8 }}>
                  Digital Coffee Balance
                </span>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--warm)', lineHeight: 1.1 }}>
                  ${giftAmount}.00
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ opacity: 0.75, display: 'block', fontSize: '0.72rem' }}>TO RECIPIENT</span>
                  <strong>{giftRecipientName.trim() || 'Your Coffee Friend'}</strong>
                </div>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>
                  +{GIFT_CARD_TIERS.find((t) => t.amount === giftAmount)?.bonusPts} Bonus Pts
                </span>
              </div>
            </div>

            {/* Tier Selector Buttons */}
            <div className="pill-group" style={{ marginBottom: '1rem' }}>
              {GIFT_CARD_TIERS.map((tier) => (
                <button
                  key={tier.amount}
                  type="button"
                  className={`mood-pill-btn ${giftAmount === tier.amount ? 'active' : ''}`}
                  style={{ flex: 1, justifyContent: 'center', padding: '0.5rem 0.75rem', fontSize: '0.86rem' }}
                  onClick={() => setGiftAmount(tier.amount)}
                >
                  ${tier.amount} (+{tier.bonusPts} pts)
                </button>
              ))}
            </div>

            <form onSubmit={handleAddGiftCard}>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Recipient Name</label>
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="e.g. Priya Sharma"
                    value={giftRecipientName}
                    onChange={(e) => setGiftRecipientName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label className="form-label">Recipient Email (Optional)</label>
                  <input
                    type="email"
                    className="modal-input"
                    placeholder="friend@email.com"
                    value={giftRecipientEmail}
                    onChange={(e) => setGiftRecipientEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Personal Note</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Write a warm note..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                🎁 Add ${giftAmount} Gift Card to Cart
              </button>
            </form>
          </div>

          {/* Right Card: Monthly / Weekly Whole-Bean Roastery Subscription Box */}
          <div
            className="mood-matcher-box bean-subscription-box"
            style={{
              marginBottom: 0,
              backgroundImage:
                "linear-gradient(145deg, rgba(20, 14, 34, 0.84) 0%, rgba(14, 11, 22, 0.88) 100%), radial-gradient(ellipse at 15% 0%, rgba(245, 208, 169, 0.2) 0%, transparent 65%), url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=85')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="modal-badge" style={{ marginBottom: 0 }}>Small-Batch Roastery Delivery</span>
              <span style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: 700 }}>🚚 Free Express Shipping</span>
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.4rem' }}>
              📦 Whole-Bean Subscription Box
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Roasted to order every Monday morning and shipped straight to your home espresso bar.
            </p>

            {/* Delivery Frequency Toggle */}
            <div className="pill-group" style={{ marginBottom: '1.1rem' }}>
              {['Weekly (Save 15%)', 'Bi-Weekly (Save 15%)', 'One-Time Bag'].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  className={`mood-pill-btn ${beanSubFrequency === freq ? 'active' : ''}`}
                  style={{ flex: 1, justifyContent: 'center', padding: '0.42rem 0.65rem', fontSize: '0.78rem' }}
                  onClick={() => setBeanSubFrequency(freq)}
                >
                  {freq}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {BEAN_SUBSCRIPTION_PLANS.map((plan) => {
                const discounted = beanSubFrequency.includes('15%');
                const displayPrice = discounted ? (plan.price * 0.85).toFixed(2) : plan.price.toFixed(2);
                return (
                  <div key={plan.id} className="bean-sub-plan-row">
                    <img
                      src={plan.image}
                      alt={plan.name}
                      style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <strong style={{ color: '#fff', fontSize: '0.94rem' }}>{plan.name}</strong>
                        <span className="spec-pill" style={{ fontSize: '0.7rem', padding: '0.12rem 0.5rem' }}>{plan.badge}</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.79rem', margin: '0.18rem 0' }}>{plan.roast}</p>
                      <span style={{ color: 'var(--warm)', fontSize: '0.76rem', fontWeight: 600 }}>{plan.bagSize}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {discounted && (
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textDecoration: 'line-through', display: 'block' }}>
                          ${plan.price.toFixed(2)}
                        </span>
                      )}
                      <strong style={{ color: 'var(--warm)', fontSize: '1.1rem', display: 'block', marginBottom: '0.3rem' }}>
                        ${displayPrice}
                      </strong>
                      <button
                        type="button"
                        className="order-btn"
                        style={{ padding: '0.32rem 0.8rem', fontSize: '0.76rem' }}
                        onClick={() => handleAddBeanSubscription(plan)}
                      >
                        + Subscribe
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER LOVE / REVIEWS SECTION */}
      <section className="section reviews-section-highlight" id="reviews" style={{ paddingTop: 20 }}>
        <div
          className="reviews-showcase-shell"
          style={{
            backgroundImage:
              "linear-gradient(145deg, rgba(20, 14, 34, 0.84) 0%, rgba(13, 10, 22, 0.88) 100%), radial-gradient(ellipse at 50% 0%, rgba(192, 132, 252, 0.28) 0%, transparent 65%), url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=85')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="section-header" style={{ marginBottom: '1.8rem' }}>
            <span className="modal-badge">★ 4.9/5 Verified Guest Reviews</span>
            <h2 className="reviews-highlight-title">Loved by Coffee Lovers</h2>
            <p style={{ color: '#e9d5ff', fontWeight: 500 }}>
              Over <strong style={{ color: 'var(--warm)' }}>5,000+ handcrafted cups</strong> served with a{' '}
              <strong style={{ color: '#fbbf24' }}>4.9★ community rating</strong>
            </p>
            <div style={{ marginTop: '1.15rem' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '0.62rem 1.45rem', fontSize: '0.9rem' }}
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
              <div
                key={i}
                className="testimonial-card"
                style={{
                  backgroundImage:
                    "linear-gradient(155deg, rgba(28, 20, 46, 0.88) 0%, rgba(17, 13, 28, 0.92) 100%), radial-gradient(circle at 85% 15%, rgba(245, 208, 169, 0.18), transparent 55%), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <StarRating rating={t.rating} />
                  <span className="review-verified-pill">✓ Verified Guest</span>
                </div>
                <p className="testimonial-quote-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{(t.name || 'G')[0]}</div>
                  <div>
                    <strong className="testimonial-author-name">{t.name}</strong>
                    <span className="testimonial-author-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAFÉ LOCATION, OPENING HOURS & INTERACTIVE STORE FINDER SECTION (#visit) */}
      <section className="section" id="visit" style={{ paddingTop: 10 }}>
        <div className="section-header">
          <span className="modal-badge">Flagship Roastery &amp; Lounge</span>
          <h2>📍 Visit Our Café &amp; Roastery</h2>
          <p>Drop by for freshly pulled espresso, high-speed fiber Wi-Fi, or cozy patio seating</p>
        </div>

        {/* Branch Switcher Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {CAFE_BRANCHES.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`mood-pill-btn ${activeBranchId === b.id ? 'active' : ''}`}
              onClick={() => setActiveBranchId(b.id)}
            >
              📍 {b.name}
            </button>
          ))}
        </div>

        {(() => {
          const branch = CAFE_BRANCHES.find((b) => b.id === activeBranchId) || CAFE_BRANCHES[0];
          return (
            <div
              className="store-finder-card"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(20, 14, 32, 0.84) 0%, rgba(14, 11, 22, 0.88) 100%), radial-gradient(ellipse at 20% 0%, rgba(192, 132, 252, 0.22) 0%, transparent 65%), url('${branch.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="store-finder-details">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                  <span
                    style={{
                      background: 'rgba(74, 222, 128, 0.14)',
                      border: '1px solid rgba(74, 222, 128, 0.4)',
                      color: '#4ade80',
                      padding: '0.25rem 0.75rem',
                      borderRadius: 999,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    {branch.status}
                  </span>
                  <span className="spec-pill">{branch.wifi}</span>
                </div>

                <h3 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>
                  {branch.name}
                </h3>
                <p style={{ color: 'var(--warm)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.9rem' }}>
                  📍 {branch.address}
                </p>

                <div className="store-hours-grid">
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem', display: 'block' }}>OPENING HOURS</span>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>🕒 {branch.hours}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem', display: 'block' }}>DIRECT ROASTERY LINE</span>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>📞 {branch.phone}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1.1rem 0 1.35rem' }}>
                  {branch.features.map((feat) => (
                    <span key={feat} className="spec-pill" style={{ padding: '0.32rem 0.75rem', fontSize: '0.78rem' }}>
                      {feat}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setConfirmedReservation(null);
                      setShowReserveModal(true);
                    }}
                  >
                    🪑 Reserve Table Here
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${branch.mapQuery}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{ textDecoration: 'none' }}
                  >
                    🗺️ Get Directions ↗
                  </a>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      navigator.clipboard?.writeText(branch.address);
                      showToast(`Copied "${branch.address}" to clipboard! 📍`);
                    }}
                  >
                    📋 Copy Address
                  </button>
                </div>
              </div>

              {/* Interactive Visual Roastery Map Preview */}
              <div
                className="store-map-visual"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(15, 12, 24, 0.15) 0%, rgba(15, 12, 24, 0.72) 100%), url('${branch.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="store-map-overlay-card">
                  <div className="map-pin-pulse">☕</div>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.92rem', display: 'block' }}>{branch.name}</strong>
                    <span style={{ color: 'var(--warm)', fontSize: '0.78rem' }}>⚡ 5-Min Pickup Lane Active</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* SUBSCRIBE SECTION */}
      <section id="subscribe">
        <div
          className="subscribe"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(20, 12, 30, 0.76) 0%, rgba(13, 10, 20, 0.72) 100%), radial-gradient(ellipse at 50% 0%, rgba(192, 132, 252, 0.28) 0%, transparent 65%), url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1400&q=85')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
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
            ⚡ Open Barista Hub
          </button>
          {' • '}
          <Link
            to="/admin"
            style={{
              color: 'var(--warm)',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'underline',
            }}
          >
            🛠️ Full Admin Dashboard →
          </Link>
          {' • '}
          <button
            type="button"
            onClick={() => setShowReactDevTools(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'underline',
            }}
          >
            ⚛️ React DevTools Inspector
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

      {/* FLOATING AI BARISTA CONCIERGE BUTTON & CHAT DRAWER */}
      <button
        type="button"
        className="floating-ai-btn"
        onClick={() => setShowAiChat((prev) => !prev)}
      >
        🤖 {showAiChat ? 'Close AI Barista' : 'Ask AI Barista'}
      </button>

      {showAiChat && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div>
              <strong style={{ color: '#fff', fontSize: '0.92rem', display: 'block' }}>🤖 Bean Scene AI Barista</strong>
              <span style={{ color: '#4ade80', fontSize: '0.74rem', fontWeight: 600 }}>
                {isListeningVoice ? '🎙️ Listening to your voice...' : '● Online • Voice & Text Sommelier'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  const next = !voiceSpeakEnabled;
                  setVoiceSpeakEnabled(next);
                  if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--border)',
                  color: voiceSpeakEnabled ? '#4ade80' : 'var(--text-muted)',
                  borderRadius: 999,
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                title="Toggle AI Voice Speech Output"
              >
                {voiceSpeakEnabled ? '🔊 Voice On' : '🔇 Muted'}
              </button>
              <button
                type="button"
                className="modal-close"
                style={{ width: 28, height: 28, fontSize: '0.8rem' }}
                onClick={() => setShowAiChat(false)}
              >
                ✕
              </button>
            </div>
          </div>

          <div className="ai-chat-messages">
            {aiMessages.map((m, idx) => (
              <div key={idx} className={`ai-msg-bubble ${m.sender}`}>
                <div>{m.text}</div>
                {Array.isArray(m.products) && m.products.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.55rem' }}>
                    {m.products.map((prod) => (
                      <div
                        key={prod.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.4rem 0.6rem',
                          background: 'rgba(0,0,0,0.28)',
                          borderRadius: 10,
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <div style={{ fontSize: '0.78rem' }}>
                          <strong style={{ color: '#fff', display: 'block' }}>{prod.name}</strong>
                          <span style={{ color: 'var(--warm)' }}>
                            ${prod.price.toFixed(2)} • {prod.calories} kcal • {prod.caffeine}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="order-btn"
                          style={{ padding: '0.26rem 0.65rem', fontSize: '0.74rem', whiteSpace: 'nowrap' }}
                          onClick={() => handleQuickAdd(prod)}
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="ai-quick-chips">
            {[
              { label: '🔥 Best Sellers', q: 'Best Sellers' },
              { label: '🍃 Under 120 kcal', q: 'Low calorie drinks' },
              { label: '⚡ Max Caffeine', q: 'Highest caffeine' },
              { label: '🌱 Oat / Matcha', q: 'Oat milk & Matcha' },
              { label: '🎟️ 25% Promo', q: 'Unlock promo code' },
              { label: '📦 Track Order', q: 'Track my order' },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                className="ai-chip-btn"
                onClick={() => handleAiAsk(chip.q)}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <form
            className="ai-chat-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              handleAiAsk(aiInput);
            }}
          >
            <button
              type="button"
              onClick={handleStartVoiceOrder}
              className={`ai-mic-btn ${isListeningVoice ? 'listening' : ''}`}
              title="Speak your order or question to the AI Barista"
              aria-label="Voice order microphone"
            >
              {isListeningVoice ? '🛑' : '🎤'}
            </button>
            <input
              type="text"
              className="modal-input"
              style={{ padding: '0.5rem 0.8rem', fontSize: '0.82rem', flex: 1 }}
              placeholder={isListeningVoice ? 'Listening... speak now!' : 'Ask or click 🎤 to speak order...'}
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '0.5rem 0.95rem', fontSize: '0.82rem' }}
            >
              Send
            </button>
          </form>
        </div>
      )}

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
                <p className="modal-desc">1. Select your seating zone or click any live table on the Café Floor Plan below:</p>
                <div className="zone-grid">
                  {CAFE_ZONES.map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      className={`zone-card-btn ${reserveZone === z.id ? 'active' : ''}`}
                      onClick={() => {
                        setReserveZone(z.id);
                        const firstAvail = CAFE_FLOOR_TABLES.find((t) => t.zone === z.id && t.status === 'available');
                        if (firstAvail) setSelectedTableId(firstAvail.id);
                      }}
                    >
                      <strong>{z.title}</strong>
                      <span>{z.desc}</span>
                    </button>
                  ))}
                </div>

                {/* 2. Interactive Visual Café Floor Plan & Seat Picker */}
                <div className="floor-plan-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem' }}>
                    <strong style={{ color: '#fff', fontSize: '0.84rem' }}>
                      🗺️ Live Roastery Floor Map — Selected: <span style={{ color: 'var(--warm)' }}>Table {selectedTableId}</span>
                    </strong>
                    <div style={{ display: 'flex', gap: '0.65rem', fontSize: '0.72rem' }}>
                      <span style={{ color: '#4ade80' }}>🟢 Available</span>
                      <span style={{ color: 'var(--accent)' }}>🟣 Selected</span>
                      <span style={{ color: '#f87171' }}>🔴 Occupied</span>
                    </div>
                  </div>
                  <div className="floor-plan-grid">
                    {CAFE_FLOOR_TABLES.map((tbl) => {
                      const isOcc = tbl.status === 'occupied';
                      const isSel = selectedTableId === tbl.id;
                      return (
                        <button
                          key={tbl.id}
                          type="button"
                          disabled={isOcc}
                          className={`floor-table-node ${isSel ? 'selected' : ''} ${isOcc ? 'occupied' : ''}`}
                          onClick={() => {
                            setSelectedTableId(tbl.id);
                            setReserveZone(tbl.zone);
                            setReserveGuests(`${tbl.seats} Guest${tbl.seats > 1 ? 's' : ''}`);
                          }}
                          title={`${tbl.label} (${tbl.seats} seats • ${tbl.perk})`}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.73rem', fontWeight: 800 }}>
                            <span>{tbl.id}</span>
                            <span>{isOcc ? '🔴' : isSel ? '✓' : `🪑×${tbl.seats}`}</span>
                          </div>
                          <span style={{ fontSize: '0.68rem', color: isSel ? '#fff' : 'var(--text-muted)', display: 'block', marginTop: '0.15rem', textAlign: 'left' }}>
                            {tbl.perk}
                          </span>
                        </button>
                      );
                    })}
                  </div>
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
              {/* Size Selection (for coffee & iced beverages) */}
              {!isBakeryItem && (
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
                      <span>Regular (12oz)</span>
                    </label>
                    <label className="pill-option">
                      <input
                        type="radio"
                        name="modal-size"
                        value="large"
                        checked={orderSize === 'large'}
                        onChange={() => setOrderSize('large')}
                      />
                      <span>Large 16oz (+$0.80)</span>
                    </label>
                  </div>
                </div>
              )}

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

              {/* Customer / Table Number & Fulfillment Mode */}
              <div className="form-row">
                <div className="form-group flex-1">
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
                <div className="form-group flex-1">
                  <label className="form-label">Service Mode</label>
                  <select
                    className="modal-input"
                    value={orderFulfillment}
                    onChange={(e) => setOrderFulfillment(e.target.value)}
                  >
                    <option value="🏪 In-Café Pickup">🏪 In-Café Pickup</option>
                    <option value="🪑 Dine-In Table">🪑 Dine-In Table</option>
                    <option value="🛵 Express Delivery">🛵 Express Delivery</option>
                  </select>
                </div>
              </div>

              {/* Scheduled Pre-Order Pickup Slot Selector */}
              <div className="form-group">
                <label className="form-label">🕒 Scheduled Pickup / Arrival Time Slot</label>
                <select
                  className="modal-input"
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                >
                  {PICKUP_TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <div className="pill-group">
                  {['📱 UPI / QR Pay', '💳 Card', '💵 Pay at Counter'].map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      className={`mood-pill-btn ${paymentMethod === pm ? 'active' : ''}`}
                      style={{ padding: '0.38rem 0.85rem', fontSize: '0.8rem' }}
                      onClick={() => setPaymentMethod(pm)}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <div className="modal-total">
                  <span className="total-label">Total Amount</span>
                  <span className="total-amount">{formatPrice(modalTotalPrice)}</span>
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

      {/* INTERACTIVE UPI QR CODE & CARD PAYMENT GATEWAY MODAL */}
      {showPaymentGateway && pendingCheckout && (
        <div className="modal-backdrop" onClick={() => !verifyingPayment && setShowPaymentGateway(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-badge">🔒 256-Bit SSL Encrypted Checkout</span>
                <h3 className="modal-title">Bean Scene Payment Gateway</h3>
              </div>
              <button
                type="button"
                className="modal-close"
                disabled={verifyingPayment}
                onClick={() => setShowPaymentGateway(false)}
              >
                ✕
              </button>
            </div>

            {/* Order Total & Service Summary Bar */}
            <div
              className="order-summary-box"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
              }}
            >
              <div>
                <strong style={{ color: '#fff', fontSize: '0.92rem', display: 'block' }}>
                  {pendingCheckout.customer} • {orderFulfillment}
                </strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  {pendingCheckout.items.length} item(s) • Merchant: Bean Scene Roastery
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>Payable</span>
                <strong style={{ fontSize: '1.35rem', color: '#4ade80' }}>${pendingCheckout.total.toFixed(2)}</strong>
              </div>
            </div>

            {/* Payment Method Switcher inside Gateway */}
            <div className="pill-group" style={{ marginBottom: '1.1rem' }}>
              {['📱 UPI / QR Pay', '💳 Card', '💵 Pay at Counter'].map((pm) => (
                <button
                  key={pm}
                  type="button"
                  className={`mood-pill-btn ${paymentMethod === pm ? 'active' : ''}`}
                  style={{ flex: 1, justifyContent: 'center', padding: '0.45rem 0.7rem', fontSize: '0.8rem' }}
                  onClick={() => setPaymentMethod(pm)}
                >
                  {pm}
                </button>
              ))}
            </div>

            {paymentMethod === '📱 UPI / QR Pay' && (
              <form onSubmit={handleVerifyGatewayPayment} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    background: '#fff',
                    padding: '0.95rem',
                    borderRadius: 18,
                    width: 196,
                    height: 196,
                    margin: '0 auto 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
                  }}
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=175x175&data=${encodeURIComponent(
                      `upi://pay?pa=beanscene@upi&pn=BeanSceneCafe&am=${pendingCheckout.total.toFixed(2)}&cu=USD`
                    )}`}
                    alt="Bean Scene UPI Payment QR Code"
                    style={{ width: 172, height: 172, borderRadius: 8 }}
                  />
                </div>

                <p style={{ fontSize: '0.83rem', color: 'var(--warm)', fontWeight: 600, marginBottom: '0.45rem' }}>
                  Scan QR with any UPI App to pay ${pendingCheckout.total.toFixed(2)}
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.95rem' }}>
                  {['GPay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                    <span
                      key={app}
                      style={{
                        fontSize: '0.73rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#e2e8f0',
                        fontWeight: 600,
                      }}
                    >
                      ✓ {app}
                    </span>
                  ))}
                </div>

                <div className="form-group" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                  <label className="form-label">Or Enter Your UPI ID (Optional)</label>
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="e.g. username@okaxis or 9876543210@ybl"
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={verifyingPayment}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {verifyingPayment
                    ? '⏳ Verifying UPI Transaction...'
                    : `✅ Verify & Pay $${pendingCheckout.total.toFixed(2)}`}
                </button>
              </form>
            )}

            {paymentMethod === '💳 Card' && (
              <form onSubmit={handleVerifyGatewayPayment}>
                {/* Visual 3D Glass Card Preview */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #2e1a47 0%, #4c1d95 55%, #be185d 100%)',
                    borderRadius: 18,
                    padding: '1.1rem 1.3rem',
                    marginBottom: '1rem',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 14px 32px rgba(0,0,0,0.45)',
                    color: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
                    <span style={{ fontSize: '0.75rem', letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.85 }}>
                      Bean Scene Platinum Pay
                    </span>
                    <span style={{ fontSize: '1.1rem' }}>💳</span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.12rem', letterSpacing: 2, marginBottom: '0.85rem' }}>
                    {cardNumber.trim() || '4532 •••• •••• 8891'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', opacity: 0.9 }}>
                    <span>{(cardHolder || pendingCheckout.customer || 'COFFEE LOVER').toUpperCase()}</span>
                    <span>EXP {cardExpiry || '08/29'}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="Name on card"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="4532 1234 5678 8891"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const grouped = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
                      setCardNumber(grouped);
                    }}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      className="modal-input"
                      placeholder="08/29"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setCardExpiry(raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">CVV</label>
                    <input
                      type="password"
                      className="modal-input"
                      placeholder="•••"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={verifyingPayment}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.3rem' }}
                >
                  {verifyingPayment
                    ? '⏳ Authorizing Card...'
                    : `🔒 Pay $${pendingCheckout.total.toFixed(2)} Now`}
                </button>
              </form>
            )}

            {paymentMethod === '💵 Pay at Counter' && (
              <div style={{ textAlign: 'center', padding: '0.75rem 0' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.1rem' }}>
                  Your order will be sent straight to the barista bar. Pay with cash or tap at the pickup counter!
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  disabled={verifyingPayment}
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleVerifyGatewayPayment}
                >
                  {verifyingPayment ? '⏳ Sending to Barista...' : '💵 Confirm Pay-at-Counter Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ORDER CONFIRMATION MODAL WITH LIVE TRACKER */}
      {showOrderConfirmation && confirmedOrder && (
        <div className="modal-backdrop" onClick={() => setShowOrderConfirmation(false)}>
          <div className="modal-card modal-confirmation" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">☕✨</div>
            <h3>Order Placed Successfully!</h3>
            <p className="order-id">
              Order ID: <strong>#{confirmedOrder.id}</strong>
              {confirmedOrder.transactionId && (
                <span style={{ marginLeft: '0.5rem', color: '#4ade80', fontSize: '0.82rem' }}>
                  • Ref #{confirmedOrder.transactionId} ({confirmedOrder.paymentStatus || 'Paid ✓'})
                </span>
              )}
            </p>

            {/* Live 4-Stage Preparation Tracker */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {prepStage >= 3 ? '🎉 Your order is ready at the counter!' : '🔥 Live Barista Preparation Progress'}
              </span>
              <button
                type="button"
                onClick={() => {
                  const nextSound = !soundEnabled;
                  setSoundEnabled(nextSound);
                  if (nextSound) playBaristaBellChime();
                }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border)',
                  color: soundEnabled ? '#4ade80' : 'var(--text-muted)',
                  borderRadius: 999,
                  padding: '0.18rem 0.65rem',
                  fontSize: '0.73rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                title="Toggle Barista Ready Bell Chime"
              >
                {soundEnabled ? '🔔 Bell Chime On' : '🔕 Bell Muted'}
              </button>
            </div>
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
            {prepStage >= 3 && (
              <div
                style={{
                  background: 'rgba(74, 222, 128, 0.14)',
                  border: '1px solid rgba(74, 222, 128, 0.4)',
                  color: '#4ade80',
                  borderRadius: 12,
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  marginBottom: '0.85rem',
                }}
              >
                🔔 Ding-Dong! Order #{confirmedOrder.id} is ready for {confirmedOrder.fulfillment || 'Pickup'}!
              </div>
            )}

            <div className="order-summary-box">
              {confirmedOrder.items.map((it, idx) => (
                <p key={idx}>{it.quantity || 1}× {it.name}</p>
              ))}
              <p className="confirm-customer">
                Customer: {confirmedOrder.customer || 'Guest'} • {confirmedOrder.fulfillment || '🏪 In-Café Pickup'} • {confirmedOrder.pickupSlot || pickupSlot} • {confirmedOrder.paymentMethod || '📱 UPI / QR Pay'}
              </p>
              <div className="confirm-divider"></div>
              <div className="confirm-total-row">
                <span>Amount Paid</span>
                <span>{formatPrice(confirmedOrder.total)}</span>
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

              {/* Group Order / Office Coffee Run Split-Bill Card */}
              <div className="group-order-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block' }}>
                      👥 Group / Office Coffee Run
                    </strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                      Tag items to teammates &amp; auto-split the bill
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`mood-pill-btn ${groupOrderMode ? 'active' : ''}`}
                    style={{ padding: '0.28rem 0.75rem', fontSize: '0.75rem' }}
                    onClick={() => setGroupOrderMode((prev) => !prev)}
                  >
                    {groupOrderMode ? '✓ Active' : 'Enable Split'}
                  </button>
                </div>

                {groupOrderMode && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontSize: '0.73rem', color: 'var(--warm)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                      Ordering Next Item For:
                    </span>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.55rem' }}>
                      {groupMembers.map((mem) => (
                        <button
                          key={mem}
                          type="button"
                          className={`mood-pill-btn ${activeMemberTag === mem ? 'active' : ''}`}
                          style={{ padding: '0.22rem 0.6rem', fontSize: '0.72rem' }}
                          onClick={() => setActiveMemberTag(mem)}
                        >
                          {mem}
                        </button>
                      ))}
                    </div>
                    <form onSubmit={handleAddGroupTeammate} style={{ display: 'flex', gap: '0.4rem' }}>
                      <input
                        type="text"
                        className="modal-input"
                        placeholder="+ Add friend name..."
                        value={customMemberInput}
                        onChange={(e) => setCustomMemberInput(e.target.value)}
                        style={{ padding: '0.32rem 0.6rem', fontSize: '0.75rem', flex: 1 }}
                      />
                      <button
                        type="submit"
                        className="btn-secondary"
                        style={{ padding: '0.32rem 0.65rem', fontSize: '0.74rem' }}
                      >
                        + Add
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="cart-empty">Your cart is empty. Order something delicious!</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      {(item.size || item.milk || item.notes) && (
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '0.15rem' }}>
                          {item.size ? `${item.size === 'large' ? 'Large 16oz' : 'Regular'}` : ''}
                          {item.milk ? ` • ${item.milk} milk` : ''}
                          {item.notes ? ` • "${item.notes}"` : ''}
                        </span>
                      )}
                      {groupOrderMode && (
                        <div style={{ marginTop: '0.2rem', marginBottom: '0.2rem' }}>
                          <select
                            className="modal-input"
                            style={{ padding: '0.18rem 0.45rem', fontSize: '0.72rem', width: 'auto', display: 'inline-block' }}
                            value={item.member || '👤 You'}
                            onChange={(e) => handleAssignItemMember(item.id, e.target.value)}
                            aria-label="Assign item to teammate"
                          >
                            {groupMembers.map((mem) => (
                              <option key={mem} value={mem}>
                                For: {mem}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <p>Qty: {item.quantity} × {formatPrice(item.unitPrice || item.price)}</p>
                    </div>
                    <span className="cart-item-price">
                      {formatPrice((item.unitPrice || item.price) * item.quantity)}
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
              {/* Fulfillment & Payment Selector in Cart */}
              <div className="form-row" style={{ marginBottom: '0.5rem', gap: '0.5rem' }}>
                <select
                  className="modal-input"
                  style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem', flex: 1 }}
                  value={orderFulfillment}
                  onChange={(e) => setOrderFulfillment(e.target.value)}
                  aria-label="Fulfillment Type"
                >
                  <option value="🏪 In-Café Pickup">🏪 In-Café Pickup</option>
                  <option value="🪑 Dine-In Table">🪑 Dine-In Table</option>
                  <option value="🛵 Express Delivery">🛵 Express Delivery</option>
                </select>
                <select
                  className="modal-input"
                  style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem', flex: 1 }}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  aria-label="Payment Method"
                >
                  <option value="📱 UPI / QR Pay">📱 UPI / QR Pay</option>
                  <option value="💳 Card">💳 Card</option>
                  <option value="💵 Pay at Counter">💵 Pay at Counter</option>
                </select>
              </div>

              {/* Scheduled Pre-Order Pickup Slot Selector in Cart */}
              <div style={{ marginBottom: '0.65rem' }}>
                <select
                  className="modal-input"
                  style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem', width: '100%' }}
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                  aria-label="Scheduled Pickup Time Slot"
                >
                  {PICKUP_TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>🕒 {slot}</option>
                  ))}
                </select>
              </div>

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

              {/* Live Per-Person Group Split Summary */}
              {groupOrderMode && cart.length > 0 && (() => {
                const ratio = cartSubtotal > 0 ? cartTotal / cartSubtotal : 1;
                const totalsByMember = {};
                cart.forEach((it) => {
                  const m = it.member || '👤 You';
                  const raw = (it.unitPrice || it.price || 0) * (it.quantity || 1) * ratio;
                  totalsByMember[m] = (totalsByMember[m] || 0) + raw;
                });
                const entries = Object.entries(totalsByMember);
                return (
                  <div className="group-split-summary">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '0.78rem', color: 'var(--warm)' }}>
                        🧾 Per-Person Split ({entries.length} people)
                      </strong>
                      <button
                        type="button"
                        onClick={() => {
                          const summaryText = entries
                            .map(([m, amt]) => `${m}: $${amt.toFixed(2)}`)
                            .join(' | ');
                          navigator.clipboard?.writeText(
                            `☕ Bean Scene Group Coffee Run (Total: $${cartTotal.toFixed(2)}) — ${summaryText}`
                          );
                          showToast('Copied Group Split-Bill summary to clipboard! 📋');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent)',
                          fontSize: '0.73rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        📋 Copy Split
                      </button>
                    </div>
                    {entries.map(([mem, amt]) => (
                      <div key={mem} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.77rem', color: '#e2e8f0', margin: '0.15rem 0' }}>
                        <span>{mem}</span>
                        <strong style={{ color: '#4ade80' }}>${amt.toFixed(2)}</strong>
                      </div>
                    ))}
                  </div>
                );
              })()}

              <div className="cart-total-row">
                <span>Total ({currObj.code})</span>
                <span className="price">{formatPrice(cartTotal)}</span>
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
          <div className="modal-card video-modal-card admin-hub-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Luxury Roastery Hero Header Banner */}
            <div className="admin-hub-hero-banner">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.25rem' }}>
                  <span className="modal-badge" style={{ marginBottom: 0 }}>Full-Stack Control Center</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#4ade80',
                      background: 'rgba(74, 222, 128, 0.14)',
                      border: '1px solid rgba(74, 222, 128, 0.35)',
                      padding: '0.18rem 0.55rem',
                      borderRadius: 999,
                    }}
                  >
                    ● Cloud DB Live
                  </span>
                </div>
                <h3 className="modal-title" style={{ fontSize: '1.55rem', margin: 0 }}>
                  ⚡ Barista &amp; Admin Hub
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Link
                  to="/admin"
                  className="mood-pill-btn active"
                  style={{ textDecoration: 'none', padding: '0.48rem 1rem', fontSize: '0.8rem' }}
                >
                  🛠️ Full Admin Page →
                </Link>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setShowAdminModal(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 4-Column Single-Row Glass Navigation Dock */}
            <div className="admin-hub-tabs-dock">
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
              <button
                type="button"
                className={`mood-pill-btn ${adminTab === 'users' ? 'active' : ''}`}
                onClick={() => setAdminTab('users')}
              >
                👥 Live Users ({visitorsList.length})
              </button>
            </div>

            {adminTab === 'orders' && (
              <div style={{ maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {orderHistory.length === 0 ? (
                  <div className="admin-empty-stage">
                    <div className="admin-empty-orb">☕</div>
                    <h4 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.35rem' }}>
                      Espresso Bar Queue is Ready &amp; Standing By
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 460, margin: '0 auto 1.1rem' }}>
                      No active orders in the kitchen queue yet. Place a drink order or generate an instant demo order below to test live preparation tracking and thermal ticket printing!
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.6rem',
                        flexWrap: 'wrap',
                        marginBottom: '1.25rem',
                        fontSize: '0.76rem',
                      }}
                    >
                      <span className="spec-pill">⏱️ Avg Prep: 5–8 mins</span>
                      <span className="spec-pill">🔥 {products.length} Artisan Specials Ready</span>
                      <span className="spec-pill">🖨️ Thermal Receipt Printer Online</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                        onClick={() => {
                          const demoCode = Math.floor(1000 + Math.random() * 9000);
                          const sampleOrder = {
                            id: `BSC-${demoCode}`,
                            items: [
                              { name: 'Pistachio Velvet Latte (Large, oat milk)', quantity: 1, price: 6.2 },
                              { name: 'Almond Frangipane Croissant (Warm)', quantity: 1, price: 4.8 },
                            ],
                            total: 11.0,
                            pointsEarned: 110,
                            customer: isLoggedIn ? userName : 'Vijaya Saradhi',
                            fulfillment: '🪑 Dine-In Table',
                            paymentMethod: '📱 UPI / QR Pay',
                            transactionId: `UPI-${Math.floor(100000 + Math.random() * 900000)}`,
                            paymentStatus: 'Paid ✓',
                            placedAt: new Date().toISOString(),
                            status: 'Received',
                          };
                          setOrderHistory((prev) => [sampleOrder, ...prev]);
                          axios.post(`${API_BASE_URL}/api/orders`, sampleOrder).catch(() => {});
                          showToast(`Generated Live Demo Order #${sampleOrder.id} in Kitchen Queue! ⚡`);
                        }}
                      >
                        ⚡ Simulate Live Demo Order
                      </button>
                      <a
                        href="#menu"
                        className="btn-secondary"
                        style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', textDecoration: 'none' }}
                        onClick={() => setShowAdminModal(false)}
                      >
                        ☕ Browse Menu to Order →
                      </a>
                    </div>
                  </div>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <h4 style={{ color: '#fff', margin: 0, fontSize: '0.95rem' }}>+ Add New Specialty to Menu</h4>
                    <button
                      type="button"
                      onClick={handleRestoreDefaultProducts}
                      className="btn-secondary"
                      style={{ padding: '0.28rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      🔄 Restore All 30 Defaults
                    </button>
                  </div>
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
                  <div className="admin-empty-stage">
                    <div className="admin-empty-orb">🪑</div>
                    <h4 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.35rem' }}>
                      VIP Café Seating Lounge is Open
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 440, margin: '0 auto 1.1rem' }}>
                      No table passes booked yet. Reserve a Sunlit Window Booth, Garden Patio, or Quiet Work Pod in one click!
                    </p>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ padding: '0.6rem 1.3rem', fontSize: '0.86rem' }}
                      onClick={() => {
                        setShowAdminModal(false);
                        setConfirmedReservation(null);
                        setShowReserveModal(true);
                      }}
                    >
                      🪑 Book a VIP Table Pass →
                    </button>
                  </div>
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

            {adminTab === 'users' && (
              <div style={{ maxHeight: '55vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Live Production Metrics Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  <div className="order-summary-box" style={{ marginBottom: 0, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🟢 Active Sessions</span>
                    <h4 style={{ fontSize: '1.35rem', color: '#4ade80', marginTop: '0.2rem' }}>{visitorsList.length}</h4>
                  </div>
                  <div className="order-summary-box" style={{ marginBottom: 0, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>👤 Registered Users</span>
                    <h4 style={{ fontSize: '1.35rem', color: 'var(--accent)', marginTop: '0.2rem' }}>{usersList.length}</h4>
                  </div>
                  <div className="order-summary-box" style={{ marginBottom: 0, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📩 Subscribers</span>
                    <h4 style={{ fontSize: '1.35rem', color: 'var(--warm)', marginTop: '0.2rem' }}>{subscribersList.length}</h4>
                  </div>
                  <div className="order-summary-box" style={{ marginBottom: 0, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>💰 Live Revenue</span>
                    <h4 style={{ fontSize: '1.35rem', color: '#38bdf8', marginTop: '0.2rem' }}>
                      ${orderHistory.reduce((acc, o) => acc + Number(o.total || 0), 0).toFixed(2)}
                    </h4>
                  </div>
                </div>

                {/* Signed-In & Registered Users */}
                <div className="order-summary-box" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <h4 style={{ color: '#fff', fontSize: '0.92rem', margin: 0 }}>👤 Signed-In &amp; Registered Accounts</h4>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '0.28rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => {
                        const rows = [
                          ['Type', 'Name', 'Email', 'Action/Role', 'Location/Device'],
                          ...usersList.map((u) => ['Registered User', u.name, u.email, u.role || 'customer', u.lastActive || 'Active']),
                          ...subscribersList.map((s) => ['Newsletter Subscriber', s.split('@')[0], s, 'FIRST10 Promo', 'Subscribed']),
                          ...visitorsList.map((v) => ['Visitor Session', v.name, v.email, v.action, `${v.device || ''} (${v.location || 'Live'})`]),
                        ];
                        const csvContent = rows.map((r) => r.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'bean-scene-live-users-report.csv';
                        a.click();
                        URL.revokeObjectURL(url);
                        showToast('Downloaded Live Users & Activity CSV report! 📥');
                      }}
                    >
                      📥 Export CSV Report
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {usersList.map((u, i) => (
                      <div
                        key={u.email || i}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.84rem',
                          padding: '0.4rem 0.65rem',
                          background: 'rgba(255,255,255,0.04)',
                          borderRadius: 8,
                        }}
                      >
                        <div>
                          <strong style={{ color: '#fff' }}>{u.name}</strong>{' '}
                          <span style={{ color: 'var(--text-muted)' }}>({u.email})</span>
                        </div>
                        <span style={{ color: '#4ade80', fontSize: '0.76rem', fontWeight: 600 }}>
                          {u.role === 'admin' ? '⚡ Admin' : '🟢 Active'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter Subscribers */}
                <div className="order-summary-box" style={{ marginBottom: 0 }}>
                  <h4 style={{ color: '#fff', fontSize: '0.92rem', marginBottom: '0.5rem' }}>📩 Newsletter Subscribers</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {subscribersList.map((sub, idx) => (
                      <span
                        key={sub || idx}
                        style={{
                          background: 'rgba(192,132,252,0.14)',
                          border: '1px solid rgba(192,132,252,0.35)',
                          color: '#e9d5ff',
                          padding: '0.25rem 0.65rem',
                          borderRadius: 999,
                          fontSize: '0.78rem',
                        }}
                      >
                        ✉️ {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Live Visitor & Activity Feed */}
                <div className="order-summary-box" style={{ marginBottom: 0 }}>
                  <h4 style={{ color: '#fff', fontSize: '0.92rem', marginBottom: '0.6rem' }}>🌐 Live Visitor &amp; Activity Log</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {visitorsList.map((v, idx) => (
                      <div
                        key={v.id || idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.5rem 0.7rem',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: 10,
                          border: '1px solid var(--border)',
                          fontSize: '0.82rem',
                        }}
                      >
                        <div>
                          <strong style={{ color: 'var(--warm)' }}>{v.name}</strong>{' '}
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>({v.email})</span>
                          <div style={{ color: '#e2e8f0', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                            {v.action} • <span style={{ color: 'var(--accent)' }}>{v.device}</span>
                          </div>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', whiteSpace: 'nowrap' }}>
                          {v.location || 'Live'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
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

            <div className="video-modal-frame" style={{ position: 'relative', overflow: 'hidden', borderRadius: 16 }}>
              <img
                src={products[reelIdx % products.length]?.image || DEFAULT_PRODUCTS[0].image}
                alt="Bean Scene Roastery Reel"
                style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackImage();
                }}
              />
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

      {/* 1. BEAN ORIGIN & FARM-TO-CUP TRACEABILITY PASSPORT MODAL */}
      {passportProduct && (() => {
        const spec = getOriginPassport(passportProduct);
        return (
          <div className="modal-backdrop" onClick={() => setPassportProduct(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="modal-badge">🌍 Farm-to-Cup Traceability Passport</span>
                  <h3 className="modal-title">{passportProduct.name}</h3>
                </div>
                <button type="button" className="modal-close" onClick={() => setPassportProduct(null)}>
                  ✕
                </button>
              </div>

              <div className="passport-hero-strip">
                <img
                  src={passportProduct.image}
                  alt={passportProduct.name}
                  style={{ width: 68, height: 68, borderRadius: 14, objectFit: 'cover' }}
                />
                <div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--warm)', fontWeight: 700, letterSpacing: 1 }}>
                    LOT #{spec.lotCode} • 100% TRACEABLE
                  </span>
                  <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: '0.15rem 0' }}>{spec.origin}</h4>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{spec.farm}</span>
                </div>
              </div>

              <div className="passport-specs-grid">
                <div className="passport-spec-box">
                  <span>⛰️ Altitude / Bake</span>
                  <strong>{spec.altitude}</strong>
                </div>
                <div className="passport-spec-box">
                  <span>💧 Craft Process</span>
                  <strong>{spec.process}</strong>
                </div>
                <div className="passport-spec-box" style={{ gridColumn: '1 / -1' }}>
                  <span>🔥 Roast &amp; Extraction Profile ({spec.roastLabel})</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.3rem' }}>
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <span
                        key={lvl}
                        style={{
                          fontSize: '1.05rem',
                          opacity: lvl <= spec.roastLevel ? 1 : 0.25,
                          filter: lvl <= spec.roastLevel ? 'drop-shadow(0 0 6px rgba(245,208,169,0.5))' : 'none',
                        }}
                      >
                        🫘
                      </span>
                    ))}
                    <span style={{ fontSize: '0.8rem', color: 'var(--warm)', marginLeft: '0.4rem', fontWeight: 600 }}>
                      {spec.brewMethod}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.45rem' }}>
                  🎯 Cupping &amp; Flavor Tasting Notes
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {spec.notes.map((n) => (
                    <span key={n} className="spec-pill" style={{ padding: '0.32rem 0.8rem', fontSize: '0.8rem' }}>
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    handleQuickAdd(passportProduct);
                    setPassportProduct(null);
                  }}
                >
                  + Quick Add (${passportProduct.price.toFixed(2)})
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    const prod = passportProduct;
                    setPassportProduct(null);
                    openOrderModal(prod);
                  }}
                >
                  ☕ Customize &amp; Order
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 3. VIP LOYALTY TIER MEMBERSHIP CARD & PERKS LADDER MODAL */}
      {showVipModal && (() => {
        const currentTier =
          VIP_LOYALTY_TIERS.slice()
            .reverse()
            .find((t) => beanPoints >= t.minPts) || VIP_LOYALTY_TIERS[0];
        const nextTier = VIP_LOYALTY_TIERS.find((t) => t.minPts > beanPoints);
        return (
          <div className="modal-backdrop" onClick={() => setShowVipModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="modal-badge">Bean Scene Rewards Club</span>
                  <h3 className="modal-title">👑 VIP Roastery Membership Pass</h3>
                </div>
                <button type="button" className="modal-close" onClick={() => setShowVipModal(false)}>
                  ✕
                </button>
              </div>

              {/* 3D Digital VIP Membership Pass Card */}
              <div className="vip-3d-pass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.73rem', letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.8 }}>
                      BEAN SCENE ROASTERY CLUB
                    </span>
                    <h4 style={{ fontSize: '1.35rem', fontWeight: 900, color: currentTier.color, margin: '0.15rem 0' }}>
                      {currentTier.name}
                    </h4>
                  </div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=74x74&data=${encodeURIComponent(
                      `BEANSCENE-VIP-${userName || 'MEMBER'}-${beanPoints}PTS`
                    )}`}
                    alt="VIP Member QR"
                    style={{ width: 64, height: 64, borderRadius: 10, background: '#fff', padding: 4 }}
                  />
                </div>

                <div style={{ margin: '0.9rem 0' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>AVAILABLE REWARD BALANCE</span>
                  <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>
                    {beanPoints} <span style={{ fontSize: '0.95rem', color: 'var(--warm)' }}>Bean Points</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', opacity: 0.9 }}>
                  <span>MEMBER: {(isLoggedIn ? userName : 'VIJAYA SARADHI').toUpperCase()}</span>
                  <span>
                    {nextTier
                      ? `${nextTier.minPts - beanPoints} pts to ${nextTier.name}`
                      : '★ MAX GOLD TIER UNLOCKED'}
                  </span>
                </div>
              </div>

              {/* 3-Tier Perks Ladder */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.1rem' }}>
                {VIP_LOYALTY_TIERS.map((tier) => {
                  const unlocked = beanPoints >= tier.minPts;
                  return (
                    <div
                      key={tier.key}
                      className={`vip-tier-row ${unlocked ? 'unlocked' : ''}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <strong style={{ color: tier.color, fontSize: '0.92rem' }}>
                          {tier.name} ({tier.minPts}+ pts)
                        </strong>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: unlocked ? '#4ade80' : 'var(--text-muted)',
                          }}
                        >
                          {unlocked ? '✓ Unlocked' : `🔒 Need ${tier.minPts - beanPoints} more pts`}
                        </span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.79rem', color: '#e2e8f0' }}>
                        {tier.perks.map((perk) => (
                          <li key={perk}>{perk}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    setShowVipModal(false);
                    setShowSpinModal(true);
                  }}
                >
                  🎡 Spin for Bonus Pts
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    setShowVipModal(false);
                    setShowCart(true);
                  }}
                >
                  🎁 Redeem in Cart
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 5. INSTALLABLE PWA APP GUIDE MODAL */}
      {showPwaModal && (
        <div className="modal-backdrop" onClick={() => setShowPwaModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-badge">Progressive Web App (PWA)</span>
                <h3 className="modal-title">📲 Install Bean Scene App</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setShowPwaModal(false)}>
                ✕
              </button>
            </div>
            <p className="modal-desc">
              Bean Scene is an offline-ready Progressive Web App! Install it directly to your phone or desktop for 1-tap ordering:
            </p>
            <div className="order-summary-box" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <p><strong>💻 Chrome / Edge Desktop:</strong> Click the <strong>Install App (⊕)</strong> icon on the right side of your browser address bar.</p>
              <p><strong>📱 iPhone / iOS Safari:</strong> Tap <strong>Share (↑)</strong> → <strong>Add to Home Screen</strong>.</p>
              <p><strong>🤖 Android Chrome:</strong> Tap the <strong>⋮ Menu</strong> → <strong>Install App / Add to Home Screen</strong>.</p>
            </div>
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setShowPwaModal(false)}
            >
              Got It!
            </button>
          </div>
        </div>
      )}

      {/* 4. PERSONAL DAILY CAFFEINE & HYDRATION WELLNESS TRACKER MODAL */}
      {showWellnessModal && (() => {
        const caffPct = Math.min(100, Math.round((totalDailyCaffeine / 400) * 100));
        const zoneLabel =
          totalDailyCaffeine === 0
            ? '🌱 Zero Caffeine — Ready for Your Morning Cup'
            : totalDailyCaffeine <= 250
            ? '⚡ Optimal Focus & Flow Zone (Under 250mg)'
            : totalDailyCaffeine <= 400
            ? '🔥 High Energy Zone (Approaching 400mg Daily Limit)'
            : '⚠️ Above 400mg FDA Recommended Limit — Switch to Low-Caf or Bakery';
        const zoneColor =
          totalDailyCaffeine <= 250 ? '#4ade80' : totalDailyCaffeine <= 400 ? '#fbbf24' : '#f87171';
        const gentlePicks = products.filter(
          (p) => p.id === 13 || p.id === 24 || p.id === 5 || p.id === 27
        );

        return (
          <div className="modal-backdrop" onClick={() => setShowWellnessModal(false)}>
            <div
              className="modal-card wellness-modal-highlight-card"
              style={{
                borderTop: `4px solid ${zoneColor}`,
                borderColor: 'rgba(192, 132, 252, 0.45)',
                boxShadow:
                  '0 28px 65px rgba(0, 0, 0, 0.72), 0 0 42px rgba(192, 132, 252, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                backgroundImage:
                  "linear-gradient(155deg, rgba(24, 18, 42, 0.92) 0%, rgba(14, 11, 24, 0.95) 100%), radial-gradient(circle at 85% 12%, rgba(192, 132, 252, 0.25), transparent 60%), url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=85')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span
                    className="modal-badge"
                    style={{
                      background: 'rgba(192, 132, 252, 0.18)',
                      border: '1px solid rgba(192, 132, 252, 0.45)',
                      color: '#e9d5ff',
                      padding: '0.22rem 0.75rem',
                      borderRadius: 999,
                      display: 'inline-block',
                      marginBottom: '0.4rem',
                    }}
                  >
                    ✨ Smart Coffee Wellness
                  </span>
                  <h3 className="modal-title wellness-highlight-title">
                    📊 Daily Caffeine &amp; Hydration Tracker
                  </h3>
                </div>
                <button type="button" className="modal-close" onClick={() => setShowWellnessModal(false)}>
                  ✕
                </button>
              </div>

              <div
                className="order-summary-box wellness-glass-panel"
                style={{
                  marginBottom: '1rem',
                  borderTop: `3px solid ${zoneColor}`,
                  borderColor: 'rgba(245, 208, 169, 0.35)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.55rem' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.8px',
                        color: '#fde68a',
                        display: 'block',
                        marginBottom: '0.15rem',
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      TODAY&apos;S CAFFEINE INTAKE (CART + ORDERS)
                    </span>
                    <strong
                      style={{
                        fontSize: '1.95rem',
                        fontWeight: 900,
                        color: zoneColor,
                        textShadow: `0 0 22px ${zoneColor}66`,
                      }}
                    >
                      {totalDailyCaffeine}mg{' '}
                      <span style={{ fontSize: '0.92rem', color: '#e2e8f0', fontWeight: 700 }}>/ 400mg limit</span>
                    </strong>
                  </div>
                  <span
                    className="spec-pill"
                    style={{
                      background: 'rgba(245, 208, 169, 0.16)',
                      border: '1px solid rgba(245, 208, 169, 0.48)',
                      color: '#fde68a',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      padding: '0.35rem 0.85rem',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 0 16px rgba(245, 208, 169, 0.2)',
                    }}
                  >
                    🔥 {cartCaloriesKcal} kcal in cart
                  </span>
                </div>

                <div
                  className="loyalty-progress-track"
                  style={{
                    height: 12,
                    margin: '0.6rem 0',
                    background: 'rgba(11, 9, 18, 0.72)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                  }}
                >
                  <div
                    className="loyalty-progress-fill"
                    style={{
                      width: `${caffPct}%`,
                      background: `linear-gradient(90deg, #4ade80, #fbbf24, ${zoneColor})`,
                      boxShadow: `0 0 14px ${zoneColor}`,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '0.83rem',
                    color: zoneColor,
                    fontWeight: 800,
                    display: 'block',
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.65)',
                  }}
                >
                  {zoneLabel}
                </span>
              </div>

              {/* Hydration Balance Counter */}
              <div
                className="order-summary-box wellness-glass-panel"
                style={{
                  marginBottom: '1.1rem',
                  borderTop: '3px solid #38bdf8',
                  borderColor: 'rgba(56, 189, 248, 0.38)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                  <div>
                    <strong
                      style={{
                        color: '#bae6fd',
                        fontSize: '0.96rem',
                        fontWeight: 800,
                        display: 'block',
                        textShadow: '0 0 14px rgba(56, 189, 248, 0.35)',
                      }}
                    >
                      💧 Hydration Balance ({waterGlasses} / {recommendedWaterCups} glasses)
                    </strong>
                    <span style={{ color: '#e2e8f0', fontSize: '0.78rem', fontWeight: 500 }}>
                      Barista rule: 1 glass of water per espresso shot for zero jitters
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.45rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{
                        padding: '0.32rem 0.75rem',
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        borderColor: 'rgba(56, 189, 248, 0.45)',
                        color: '#bae6fd',
                      }}
                      onClick={() => setWaterGlasses((w) => Math.max(0, w - 1))}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{
                        padding: '0.32rem 0.8rem',
                        fontSize: '0.84rem',
                        boxShadow: '0 6px 18px rgba(192, 132, 252, 0.45)',
                      }}
                      onClick={() => setWaterGlasses((w) => w + 1)}
                    >
                      + 💧
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.38rem',
                    flexWrap: 'wrap',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 12,
                    background: 'rgba(11, 9, 18, 0.52)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                  }}
                >
                  {Array.from({ length: Math.max(recommendedWaterCups, waterGlasses) }).map((_, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '1.18rem',
                        opacity: i < waterGlasses ? 1 : 0.28,
                        filter: i < waterGlasses ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.7))' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      💧
                    </span>
                  ))}
                </div>
              </div>

              {/* Gentle / Low-Caffeine Smart Recommendations */}
              <div style={{ marginBottom: '1.1rem' }}>
                <span
                  style={{
                    fontSize: '0.83rem',
                    color: '#fde68a',
                    fontWeight: 800,
                    display: 'block',
                    marginBottom: '0.6rem',
                    letterSpacing: '0.3px',
                    textShadow: '0 1px 6px rgba(245, 208, 169, 0.35)',
                  }}
                >
                  🍵 Low-Caffeine &amp; Zero-Caffeine Pairing Picks
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                  {gentlePicks.map((gp) => (
                    <div
                      key={gp.id}
                      className="wellness-pick-card"
                    >
                      <div>
                        <strong style={{ color: '#ffffff', fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '0.15rem' }}>
                          {gp.name}
                        </strong>
                        <span style={{ color: '#fde68a', fontSize: '0.76rem', fontWeight: 700 }}>
                          ⚡ {gp.caffeine} • <span style={{ color: '#e9d5ff' }}>{formatPrice(gp.price)}</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        className="order-btn"
                        style={{
                          padding: '0.3rem 0.68rem',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.28), rgba(245, 208, 169, 0.2))',
                          borderColor: 'rgba(192, 132, 252, 0.6)',
                          color: '#fff',
                          boxShadow: '0 4px 12px rgba(192, 132, 252, 0.3)',
                        }}
                        onClick={() => handleQuickAdd(gp)}
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontWeight: 800,
                  boxShadow: '0 10px 28px rgba(192, 132, 252, 0.45)',
                }}
                onClick={() => setShowWellnessModal(false)}
              >
                ✓ Done
              </button>
            </div>
          </div>
        );
      })()}

      {/* BUILT-IN REACT DEVTOOLS LIVE COMPONENT, STATE & PROPS INSPECTOR MODAL */}
      {showReactDevTools && (
        <div className="modal-backdrop" onClick={() => setShowReactDevTools(false)}>
          <div
            className="modal-card"
            style={{ maxWidth: 680 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="modal-badge" style={{ color: '#38bdf8', borderColor: 'rgba(56,189,248,0.4)' }}>
                  ⚛️ React v19 Developer Tools • Live State Inspector
                </span>
                <h3 className="modal-title">⚛️ Bean Scene React DevTools Panel</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setShowReactDevTools(false)}>
                ✕
              </button>
            </div>

            <p className="modal-desc">
              Inspect your live React Component Tree and edit <code>useState</code> hooks in real time—just like the official React Developer Tools browser extension:
            </p>

            {/* Component Hierarchy Tree */}
            <div
              className="order-summary-box"
              style={{
                fontFamily: 'monospace',
                fontSize: '0.79rem',
                lineHeight: 1.7,
                background: 'rgba(10, 14, 26, 0.85)',
                borderColor: 'rgba(56, 189, 248, 0.35)',
                marginBottom: '1rem',
              }}
            >
              <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '0.3rem' }}>
                ⚛️ Components Tree (Active Fiber Root)
              </div>
              <div style={{ color: '#94a3b8' }}>├─ &lt;StrictMode&gt;</div>
              <div style={{ color: '#94a3b8', paddingLeft: '1rem' }}>└─ &lt;BrowserRouter&gt;</div>
              <div style={{ color: '#38bdf8', paddingLeft: '2rem', fontWeight: 700 }}>
                └─ &lt;App /&gt; <span style={{ color: '#4ade80' }}>● Mounted (30 products, {cartItemCount} cart items)</span>
              </div>
              <div style={{ color: '#e2e8f0', paddingLeft: '3rem' }}>
                ├─ &lt;HeaderNavbar currency=&quot;{currency}&quot; theme=&quot;{theme}&quot; beanPoints={'{'}{beanPoints}{'}'} /&gt;
              </div>
              <div style={{ color: '#e2e8f0', paddingLeft: '3rem' }}>
                ├─ &lt;CupStudio3D base=&quot;{cupBase.key}&quot; milk=&quot;{cupMilk.key}&quot; size=&quot;{cupSize.oz}&quot; /&gt;
              </div>
              <div style={{ color: '#e2e8f0', paddingLeft: '3rem' }}>
                ├─ &lt;MenuGrid items={'{'}{filteredProducts.length}{'}'} category=&quot;{activeCategory}&quot; sortBy=&quot;{sortBy}&quot; /&gt;
              </div>
              <div style={{ color: '#e2e8f0', paddingLeft: '3rem' }}>
                ├─ &lt;HomeBrewLab method=&quot;{selectedBrewId}&quot; timerSec={'{'}{brewTimerSec}{'}'} running={'{'}{String(brewTimerRunning)}{'}'} /&gt;
              </div>
              <div style={{ color: '#e2e8f0', paddingLeft: '3rem' }}>
                └─ &lt;RoasteryEvents workshops={'{'}{ROASTERY_EVENTS.length}{'}'} booked={'{'}{bookedEventIds.length}{'}'} /&gt;
              </div>
            </div>

            {/* Interactive Live Hook State Editor */}
            <div className="order-summary-box" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <strong style={{ color: '#fff', fontSize: '0.88rem' }}>
                  🔧 Live Hooks State Editor (<code>useState</code>)
                </strong>
                <span className="spec-pill" style={{ color: '#4ade80' }}>⚡ Hot-State Sync Active</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: '0.65rem' }}>
                {/* Bean Points Hook */}
                <div className="passport-spec-box">
                  <span>State: beanPoints</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                    <strong style={{ color: 'var(--warm)', fontSize: '1rem' }}>{beanPoints} pts</strong>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        type="button"
                        className="order-btn"
                        style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                        onClick={() => {
                          setBeanPoints((p) => {
                            const next = p + 100;
                            localStorage.setItem('beanScenePoints', String(next));
                            return next;
                          });
                          showToast('⚛️ React DevTools: Injected +100 Bean Points into state!');
                        }}
                      >
                        +100
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                        onClick={() => {
                          setBeanPoints(400);
                          localStorage.setItem('beanScenePoints', '400');
                          showToast('⚛️ React DevTools: Set beanPoints = 400 (Gold VIP Unlocked)!');
                        }}
                      >
                        Gold VIP
                      </button>
                    </div>
                  </div>
                </div>

                {/* Theme Hook */}
                <div className="passport-spec-box">
                  <span>State: theme</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                    <strong style={{ color: '#38bdf8' }}>&quot;{theme}&quot;</strong>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '0.2rem 0.65rem', fontSize: '0.72rem' }}
                      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                    >
                      Toggle Theme
                    </button>
                  </div>
                </div>

                {/* Currency Hook */}
                <div className="passport-spec-box">
                  <span>State: currency</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                    <strong style={{ color: '#4ade80' }}>&quot;{currency}&quot; ({currObj.symbol})</strong>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '0.2rem 0.65rem', fontSize: '0.72rem' }}
                      onClick={cycleCurrency}
                    >
                      Cycle Currency
                    </button>
                  </div>
                </div>

                {/* Promo Hook */}
                <div className="passport-spec-box">
                  <span>State: appliedPromo</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                    <strong style={{ color: '#c084fc' }}>&quot;{appliedPromo || 'NONE'}&quot;</strong>
                    <button
                      type="button"
                      className="order-btn"
                      style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem' }}
                      onClick={() => applyPromoCode('BEAN25')}
                    >
                      Apply BEAN25
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Raw State JSON Snapshot */}
            <div
              className="order-summary-box"
              style={{
                fontFamily: 'monospace',
                fontSize: '0.74rem',
                maxHeight: 135,
                overflowY: 'auto',
                background: 'rgba(0,0,0,0.35)',
                marginBottom: '1rem',
              }}
            >
              <div style={{ color: 'var(--warm)', fontWeight: 700, marginBottom: '0.25rem' }}>
                📦 Serialized Hook Snapshot:
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#cbd5e1' }}>
                {JSON.stringify(
                  {
                    isLoggedIn,
                    userName: userName || 'Guest',
                    theme,
                    currency,
                    beanPoints,
                    appliedPromo: appliedPromo || null,
                    activeCategory,
                    dietFilter,
                    cartItems: cartItemCount,
                    cartTotal: formatPrice(cartTotal),
                    dailyCaffeineMg: totalDailyCaffeine,
                    pickupSlot,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => {
                  console.info('⚛️ [Bean Scene React DevTools Snapshot]', {
                    productsCount: products.length,
                    cart,
                    beanPoints,
                    theme,
                    currency,
                    orderHistory,
                  });
                  showToast('Logged full React state snapshot to Browser Console (F12)! 🖥️');
                }}
              >
                🖥️ Log State to Console
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowReactDevTools(false)}
              >
                Close Inspector
              </button>
            </div>
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

StarRating.displayName = 'BeanSceneStarRating';
App.displayName = 'BeanSceneApp';

export default App;
