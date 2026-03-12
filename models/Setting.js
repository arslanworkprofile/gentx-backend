const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  _id:   { type: String },  // key
  value: { type: String },
});

module.exports = mongoose.model('Setting', SettingSchema);
