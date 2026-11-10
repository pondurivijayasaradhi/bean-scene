function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

let users = [
  { email: 'admin@beanscene.com', password: 'admin123', name: 'Admin', role: 'admin' },
];

export default function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      endpoint: '/api/login',
      message: 'Bean Scene Login API is live!',
    });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

  if (req.method === 'POST') {
    const { email, password } = body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existing = users.find((u) => u.email === email && u.password === password);
    const name = existing ? existing.name : email.split('@')[0];
    const role = existing ? existing.role : 'customer';

    return res.status(200).json({
      message: 'Login successful',
      token: 'bean-scene-jwt-token',
      user: { name, email, role },
    });
  }

  return res.status(200).json({ message: 'Login endpoint ready' });
}
