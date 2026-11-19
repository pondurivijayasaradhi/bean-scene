function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

let visitors = [
  {
    id: 'vis-1',
    name: 'Vijaya Saradhi',
    email: 'vijayasaradhiponduri@gmail.com',
    action: 'Active Session • Menu & Cup Studio',
    device: 'Chrome • Desktop',
    location: 'India (IN)',
    time: new Date().toISOString(),
  },
];

let registeredUsers = [
  {
    name: 'Admin',
    email: 'admin@beanscene.com',
    role: 'admin',
    lastActive: new Date().toISOString(),
  },
  {
    name: 'Vijaya Saradhi',
    email: 'vijayasaradhiponduri@gmail.com',
    role: 'customer',
    lastActive: new Date().toISOString(),
  },
];

let subscribers = ['vijayasaradhiponduri@gmail.com', 'hello@beanscene.com'];

export default function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const country = req.headers['x-vercel-ip-country'] || 'Global';
  const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : '';
  const locationLabel = city ? `${city}, ${country}` : country;

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      visitors,
      users: registeredUsers,
      subscribers,
    });
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const now = new Date().toISOString();

    if (body.type === 'subscribe' && body.email) {
      if (!subscribers.includes(body.email)) {
        subscribers.unshift(body.email);
      }
    }

    if ((body.type === 'login' || body.type === 'register') && body.email) {
      const existingIdx = registeredUsers.findIndex((u) => u.email === body.email);
      const userObj = {
        name: body.name || body.email.split('@')[0],
        email: body.email,
        role: body.role || 'customer',
        lastActive: now,
      };
      if (existingIdx >= 0) {
        registeredUsers[existingIdx] = userObj;
      } else {
        registeredUsers.unshift(userObj);
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

    visitors = [entry, ...visitors.slice(0, 49)];

    return res.status(200).json({
      status: 'recorded',
      visitor: entry,
      visitors,
      users: registeredUsers,
      subscribers,
    });
  }

  return res.status(200).json({ status: 'ok', visitors, users: registeredUsers, subscribers });
}

