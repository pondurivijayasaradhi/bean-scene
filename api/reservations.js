function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

let reservations = [];

export default function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(reservations);
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

  if (req.method === 'POST') {
    const { passId, name, zone, guests, time } = body;
    const booking = {
      passId: passId || `VIP-${Math.floor(100 + Math.random() * 900)}`,
      name: name || 'Valued Guest',
      zone: zone || 'Sunlit Window Booth',
      guests: guests || '2 Guests',
      time: time || '10:30 AM',
      createdAt: new Date().toISOString(),
    };

    reservations.unshift(booking);
    return res.status(201).json(booking);
  }

  return res.status(200).json(reservations);
}
