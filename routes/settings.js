const express = require('express');
const Setting = require('../models/Setting');
const Product = require('../models/Product');
const Category= require('../models/Category');
const Order   = require('../models/Order');
const User    = require('../models/User');
const { requireAdmin } = require('../middleware/auth');
const router  = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await Setting.find({ _id: { $ne: 'admin_pass' } });
    const settings = {};
    rows.forEach(r => settings[r._id] = r.value);
    res.json({ ok: true, settings });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.put('/', requireAdmin, async (req, res) => {
  try {
    const allowed = ['store_name','tagline','announcement','currency','free_shipping_min'];
    for (const [key, value] of Object.entries(req.body)) {
      if (allowed.includes(key)) await Setting.findByIdAndUpdate(key, { value: String(value) }, { upsert: true });
    }
    res.json({ ok: true, message: 'Settings updated' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const [totalProducts, activeProducts, totalCats, allOrders, totalUsers, recentOrders, recentProducts] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ active: true }),
      Category.countDocuments(),
      Order.find(),
      User.countDocuments(),
      Order.find().sort({ created_at: -1 }).limit(5),
      Product.find().sort({ created_at: -1 }).limit(6),
    ]);
    const stats = {
      totalProducts, activeProducts, totalCats,
      totalOrders: allOrders.length,
      pendingOrders: allOrders.filter(o => o.status === 'Pending').length,
      totalRevenue: allOrders.reduce((s,o) => s + (o.total||0), 0),
      totalUsers,
    };
    res.json({ ok: true, stats, recentOrders, recentProducts });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
