import { setCorsHeaders } from './_data.js';

let subscribers = ['hello@beanscene.com'];

export default function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      endpoint: '/api/subscribe',
      message: 'Bean Scene Newsletter Subscription API is live!',
      promoCode: 'FIRST10',
      subscribersCount: subscribers.length,
    });
  }

  if (req.method === 'POST') {
    const { email } = req.body || {};
    if (email && !subscribers.includes(email)) {
      subscribers.push(email);
    }
    return res.status(200).json({
      message: 'Subscribed successfully!',
      promoCode: 'FIRST10',
      email: email || null,
    });
  }

  return res.status(200).json({
    message: 'Subscribed successfully!',
    promoCode: 'FIRST10',
  });
}

