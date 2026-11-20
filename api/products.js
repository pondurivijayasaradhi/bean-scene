import { readDb, writeDb } from './_db.js';

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await readDb();

  if (req.method === 'GET') {
    return res.status(200).json(db.products);
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

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
    } = body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    const newProduct = {
      id: body.id || Date.now(),
      name,
      description: description || 'Handcrafted Bean Scene specialty',
      price: Number(price),
      image:
        image ||
        imageUrl ||
        'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
      category: category || 'coffee',
      rating: 4.9,
      reviews: 1,
      popular: Boolean(popular),
      calories: Number(calories) || 140,
      caffeine: caffeine || '150mg',
      badge: badge || '✨ New Arrival',
    };

    db.products.push(newProduct);
    await writeDb(db);
    return res.status(201).json(newProduct);
  }

  if (req.method === 'PUT') {
    const id = Number(req.query?.id || body?.id);
    const idx = db.products.findIndex((p) => Number(p.id) === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.products[idx] = {
      ...db.products[idx],
      ...body,
      id,
      price: body?.price !== undefined ? Number(body.price) : db.products[idx].price,
    };

    await writeDb(db);
    return res.status(200).json(db.products[idx]);
  }

  if (req.method === 'DELETE') {
    const id = Number(req.query?.id || body?.id);
    db.products = db.products.filter((p) => Number(p.id) !== id);
    await writeDb(db);
    return res.status(200).json({ message: 'Product deleted successfully', id });
  }

  return res.status(200).json(db.products);
}
