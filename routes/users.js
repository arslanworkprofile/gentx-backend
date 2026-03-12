const express = require('express');
const User    = require('../models/User');
const Order   = require('../models/Order');
const { requireAdmin } = require('../middleware/auth');
const router  = express.Router();

router.get('/', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ created_at: -1 });
    const withOrders = await Promise.all(users.map(async u => {
      const orders = await Order.find({ email: u.email });
      return {
        ...u.toObject(), id: u._id,
        orderCount: orders.length,
        totalSpent: orders.reduce((s,o) => s + (o.total||0), 0),
      };
    }));
    res.json({ ok: true, users: withOrders });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const u = await User.findByIdAndDelete(req.params.id);
    if (!u) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, message: `User ${u.email} deleted` });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
