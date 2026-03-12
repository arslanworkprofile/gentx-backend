const express  = require('express');
const Category = require('../models/Category');
const { requireAdmin } = require('../middleware/auth');
const router   = express.Router();

const fmt = c => { if (!c) return null; const o = c.toObject ? c.toObject() : c; return { ...o, id: o._id }; };

// Public: active categories
router.get('/', async (req, res) => {
  try {
    const cats = (await Category.find({ active: true }).sort({ created_at: 1 })).map(fmt);
    res.json({ ok: true, categories: cats });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Admin: all categories
router.get('/all', requireAdmin, async (req, res) => {
  try {
    res.json({ ok: true, categories: (await Category.find().sort({ created_at: 1 })).map(fmt) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Create category
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, slug, emoji, image, active } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'Name and slug required' });
    const existing = await Category.findOne({ slug });
    if (existing) return res.status(409).json({ error: 'Slug already exists' });
    const id = 'cat' + Date.now();
    const cat = await Category.create({ _id: id, name, slug, emoji: emoji || '👔', image: image || null, active: active !== false });
    res.status(201).json({ ok: true, category: fmt(cat) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Update category
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const ex = await Category.findById(req.params.id);
    if (!ex) return res.status(404).json({ error: 'Not found' });
    const { name, slug, emoji, image, active } = req.body;
    const update = {};
    if (name !== undefined)   update.name = name;
    if (slug !== undefined)   update.slug = slug;
    if (emoji !== undefined)  update.emoji = emoji;
    if (image !== undefined)  update.image = image;
    if (active !== undefined) update.active = !!active;
    const cat = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ ok: true, category: fmt(cat) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Delete category
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, message: `"${cat.name}" deleted` });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
