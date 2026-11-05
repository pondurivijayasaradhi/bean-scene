import { setCorsHeaders } from './_data.js';

let reservations = [];

export default function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(reservations);
  }

  if (req.method === 'POST') {
    const { passId, name, zone, guests, time } = req.body || {};
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

