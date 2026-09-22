const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const products = [
  { id: 1, name: "Cappuccino", description: "Rich espresso with steamed milk foam", price: 4.50 },
  { id: 2, name: "Latte", description: "Smooth espresso with steamed milk", price: 4.80 },
  { id: 3, name: "Americano", description: "Espresso with hot water", price: 3.50 },
  { id: 4, name: "Iced Coffee", description: "Chilled coffee over ice", price: 4.20 },
  { id: 5, name: "Croissant", description: "Buttery, flaky French pastry", price: 3.90 },
  { id: 6, name: "Blueberry Muffin", description: "Freshly baked with real blueberries", price: 3.50 },
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  console.log("New subscriber:", email);
  res.json({ message: "Subscribed successfully!" });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@beanscene.com" && password === "admin123") {
    res.json({ token: "fake-jwt-token", user: { email, name: "Admin" } });
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
