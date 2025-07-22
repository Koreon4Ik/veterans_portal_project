// backend/server.js

// 1. Завантажуємо змінні середовища з файлу .env
require('dotenv').config();

// 2. Імпортуємо необхідні бібліотеки
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 3. Імпортуємо файли маршрутів
const newsRoutes = require('./routes/newsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const establishmentRoutes = require('./routes/establishmentRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes'); // <-- Тепер імпортуємо маршрути адміна

// 4. Імпортуємо middleware для захисту маршрутів
const { protect } = require('./middleware/authMiddleware'); // <-- Імпортуємо 'protect' middleware

// 5. Ініціалізуємо Express додаток
const app = express();
const PORT = process.env.PORT || 5000;

// --- 6. Проміжне ПЗ (Middleware) ---
app.use(express.json());
app.use(cors());

// --- 7. Підключення до MongoDB ---
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
  .then(() => console.log('Підключено до MongoDB успішно!'))
  .catch(err => console.error('Помилка підключення до MongoDB:', err));

// --- 8. Підключення маршрутів API ---
// Маршрути для аутентифікації адміністратора (ПУБЛІЧНІ)
app.use('/api/admin', adminAuthRoutes); // <-- Підключаємо маршрути адміна

// Захищені маршрути (Тільки для авторизованих адміністраторів)
// Ми застосовуємо middleware 'protect' до цих маршрутів
app.use('/api/news', protect, newsRoutes); // <-- Додано 'protect'
app.use('/api/categories', protect, categoryRoutes); // <-- Додано 'protect'
app.use('/api/establishments', protect, establishmentRoutes); // <-- Додано 'protect'

// --- 9. Тестовий маршрут (для перевірки, що сервер працює) ---
app.get('/', (req, res) => {
  res.send('Бекенд порталу ветеранів працює!');
});

// --- 10. Запуск сервера ---
app.listen(PORT, () => {
  console.log(`Сервер працює на порті ${PORT}`);
});