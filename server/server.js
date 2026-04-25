require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// --- TELEGRAM BOT CONFIG ---
const BOT_TOKEN = process.env.BOT_TOKEN || '8548307430:AAEcOQe8hLxkXbmeVJcQJu__7nPBMuod1v0';
const ADMIN_CHAT_IDS = process.env.ADMIN_CHAT_IDS ? process.env.ADMIN_CHAT_IDS.split(',') : ['587788509', '7496952374'];
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

// --- MONGODB CONNECTION ---
// --- ORDER SCHEMA ---
const OrderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  items: Array,
  subtotal: Number,
  deliveryFee: Number,
  total: Number,
  status: { type: String, default: 'Yangi' },
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// --- IN-MEMORY FALLBACK ---
let orders = []; // Fallback if MongoDB is not connected
let isMongoConnected = false;

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/75burger_db';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB:', mongoURI.includes('127.0.0.1') ? 'Local' : 'Cloud Atlas');
    isMongoConnected = true;
  })
  .catch(err => {
    console.error('Could not connect to MongoDB, using in-memory fallback:', err.message);
    isMongoConnected = false;
  });

// --- IN-MEMORY CONFIG/PRODUCTS ---
let config = {
  deliveryFee: 15000,
  adminUsername: "75burger",
  adminPassword: "75"
};

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
    id: 8,
    categoryId: 'c1',
    name: 'BALIQ',
    description: "Maxsus ziravorlar bilan qovurilgan baliq (1 kg narxi)",
    price: 85000,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80',
    variants: []
  },
  {
    id: 9,
    categoryId: 'c2',
    name: 'COCA-COLA',
    description: "Muzdek Coca-Cola ichimligi",
    price: 7000,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 'v_c1', name: '0.5 L', price: 7000 },
      { id: 'v_c2', name: '1.0 L', price: 12000 },
      { id: 'v_c3', name: '1.5 L', price: 15000 },
      { id: 'v_c4', name: '2.0 L', price: 18000 }
    ]
  },
  {
    id: 10,
    categoryId: 'c2',
    name: 'PEPSI',
    description: "Muzdek Pepsi ichimligi",
    price: 7000,
    image: 'https://t3.ftcdn.net/jpg/04/01/01/08/360_F_401010866_2vtyb52QWBQVzdwU3UUBIisSMx1tBM03.jpg',
    variants: [
      { id: 'v_p1', name: '0.5 L', price: 7000 },
      { id: 'v_p2', name: '1.0 L', price: 12000 },
      { id: 'v_p3', name: '1.5 L', price: 15000 },
      { id: 'v_p4', name: '2.0 L', price: 18000 }
    ]
  },
  {
    id: 11,
    categoryId: 'c2',
    name: 'FANTA',
    description: "Muzdek Fanta ichimligi",
    price: 7000,
    image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 'v_f1', name: '0.5 L', price: 7000 },
      { id: 'v_f2', name: '1.0 L', price: 12000 },
      { id: 'v_f3', name: '1.5 L', price: 15000 },
      { id: 'v_f4', name: '2.0 L', price: 18000 }
    ]
  },
  {
    id: 12,
    categoryId: 'c2',
    name: 'Klassik Milkshake',
    description: "Quyoshli kunlar uchun milkshake",
    price: 20000,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80',
    variants: [
      { id: 'v21', name: 'Shokolad', price: 20000 },
      { id: 'v22', name: 'Banan', price: 20000 },
      { id: 'v23', name: 'Qulupnay', price: 20000 },
    ]
  },
  {
    id: 13,
    categoryId: 'c3',
    name: 'Klassik Chizkeyk',
    description: "Original New York chizkeyki",
    price: 25000,
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=400&q=80',
    variants: []
  }
];
console.log("DEBUG: Products count =", products.length);
console.log("DEBUG: Pepsi variant 1 name =", products.find(p => p.name === 'PEPSI')?.variants[0]?.name);

// --- AUTH ---
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === config.adminUsername && password === config.adminPassword) {
    res.json({ success: true, token: 'admin-secret-token-123' });
  } else {
    res.status(401).json({ success: false, message: 'Login yoki parol xato!' });
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
app.post('/order', async (req, res) => {
  try {
    const newOrderData = req.body;
    const customer = newOrderData.customer || {};

    const orderData = {
      name: customer.name || '',
      phone: customer.phone || '',
      address: customer.address || '',
      items: newOrderData.items || [],
      subtotal: newOrderData.subtotal || 0,
      deliveryFee: newOrderData.deliveryFee || 0,
      total: newOrderData.total || 0,
      status: 'Yangi',
      date: newOrderData.date || new Date()
    };

    let savedOrder;
    let orderNumber;

    if (isMongoConnected) {
      const count = await Order.countDocuments();
      orderNumber = count + 1;
      const newOrder = new Order(orderData);
      savedOrder = await newOrder.save();
      console.log('Order saved to MongoDB');
    } else {
      orderNumber = orders.length + 1;
      savedOrder = { ...orderData, _id: 'mem_' + Date.now() };
      orders.push(savedOrder);
      console.log('Order saved to Memory (Fallback)');
    }

    // --- TELEGRAM NOTIFICATION ---
    const itemsList = savedOrder.items.map(item =>
      `- ${item.name}${item.variant ? ` (${item.variant.name})` : ''} x${item.unit === 'kg' ? item.quantity.toFixed(2) : item.quantity}${item.unit === 'kg' ? 'kg' : ''}`
    ).join('\n');

    const message = `
🚀 *YANGI BUYURTMA #${orderNumber}*

👤 *Mijoz:* ${savedOrder.name}
📞 *Tel:* ${savedOrder.phone}
📍 *Manzil:* ${savedOrder.address}

🍱 *Taomlar:*
${itemsList}

💰 *Jami:* ${savedOrder.total.toLocaleString()} UZS
📅 *Sana:* ${new Date(savedOrder.date).toLocaleString('uz-UZ')}

#buyurtma #${orderNumber}
    `;

    ADMIN_CHAT_IDS.forEach(chatId => {
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
        .then(() => console.log(`Telegram sent to ${chatId}`))
        .catch(err => console.error(`Telegram error (${chatId}):`, err.message));
    });

    res.status(200).json({ success: true, order: { ...savedOrder, id: savedOrder._id } });
  } catch (error) {
    console.error("Order process error:", error);
    res.status(500).json({ success: false, message: 'Serverda xatolik' });
  }
});

app.get('/orders', async (req, res) => {
  try {
    if (isMongoConnected) {
      const allOrders = await Order.find().sort({ date: -1 });
      res.status(200).json({ success: true, orders: allOrders });
    } else {
      res.status(200).json({ success: true, orders: [...orders].reverse() });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Serverda xatolik' });
  }
});

app.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isMongoConnected && !id.startsWith('mem_')) {
      const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
      return res.json({ success: true, order: updatedOrder });
    } else {
      const order = orders.find(o => o._id === id);
      if (order) {
        order.status = status;
        return res.json({ success: true, order });
      }
    }
    res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Serverda xatolik' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server is running on http://localhost:${PORT}`);
});
