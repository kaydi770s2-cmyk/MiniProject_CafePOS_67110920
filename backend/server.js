import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ นำ Connection String ของ MongoDB Atlas ของคุณมาวางแทนที่ตรงนี้
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://kaydi770s2_db_user:j1OZflHroWNynhnr@cluster0.kaahbeo.mongodb.net/cafepos?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ เชื่อมต่อ MongoDB สำเร็จ!');
    const count = await Menu.countDocuments();
    if (count === 0) {
      await Menu.insertMany([
        { name: 'อเมริกาโน่เย็น', price: 55, icon: '🧊', category: 'เครื่องดื่ม' },
        { name: 'ลาเต้เย็น', price: 65, icon: '🥛', category: 'เครื่องดื่ม' },
        { name: 'ชาไทยเย็น', price: 50, icon: '🧋', category: 'เครื่องดื่ม' },
        { name: 'มัทฉะลาเต้', price: 75, icon: '🍵', category: 'เครื่องดื่ม' },
        { name: 'ครัวซองต์เนยสด', price: 65, icon: '🥐', category: 'ขนม' },
        { name: 'ชีสเค้กหน้าไหม้', price: 95, icon: '🍰', category: 'ขนม' },
      ]);
      console.log('☕ เพิ่มเมนูเริ่มต้นลง MongoDB เรียบร้อย');
    }
  })
  .catch((err) => console.error('❌ เชื่อมต่อ MongoDB ล้มเหลว:', err));

// --- 1. โครงสร้างตารางเมนู (Menu Model) ---
const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  icon: String,
  category: { type: String, default: 'เครื่องดื่ม' },
});
const Menu = mongoose.model('Menu', menuSchema);

// --- 2. โครงสร้างตารางออเดอร์ (Order Model) ---
const orderSchema = new mongoose.Schema({
  customerName: String,
  items: [
    {
      id: String,
      name: String,
      price: Number,
      icon: String,
      qty: Number,
    },
  ],
  totalPrice: Number,
  paymentMethod: String,
  receivedCash: Number,
  changeAmount: Number,
  status: { type: String, default: 'รออนุมัติ' },
  createdAt: String,
});
const Order = mongoose.model('Order', orderSchema);

// --- API สำหรับจัดการเมนู (Menus) ---
app.get('/api/menus', async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(
      menus.map((m) => ({
        id: m._id,
        name: m.name,
        price: m.price,
        icon: m.icon,
        category: m.category || 'เครื่องดื่ม',
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/menus', async (req, res) => {
  try {
    const newMenu = new Menu(req.body);
    await newMenu.save();
    res.status(201).json({
      id: newMenu._id,
      name: newMenu.name,
      price: newMenu.price,
      icon: newMenu.icon,
      category: newMenu.category,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/menus/:id', async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบเมนูสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API สำหรับจัดการออเดอร์ (Orders) ---
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.json(
      orders.map((o) => ({
        id: o._id,
        customerName: o.customerName,
        items: o.items,
        totalPrice: o.totalPrice,
        paymentMethod: o.paymentMethod,
        receivedCash: o.receivedCash,
        changeAmount: o.changeAmount,
        status: o.status,
        createdAt: o.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order({
      customerName: req.body.customerName?.trim() || 'ลูกค้าหน้าร้าน',
      items: req.body.items,
      totalPrice: req.body.totalPrice,
      paymentMethod: req.body.paymentMethod,
      receivedCash: req.body.receivedCash,
      changeAmount: req.body.changeAmount,
      status: 'รออนุมัติ',
      createdAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    });
    await newOrder.save();
    res.status(201).json({
      id: newOrder._id,
      customerName: newOrder.customerName,
      items: newOrder.items,
      totalPrice: newOrder.totalPrice,
      paymentMethod: newOrder.paymentMethod,
      receivedCash: newOrder.receivedCash,
      changeAmount: newOrder.changeAmount,
      status: newOrder.status,
      createdAt: newOrder.createdAt,
    });
  } catch (err) {
    console.error('❌ บันทึกออเดอร์ไม่สำเร็จ:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบออเดอร์สำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('🚀 Backend Server กำลังรันที่ http://localhost:3000');
});