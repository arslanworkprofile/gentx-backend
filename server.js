require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');

const app = express();

// Middleware
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/users',      require('./routes/users'));
app.use('/api/settings',   require('./routes/settings'));

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

// Catch-all — serve frontend
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: err.message });
});

// ── Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

async function start() {
  // Check MONGO_URI exists
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not set! Add it in Railway Variables tab.');
    process.exit(1);
  }

  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'gentx' });
    console.log('✅ MongoDB connected');

    // Always force-reset admin credentials from environment variables
    const Setting = require('./models/Setting');
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'gentx2026';

    // Delete old and recreate to ensure clean credentials
    await Setting.deleteOne({ _id: 'admin_user' });
    await Setting.deleteOne({ _id: 'admin_pass' });
    await Setting.create({ _id: 'admin_user', value: adminUser });
    await Setting.create({ _id: 'admin_pass', value: bcrypt.hashSync(adminPass, 10) });
    await Setting.findByIdAndUpdate('store_name', { value: 'GENTX' }, { upsert: true });
    await Setting.findByIdAndUpdate('currency',   { value: 'PKR' },   { upsert: true });
    console.log(`🔑 Admin ready — username: ${adminUser} / password: ${adminPass}`);

    // Start server AFTER DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 GENTX live at port ${PORT}`);
      console.log(`📦 Database: MongoDB Atlas ✅`);
      console.log(`🌐 Frontend: /public`);
    });

  } catch(err) {
    console.error('❌ Startup failed:', err.message);
    process.exit(1);
  }
}

start();
