const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  _id:    { type: String },
  name:   { type: String, required: true },
  slug:   { type: String, required: true, unique: true },
  emoji:  { type: String, default: '👔' },
  image:  { type: String, default: null },
  active: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Category', CategorySchema);
