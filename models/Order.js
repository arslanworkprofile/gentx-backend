const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  _id:      { type: String },
  customer: { type: String, required: true },
  email:    { type: String, required: true },
  phone:    { type: String, required: true },
  address:  { type: String, required: true },
  items:    { type: mongoose.Schema.Types.Mixed, default: [] },
  total:    { type: Number, required: true },
  payment:  { type: String, default: 'cod' },
  notes:    { type: String, default: '' },
  status:   { type: String, default: 'Pending', enum: ['Pending','Processing','Shipped','Delivered','Cancelled'] },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Order', OrderSchema);
