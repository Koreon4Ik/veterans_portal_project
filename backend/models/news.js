// backend/models/News.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Обрізає пробіли на початку та в кінці рядка
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '', // Може бути порожнім, якщо немає зображення
  },
  createdAt: {
    type: Date,
    default: Date.now, // Автоматично встановлює поточну дату
  },
});

module.exports = mongoose.model('News', newsSchema);