// backend/models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Будемо використовувати для хешування паролів

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ім'я користувача має бути унікальним
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Перед збереженням адміна, хешуємо його пароль
adminSchema.pre('save', async function(next) {
  if (this.isModified('password')) { // Перевіряємо, чи був змінений пароль
    const salt = await bcrypt.genSalt(10); // Генеруємо "сіль" для хешування
    this.password = await bcrypt.hash(this.password, salt); // Хешуємо пароль
  }
  next();
});

// Метод для порівняння введеного пароля з хешованим
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);