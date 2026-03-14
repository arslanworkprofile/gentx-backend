const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  color: { type: String },
  sizes: { type: String, default: 'S,M,L,XL,XXL' },
  image: { type: String, default: null },
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  _id:         { type: String },
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  emoji:       { type: String, default: '👕' },
  image:       { type: String, default: null },
  gallery:     { type: [String], default: [] },
  badge:       { type: String, default: null },
  price:       { type: Number, required: true },
  old_price:   { type: Number, default: null },
  stock:       { type: Number, default: 0 },
  sizes:       { type: [String], default: [] },
  colors:      { type: [String], default: [] },
  variants:    { type: [VariantSchema], default: [] },
  description: { type: String, default: '' },
  featured:    { type: Boolean, default: false },
  active:      { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Product', ProductSchema);
