import { defaultProducts, setCorsHeaders } from './_data.js';

let products = [...defaultProducts];

export default function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(products);
  }

  if (req.method === 'POST') {
    const {
      name,
      description,
      price,
      image,
      imageUrl,
      category,
      popular,
      calories,
      caffeine,
      badge,
    } = req.body || {};

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    const newProduct = {
      id: Date.now(),
      name,
      description: description || 'Handcrafted Bean Scene specialty',
      price: Number(price),
      image: image || imageUrl || '/cappuccino.jpg',
      category: category || 'coffee',
      rating: 4.9,
      reviews: 1,
      popular: Boolean(popular),
      calories: Number(calories) || 140,
      caffeine: caffeine || '150mg',
      badge: badge || '✨ New Arrival',
    };

    products.push(newProduct);
    return res.status(201).json(newProduct);
  }

  if (req.method === 'PUT') {
    const id = Number(req.query?.id || req.body?.id);
    const idx = products.findIndex((p) => p.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products[idx] = {
      ...products[idx],
      ...(req.body || {}),
      id,
      price: req.body?.price !== undefined ? Number(req.body.price) : products[idx].price,
    };

    return res.status(200).json(products[idx]);
  }

  if (req.method === 'DELETE') {
    const id = Number(req.query?.id || req.body?.id);
    products = products.filter((p) => p.id !== id);
    return res.status(200).json({ message: 'Product deleted successfully', id });
  }

  return res.status(200).json(products);
}

