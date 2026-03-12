const express = require('express');
const Product = require('../models/Product');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

const fmt = p => {
  if (!p) return null;
  const o = p.toObject ? p.toObject() : p;
  return { ...o, id: o._id, oldPrice: o.old_price || null, desc: o.description || '' };
};

// Public: active products
router.get('/', async (req, res) => {
  try {
    const { category, featured, q } = req.query;
    const filter = { active: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (q) filter.$or = [{ name: new RegExp(q,'i') }, { description: new RegExp(q,'i') }];
    const products = (await Product.find(filter).sort({ created_at: -1 })).map(fmt);
    res.json({ ok: true, products });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Admin: all products
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.$or = [{ name: new RegExp(q,'i') }, { description: new RegExp(q,'i') }];
    res.json({ ok: true, products: (await Product.find(filter).sort({ created_at: -1 })).map(fmt) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Single product
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, product: fmt(p) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Create product
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, category, emoji, image, gallery, badge, price, oldPrice, stock, sizes, colors, description, featured, active } = req.body;
    if (!name || !price || !category) return res.status(400).json({ error: 'Name, price and category required' });
    const id = 'p' + Date.now();
    const p = await Product.create({
      _id: id, name, category,
      emoji: emoji || '👕',
      image: image || null,
      gallery: gallery || [],
      badge: badge || null,
      price: parseFloat(price),
      old_price: oldPrice ? parseFloat(oldPrice) : null,
      stock: parseInt(stock) || 0,
      sizes: Array.isArray(sizes) ? sizes : (sizes ? sizes.split(',').map(s=>s.trim()) : []),
      colors: Array.isArray(colors) ? colors : (colors ? colors.split(',').map(c=>c.trim()) : []),
      description: description || '',
      featured: !!featured,
      active: active !== false,
    });
    res.status(201).json({ ok: true, product: fmt(p) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Update product
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const ex = await Product.findById(req.params.id);
    if (!ex) return res.status(404).json({ error: 'Not found' });
    const { name, category, emoji, image, gallery, badge, price, oldPrice, stock, sizes, colors, description, featured, active } = req.body;
    const update = {};
    if (name !== undefined)        update.name = name;
    if (category !== undefined)    update.category = category;
    if (emoji !== undefined)       update.emoji = emoji;
    if (image !== undefined)       update.image = image;
    if (gallery !== undefined)     update.gallery = gallery;
    if (badge !== undefined)       update.badge = badge;
    if (price !== undefined)       update.price = parseFloat(price);
    if (oldPrice !== undefined)    update.old_price = oldPrice ? parseFloat(oldPrice) : null;
    if (stock !== undefined)       update.stock = parseInt(stock);
    if (sizes !== undefined)       update.sizes = Array.isArray(sizes) ? sizes : sizes.split(',').map(s=>s.trim());
    if (colors !== undefined)      update.colors = Array.isArray(colors) ? colors : colors.split(',').map(c=>c.trim());
    if (description !== undefined) update.description = description;
    if (featured !== undefined)    update.featured = !!featured;
    if (active !== undefined)      update.active = !!active;
    const p = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ ok: true, product: fmt(p) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Delete product
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, message: `"${p.name}" deleted` });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
