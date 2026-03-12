const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const Setting  = require('../models/Setting');
const { requireAdmin, requireUser } = require('../middleware/auth');
const router   = express.Router();

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    const storedUser = await Setting.findById('admin_user');
    const storedPass = await Setting.findById('admin_pass');
    if (!storedUser || !storedPass) return res.status(500).json({ error: 'Admin not configured' });
    if (username !== storedUser.value) return res.status(401).json({ error: 'Invalid username or password' });
    if (!bcrypt.compareSync(password, storedPass.value)) return res.status(401).json({ error: 'Invalid username or password' });
    const token = jwt.sign({ username, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ ok: true, token, username });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Change admin credentials
router.post('/admin/change-password', requireAdmin, async (req, res) => {
  try {
    const { newUsername, newPassword } = req.body;
    if (newUsername) await Setting.findByIdAndUpdate('admin_user', { value: newUsername }, { upsert: true });
    if (newPassword) {
      if (newPassword.length < 6) return res.status(400).json({ error: 'Password min 6 characters' });
      await Setting.findByIdAndUpdate('admin_pass', { value: bcrypt.hashSync(newPassword, 10) }, { upsert: true });
    }
    res.json({ ok: true, message: 'Credentials updated' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// User register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (!email.includes('@')) return res.status(400).json({ error: 'Invalid email' });
    if (password.length < 6) return res.status(400).json({ error: 'Password min 6 characters' });
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const id = 'u' + Date.now();
    const user = await User.create({ _id: id, name, email: email.toLowerCase(), password: bcrypt.hashSync(password, 10) });
    const token = jwt.sign({ id, name, email: email.toLowerCase() }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ ok: true, token, user: { id, name, email: email.toLowerCase() } });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ ok: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Get current user
router.get('/me', requireUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Update profile
router.put('/profile', requireUser, async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const update = { name };
    if (password) {
      if (password.length < 6) return res.status(400).json({ error: 'Password min 6 characters' });
      update.password = bcrypt.hashSync(password, 10);
    }
    await User.findByIdAndUpdate(req.user.id, update);
    const token = jwt.sign({ id: req.user.id, name, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ ok: true, token, user: { id: req.user.id, name, email: req.user.email } });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
