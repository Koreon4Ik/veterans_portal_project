// backend/models/Establishment.js
const mongoose = require('mongoose');

const establishmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  // Поле для зв'язку з моделлю Category
  category: {
    type: mongoose.Schema.Types.ObjectId, // Тип даних - ObjectId з MongoDB
    ref: 'Category', // Посилається на модель 'Category'
    required: true,
  },
});

module.exports = mongoose.model('Establishment', establishmentSchema);