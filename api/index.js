import { setCorsHeaders } from './_data.js';

export default function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'ok',
    service: 'Bean Scene Coffee & Bakery API',
    endpoints: [
      '/api/products',
      '/api/subscribe',
      '/api/orders',
      '/api/reservations',
      '/api/register',
      '/api/login',
    ],
  });
}

