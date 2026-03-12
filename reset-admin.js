// Run this ONCE to reset admin credentials in MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI;
const NEW_USER  = process.env.ADMIN_USER || 'admin';
const NEW_PASS  = process.env.ADMIN_PASS || 'gentx2026';

async function reset() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI, { dbName: 'gentx' });
  console.log('Connected!');

  const Setting = require('./models/Setting');

  // Delete old and recreate
  await Setting.deleteMany({ _id: { $in: ['admin_user', 'admin_pass'] } });
  await Setting.create({ _id: 'admin_user', value: NEW_USER });
  await Setting.create({ _id: 'admin_pass', value: bcrypt.hashSync(NEW_PASS, 10) });

  console.log(`✅ Admin reset to: ${NEW_USER} / ${NEW_PASS}`);
  process.exit(0);
}

reset().catch(e => { console.error(e.message); process.exit(1); });
