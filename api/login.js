import { defaultUsers, setCorsHeaders } from './_data.js';

let users = [...defaultUsers];

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

  if (req.method === 'POST') {
    const { email, password } = req.body || {};
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

