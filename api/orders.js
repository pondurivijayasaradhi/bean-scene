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
    const { email } = req.query || {};
    if (email) {
      const userOrders = db.orders.filter((order) => order.email === email);
      return res.status(200).json(userOrders);
    }
    return res.status(200).json(db.orders);
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

  if (req.method === 'POST') {
    const {
      id,
      items,
      total,
      user,
      customer,
      email,
      fulfillment,
      pickupSlot,
      paymentMethod,
      transactionId,
      paymentStatus,
      pointsEarned,
      currency,
    } = body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const newOrder = {
      id: id || `BSC-${Math.floor(1000 + Math.random() * 9000)}`,
      items,
      total,
      user: user || customer || 'Guest',
      customer: customer || user || 'Guest',
      email: email || 'guest@beanscene.com',
      fulfillment: fulfillment || '🏪 In-Café Pickup',
      pickupSlot: pickupSlot || '⚡ ASAP (Ready in 5–8 mins)',
      paymentMethod: paymentMethod || '📱 UPI / QR Pay',
      transactionId: transactionId || 'UPI-VERIFIED',
      paymentStatus: paymentStatus || 'Paid ✓',
      currency: currency || 'USD',
      pointsEarned: pointsEarned || Math.max(10, Math.round(Number(total || 0) * 10)),
      status: 'Received',
      placedAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);
    await writeDb(db);
    return res.status(200).json({ message: 'Order placed successfully!', order: newOrder });
  }

  if (req.method === 'PATCH') {
    const id = req.query?.id || body?.id;
    const { status } = body;
    const order = db.orders.find((o) => String(o.id) === String(id));

    if (!order) {
      return res.status(200).json({ id, status: status || 'Brewing' });
    }

    order.status = status || order.status;
    await writeDb(db);
    return res.status(200).json(order);
  }

  return res.status(200).json(db.orders);
}
