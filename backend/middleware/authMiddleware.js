// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Перевіряємо, чи є токен в заголовку Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Отримуємо токен з заголовка (рядок виглядатиме як "Bearer ТОКЕН")
      token = req.headers.authorization.split(' ')[1];

      // Розшифровуємо токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Знаходимо адміністратора за ID з токена і прикріплюємо його до об'єкта запиту
      // Ми виключаємо пароль з результату запиту
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        res.status(401);
        throw new Error('Не авторизовано, токен недійсний');
      }

      next(); // Продовжуємо до наступного middleware або маршруту
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Не авторизовано, токен відсутній або недійсний');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Не авторизовано, токен відсутній');
  }
});

module.exports = { protect };