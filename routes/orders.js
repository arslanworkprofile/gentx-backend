const express = require('express');
const Order   = require('../models/Order');
const { requireAdmin, requireUser, optionalUser } = require('../middleware/auth');
const router  = express.Router();

const fmt = o => { if (!o) return null; const obj = o.toObject ? o.toObject() : o; return { ...obj, id: obj._id }; };

// Place order
router.post('/', optionalUser, async (req, res) => {
  try {
    const { customer, email, phone, address, items, total, payment, notes } = req.body;
    const missing = [];
    if (!customer) missing.push('customer');
    if (!email)    missing.push('email');
    if (!phone)    missing.push('phone');
    if (!address)  missing.push('address');
    if (!items)    missing.push('items');
    if (total == null) missing.push('total');
    if (missing.length) return res.status(400).json({ error: 'Missing required fields: ' + missing.join(', ') });
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'Cart is empty' });
    const id = 'ORD-' + Date.now();
    const order = await Order.create({ _id: id, customer, email: email.toLowerCase(), phone, address, items, total: parseFloat(total), payment: payment || 'cod', notes: notes || '', status: 'Pending' });
    res.status(201).json({ ok: true, orderId: id, order: fmt(order) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// User's own orders
router.get('/my', requireUser, async (req, res) => {
  try {
    const orders = (await Order.find({ email: req.user.email }).sort({ created_at: -1 })).map(fmt);
    res.json({ ok: true, orders });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Admin: all orders
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) filter.$or = [{ _id: new RegExp(q,'i') }, { customer: new RegExp(q,'i') }, { email: new RegExp(q,'i') }];
    const orders = (await Order.find(filter).sort({ created_at: -1 })).map(fmt);
    const all = await Order.find();
    const stats = {
      total: all.length,
      revenue: all.reduce((s,o) => s + (o.total||0), 0),
      pending: all.filter(o => o.status === 'Pending').length,
      delivered: all.filter(o => o.status === 'Delivered').length,
    };
    res.json({ ok: true, orders, stats });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Single order
router.get('/:id', async (req, res) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, order: fmt(o) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Update status
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending','Processing','Shipped','Delivered','Cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const o = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!o) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, message: `Order ${req.params.id} updated to ${status}` });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Delete order
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const o = await Order.findByIdAndDelete(req.params.id);
    if (!o) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, message: `Order ${req.params.id} deleted` });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
