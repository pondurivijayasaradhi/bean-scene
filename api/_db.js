import fs from 'fs';
import path from 'path';
import os from 'os';

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
  { id: 30, name: 'Smoked Salmon Cream Bagel',   description: 'Toasted sesame bagel with herb cream cheese, capers & salmon',  price: 6.9, image: 'https://images.unsplash.com/photo-1592417817098-8f3d691a4bf5?auto=format&fit=crop&w=600&q=80', category: 'bakery', rating: 4.9, reviews: 187, popular: true,  calories: 340, caffeine: '0mg',   badge: '🥯 Savory Artisan'    },
];

const INITIAL_DB = {
  products: DEFAULT_PRODUCTS,
  orders: [],
  reservations: [],
  subscribers: ['vijayasaradhiponduri@gmail.com', 'hello@beanscene.com'],
  users: [
    { email: 'admin@beanscene.com', password: 'admin123', name: 'Admin', role: 'admin', lastActive: new Date().toISOString() },
    { email: 'vijayasaradhiponduri@gmail.com', password: 'password123', name: 'Vijaya Saradhi', role: 'customer', lastActive: new Date().toISOString() },
  ],
  visitors: [
    {
      id: 'vis-1',
      name: 'Vijaya Saradhi',
      email: 'vijayasaradhiponduri@gmail.com',
      action: 'Active Session • Menu & Cup Studio',
      device: 'Chrome • Desktop',
      location: 'India (IN)',
      time: new Date().toISOString(),
    },
  ],
};

let memoryCache = null;

function getLocalDbPath() {
  const localFile = path.join(process.cwd(), 'bean-scene-db.json');
  try {
    fs.accessSync(process.cwd(), fs.constants.W_OK);
    return localFile;
  } catch {
    return path.join(os.tmpdir(), 'bean-scene-db.json');
  }
}

export function getDbEngineInfo() {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const cloudRestUrl = process.env.CLOUD_DB_REST_URL || process.env.SUPABASE_URL;
  if (kvUrl) {
    return { mode: 'cloud-kv', label: '☁️ Vercel KV / Upstash Redis Cloud DB' };
  }
  if (cloudRestUrl) {
    return { mode: 'cloud-rest', label: '☁️ Cloud REST Database' };
  }
  return { mode: 'persistent-json', label: '🗄️ Persistent JSON Database Store' };
}

const mergeDbProducts = (savedProducts = []) => {
  if (!Array.isArray(savedProducts) || savedProducts.length === 0) return DEFAULT_PRODUCTS;
  const merged = DEFAULT_PRODUCTS.map((def) => {
    const existing = savedProducts.find((item) => item.id === def.id || item.name === def.name);
    return existing ? { ...def, ...existing } : def;
  });
  const customExtras = savedProducts.filter(
    (item) => !DEFAULT_PRODUCTS.some((def) => def.id === item.id || def.name === item.name)
  );
  return [...merged, ...customExtras];
};

export async function readDb() {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Try Cloud KV / Upstash Redis REST API if configured
  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl.replace(/\/$/, '')}/get/bean_scene_db`, {
        headers: { Authorization: `Bearer ${kvToken}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.result) {
          const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
          memoryCache = { ...INITIAL_DB, ...parsed, products: mergeDbProducts(parsed.products) };
          return memoryCache;
        }
      }
    } catch {
      // Fallback to file/memory
    }
  }

  // 2. Try Cloud JSON REST endpoint (Firebase / Supabase / Custom Webhook) if configured
  const cloudRestUrl = process.env.CLOUD_DB_REST_URL;
  if (cloudRestUrl) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (process.env.CLOUD_DB_API_KEY) {
        headers.Authorization = `Bearer ${process.env.CLOUD_DB_API_KEY}`;
        headers.apikey = process.env.CLOUD_DB_API_KEY;
      }
      const res = await fetch(cloudRestUrl, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          memoryCache = { ...INITIAL_DB, ...data, products: mergeDbProducts(data.products) };
          return memoryCache;
        }
      }
    } catch {
      // Fallback to disk/memory
    }
  }

  // 3. Persistent File DB on Disk (/tmp on Vercel Serverless or workspace root locally)
  const dbPath = getLocalDbPath();
  try {
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf8');
      const parsed = JSON.parse(raw);
      memoryCache = { ...INITIAL_DB, ...parsed, products: mergeDbProducts(parsed.products) };
      return memoryCache;
    }
  } catch {
    // Fallback to memoryCache
  }

  if (!memoryCache) {
    memoryCache = structuredClone ? structuredClone(INITIAL_DB) : JSON.parse(JSON.stringify(INITIAL_DB));
  }
  return memoryCache;
}

export async function writeDb(nextDb) {
  memoryCache = { ...INITIAL_DB, ...nextDb };

  // 1. Write to Persistent File DB
  const dbPath = getLocalDbPath();
  try {
    fs.writeFileSync(dbPath, JSON.stringify(memoryCache, null, 2), 'utf8');
  } catch {
    // Ignore read-only filesystem errors outside /tmp
  }

  // 2. Sync to Cloud KV / Upstash Redis if configured
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (kvUrl && kvToken) {
    try {
      await fetch(`${kvUrl.replace(/\/$/, '')}/set/bean_scene_db`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memoryCache),
      });
    } catch {
      // Keep local cache
    }
  }

  // 3. Sync to Cloud REST URL if configured
  const cloudRestUrl = process.env.CLOUD_DB_REST_URL;
  if (cloudRestUrl) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (process.env.CLOUD_DB_API_KEY) {
        headers.Authorization = `Bearer ${process.env.CLOUD_DB_API_KEY}`;
        headers.apikey = process.env.CLOUD_DB_API_KEY;
      }
      await fetch(cloudRestUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(memoryCache),
      });
    } catch {
      // Keep local cache
    }
  }

  return memoryCache;
}
