// backend/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Назва категорії має бути унікальною
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Category', categorySchema);