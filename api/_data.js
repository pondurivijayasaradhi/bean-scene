// Shared in-memory store & CORS helper for Bean Scene Vercel Serverless API Functions

export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

export const defaultUsers = [
  { email: 'admin@beanscene.com', password: 'admin123', name: 'Admin', role: 'admin' },
];

export const defaultProducts = [
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

