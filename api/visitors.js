import { readDb, writeDb, getDbEngineInfo } from './_db.js';

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
  const dbEngine = getDbEngineInfo();

  const country = req.headers['x-vercel-ip-country'] || 'Global';
  const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : '';
  const locationLabel = city ? `${city}, ${country}` : country;

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      dbEngine,
      visitors: db.visitors,
      users: db.users.map(({ name, email, role, lastActive }) => ({ name, email, role, lastActive })),
      subscribers: db.subscribers,
    });
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const now = new Date().toISOString();

    if (body.type === 'subscribe' && body.email) {
      if (!db.subscribers.includes(body.email)) {
        db.subscribers.unshift(body.email);
      }
    }

    if ((body.type === 'login' || body.type === 'register') && body.email) {
      const existingIdx = db.users.findIndex((u) => u.email === body.email);
      const userObj = {
        name: body.name || body.email.split('@')[0],
        email: body.email,
        role: body.role || 'customer',
        lastActive: now,
      };
      if (existingIdx >= 0) {
        db.users[existingIdx] = { ...db.users[existingIdx], ...userObj };
      } else {
        db.users.unshift(userObj);
      }
    }

    const entry = {
      id: `vis-${Date.now()}`,
      name: body.name || 'Guest Visitor',
      email: body.email || 'Anonymous Session',
      action: body.action || 'Viewing Bean Scene Live App',
      device: body.device || 'Web Browser',
      location: body.location || locationLabel,
      time: now,
    };

    db.visitors = [entry, ...(db.visitors || []).slice(0, 49)];
    await writeDb(db);

    return res.status(200).json({
      status: 'recorded',
      dbEngine,
      visitor: entry,
      visitors: db.visitors,
      users: db.users.map(({ name, email, role, lastActive }) => ({ name, email, role, lastActive })),
      subscribers: db.subscribers,
    });
  }

  return res.status(200).json({
    status: 'ok',
    dbEngine,
    visitors: db.visitors,
    users: db.users.map(({ name, email, role, lastActive }) => ({ name, email, role, lastActive })),
    subscribers: db.subscribers,
  });
}
