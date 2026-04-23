const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// --- IN-MEMORY DATABASE ---
let config = {
  deliveryFee: 15000,
  adminPassword: "admin" // Simple hardcoded password for now
};

let orders = [];

let categories = [
  { id: 'c1', name: '🍔 Taomlar' },
  { id: 'c2', name: '🥤 Ichimliklar' },
  { id: 'c3', name: '🍰 Shirinliklar' },
  { id: 'c4', name: '🥗 Salatlar' }
];

let products = [
  {
    id: 1,
    categoryId: 'c1',
    name: 'KFC',
    description: "tovuq go'shti, un, qalampir, ziravorlar, kungaboqar yog'iga qovurilgan",
    price: 30000,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 'v1', name: '1 PORSIYA', price: 30000 },
      { id: 'v2', name: '0.5 KG', price: 45000 },
      { id: 'v3', name: '1 KG', price: 85000 },
    ]
  },
  {
    id: 2,
    categoryId: 'c1',
    name: 'LAVASH',
    description: "lavash noni, kartoshka, pomidor, salat bargi, go'sht, sous, mayanez",
    price: 35000,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 'v4', name: 'OBICHNIY', price: 35000 },
      { id: 'v5', name: 'SIRNIY', price: 40000 },
    ]
  },
  {
    id: 3,
    categoryId: 'c1',
    name: 'PITSA',
    description: "Maxsus xamir, pishloq va masalliqlar bilan",
    price: 70000,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 'v6', name: 'Kichik', price: 70000 },
      { id: 'v7', name: 'O\'rta', price: 80000 },
      { id: 'v8', name: 'Katta', price: 90000 },
    ]
  },
  {
    id: 4,
    categoryId: 'c1',
    name: 'PITA',
    description: "non, go'sht, pomidor, tomat sousi, sarimsoq piyoz sousi",
    price: 35000,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 'v9', name: 'OBICHNIY', price: 35000 },
      { id: 'v10', name: 'BIG', price: 40000 },
    ]
  },
  {
    id: 5,
    categoryId: 'c1',
    name: 'GAMBURGER',
    description: "gamburger noni, mol go'shtidan katlet, salat bargi, pomidor, sho'r bodring, pishloq, ketchup, mayanez",
    price: 35000,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 'v11', name: 'GAMBURGER', price: 35000 },
      { id: 'v12', name: 'BIGBURGER', price: 45000 },
    ]
  },
  {
    id: 6,
    categoryId: 'c1',
    name: 'HOT DOG',
    description: "hotdog noni, sosiska, pomidor, bodring, ketchup, mayanez",
    price: 15000,
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 'v13', name: '15.000', price: 15000 },
      { id: 'v14', name: '20.000', price: 20000 },
      { id: 'v15', name: 'GO\'SHTLI', price: 25000 },
      { id: 'v16', name: 'BIG', price: 35000 },
    ]
  },
  {
    id: 7,
    categoryId: 'c1',
    name: 'GRIL',
    description: "Mazza qilib pishirilgan tovuq gril",
    price: 75000,
    image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=400&q=80',
    variants: []
  },
  {
    id: 8,
    categoryId: 'c1',
    name: 'BALIQ',
    description: "Maxsus ziravorlar bilan qovurilgan baliq",
    price: 70000,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80',
    variants: []
  },
  {
    id: 9,
    categoryId: 'c2',
    name: 'Fresh Mojito',
    description: "Muzdek qulupnay yoki yalpizli mojito",
    price: 15000,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 'v17', name: 'Qulupnayli', price: 15000 },
      { id: 'v18', name: 'Yalpizli', price: 15000 },
    ]
  },
  {
    id: 10,
    categoryId: 'c2',
    name: 'Coca-Cola',
    description: "Yaxna ichimlik",
    price: 7000,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 'v19', name: '0.5 L', price: 7000 },
      { id: 'v20', name: '1 L', price: 12000 },
    ]
  },
  {
    id: 11,
    categoryId: 'c2',
    name: 'Klassik Milkshake',
    description: "Quyoshli kunlar uchun muzdek milkshake",
    price: 20000,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 'v21', name: 'Shokolad', price: 20000 },
      { id: 'v22', name: 'Banan', price: 20000 },
      { id: 'v23', name: 'Qulupnay', price: 20000 },
    ]
  },
  {
    id: 12,
    categoryId: 'c3',
    name: 'Klassik Chizkeyk',
    description: "Original New York chizkeyki, qulupnay qiyomi bilan",
    price: 25000,
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=400&q=80',
    variants: []
  },
  {
    id: 13,
    categoryId: 'c3',
    name: 'Shirin Lavash',
    description: "Nutella va banan bo'laklari bilan shirin lavash",
    price: 20000,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=80',
    variants: []
  }
];

// --- AUTH ---
app.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === config.adminPassword) {
    res.json({ success: true, token: 'admin-secret-token-123' });
  } else {
    res.status(401).json({ success: false, message: 'Parol xato!' });
  }
});

// --- DATA ---
app.get('/data', (req, res) => {
  res.json({
    success: true,
    categories,
    products,
    deliveryFee: config.deliveryFee
  });
});

app.put('/config', (req, res) => {
  const { deliveryFee } = req.body;
  if (deliveryFee !== undefined) config.deliveryFee = deliveryFee;
  res.json({ success: true, deliveryFee: config.deliveryFee });
});

// --- CATEGORIES CRUD ---
app.post('/categories', (req, res) => {
  const newCat = { id: 'c' + Date.now(), name: req.body.name };
  categories.push(newCat);
  res.json({ success: true, category: newCat });
});

app.put('/categories/:id', (req, res) => {
  const cat = categories.find(c => c.id === req.params.id);
  if (cat) {
    cat.name = req.body.name;
    res.json({ success: true, category: cat });
  } else {
    res.status(404).json({ success: false, message: 'Category not found' });
  }
});

app.delete('/categories/:id', (req, res) => {
  categories = categories.filter(c => c.id !== req.params.id);
  // Optional: delete related products or move them
  res.json({ success: true });
});

// --- PRODUCTS CRUD ---
app.post('/products', (req, res) => {
  const newProd = { ...req.body, id: Date.now() };
  if (!newProd.variants) newProd.variants = [];
  products.push(newProd);
  res.json({ success: true, product: newProd });
});

app.put('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json({ success: true, product: products[index] });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});

app.delete('/products/:id', (req, res) => {
  products = products.filter(p => p.id != req.params.id);
  res.json({ success: true });
});

// --- ORDERS ---
app.post('/order', (req, res) => {
  const newOrder = req.body;
  const orderToStore = {
    id: Date.now(),
    ...newOrder,
    status: 'Yangi', // Status can be: Yangi, Qabul qilindi, Yetkazildi, Bekor qilindi
    date: newOrder.date || new Date().toISOString()
  };
  orders.push(orderToStore);
  console.log('\n--- YANGI BUYURTMA ---');
  console.log(JSON.stringify(orderToStore, null, 2));
  res.status(200).json({ success: true, order: orderToStore });
});

app.get('/orders', (req, res) => {
  res.status(200).json({ success: true, orders });
});

app.put('/orders/:id/status', (req, res) => {
  const order = orders.find(o => o.id == req.params.id);
  if (order) {
    order.status = req.body.status;
    res.json({ success: true, order });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server is running on http://localhost:${PORT}`);
});
