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
      endpoint: '/api/register',
      message: 'Bean Scene Registration API is live!',
    });
  }

  if (req.method === 'POST') {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = users.find((user) => user.email === email);
    if (!existingUser) {
      users.push({ name, email, password, role: 'customer' });
    }

    return res.status(200).json({
      message: 'Registration successful!',
      user: { name, email },
    });
  }

  return res.status(200).json({ message: 'Registration endpoint ready' });
}

