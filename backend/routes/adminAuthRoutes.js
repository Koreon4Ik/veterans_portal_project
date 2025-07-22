// backend/routes/adminAuthRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler'); // Для спрощення обробки асинхронних помилок
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Імпортуємо модель Admin

// Допоміжна функція для генерації JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Токен буде дійсним 1 годину
  });
};

// @route   POST /api/admin/login
// @desc    Аутентифікація адміністратора та отримання токена
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // 1. Перевірка, чи існує адміністратор за іменем користувача
  const admin = await Admin.findOne({ username });

  // 2. Якщо адміністратор існує і пароль співпадає
  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id), // Генеруємо і відправляємо JWT токен
    });
  } else {
    res.status(401).json({ message: 'Невірне ім\'я користувача або пароль' });
  }
}));

// @route   POST /api/admin/register
// @desc    Зареєструвати нового адміністратора (Використовується для первинного налаштування)
// @access  Public (МОЖНА ЗРОБИТИ PRIVATE ПІСЛЯ ПЕРШОГО АДМІНА)
router.post('/register', asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Перевірка, чи вже існує адміністратор з таким іменем
  const adminExists = await Admin.findOne({ username });

  if (adminExists) {
    res.status(400).json({ message: 'Адміністратор з таким іменем користувача вже існує' });
    return; // Важливо вийти з функції
  }

  // Створення нового адміністратора (пароль буде автоматично хешований завдяки методу pre('save') в моделі Admin)
  const admin = await Admin.create({
    username,
    password,
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id), // Генеруємо токен для нового адміна
    });
  } else {
    res.status(400).json({ message: 'Недійсні дані адміністратора' });
  }
}));

module.exports = router;