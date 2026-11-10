function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

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
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { email } = body;
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
