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
      endpoint: '/api/register',
      message: 'Bean Scene Registration API is live!',
    });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

  if (req.method === 'POST') {
    const { name, email, password } = body;

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
