// backend/routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const News = require('../models/News'); // Імпортуємо модель News

// --- Маршрути для Новин ---

// @route   GET /api/news
// @desc    Отримати всі новини
// @access  Public (доступно для всіх)
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }); // Знайти всі новини, сортувати за датою створення (новіші перші)
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка сервера');
  }
});

// @route   POST /api/news
// @desc    Створити нову новину
// @access  Private (Тільки для адміністратора - буде додано пізніше)
router.post('/', async (req, res) => {
  const { title, content, imageUrl } = req.body; // Отримуємо дані з тіла запиту

  // Проста валідація
  if (!title || !content) {
    return res.status(400).json({ msg: 'Будь ласка, введіть заголовок та зміст новини' });
  }

  try {
    const newNews = new News({
      title,
      content,
      imageUrl,
    });

    const news = await newNews.save(); // Зберігаємо нову новину в базі даних
    res.status(201).json(news); // Відправляємо назад збережену новину з кодом 201 (Created)
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка сервера');
  }
});

// @route   PUT /api/news/:id
// @desc    Оновити новину за ID
// @access  Private (Тільки для адміністратора)
router.put('/:id', async (req, res) => {
  const { title, content, imageUrl } = req.body;

  // Створюємо об'єкт з полями для оновлення
  const newsFields = {};
  if (title) newsFields.title = title;
  if (content) newsFields.content = content;
  if (imageUrl) newsFields.imageUrl = imageUrl;

  try {
    let news = await News.findById(req.params.id); // Знаходимо новину за ID

    if (!news) {
      return res.status(404).json({ msg: 'Новину не знайдено' });
    }

    // Оновлюємо новину
    news = await News.findByIdAndUpdate(
      req.params.id,
      { $set: newsFields }, // Встановлюємо нові значення
      { new: true }        // Повертаємо оновлений документ
    );

    res.json(news);
  } catch (err) {
    console.error(err.message);
    // Додаткова перевірка, якщо ID не є валідним ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Новину не знайдено' });
    }
    res.status(500).send('Помилка сервера');
  }
});

// @route   DELETE /api/news/:id
// @desc    Видалити новину за ID
// @access  Private (Тільки для адміністратора)
router.delete('/:id', async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id); // Знайти і видалити новину

    if (!news) {
      return res.status(404).json({ msg: 'Новину не знайдено' });
    }

    res.json({ msg: 'Новину видалено успішно' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Новину не знайдено' });
    }
    res.status(500).send('Помилка сервера');
  }
});

module.exports = router;