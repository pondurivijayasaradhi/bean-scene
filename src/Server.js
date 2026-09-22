const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let users = [
  { email: "admin@beanscene.com", password: "admin123", name: "Admin" }
];

let orders = [];

const products = [
  { id: 1, name: "Cappuccino", description: "Rich espresso with steamed milk foam", price: 4.50 },
  { id: 2, name: "Latte", description: "Smooth espresso with steamed milk", price: 4.80 },
  { id: 3, name: "Americano", description: "Espresso with hot water", price: 3.50 },
  { id: 4, name: "Iced Coffee", description: "Chilled coffee over ice", price: 4.20 },
  { id: 5, name: "Croissant", description: "Buttery, flaky French pastry", price: 3.90 },
  { id: 6, name: "Blueberry Muffin", description: "Freshly baked with real blueberries", price: 3.50 }
];

// Get Products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Subscribe
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  console.log("New subscriber:", email);
  res.json({ message: "Subscribed successfully!" });
});

// Register
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "Email already registered" });
  }

  users.push({ name, email, password });
  res.json({ message: "Registration successful!", user: { name, email } });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({
      message: "Login successful",
      token: "fake-jwt-token",
      user: { name: user.name, email: user.email }
    });
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

// Place Order
app.post('/api/orders', (req, res) => {
  const { items, total, user, email } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const newOrder = {
    id: orders.length + 1,
    items,
    total,
    user: user || "Guest",
    email: email || "guest@beanscene.com",
    status: "Received",
    placedAt: new Date().toISOString()
  };

  orders.push(newOrder);
  console.log("New Order:", newOrder);

  res.json({ message: "Order placed successfully!", order: newOrder });
});

// Get Orders (Order History)
app.get('/api/orders', (req, res) => {
  const { email } = req.query;

  if (email) {
    const userOrders = orders.filter(order => order.email === email);
    return res.json(userOrders);
  }

  res.json(orders);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});