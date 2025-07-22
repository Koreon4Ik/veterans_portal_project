// backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category'); // Імпортуємо модель Category

// --- Маршрути для Категорій ---

// @route   GET /api/categories
// @desc    Отримати всі категорії
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }); // Сортуємо за назвою
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка сервера');
  }
});

// @route   POST /api/categories
// @desc    Створити нову категорію
// @access  Private (Тільки для адміністратора)
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ msg: 'Будь ласка, введіть назву категорії' });
  }

  try {
    let category = await Category.findOne({ name }); // Перевіряємо, чи існує категорія з таким ім'ям
    if (category) {
      return res.status(400).json({ msg: 'Категорія з такою назвою вже існує' });
    }

    const newCategory = new Category({
      name,
      description,
    });

    category = await newCategory.save();
    res.status(201).json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка сервера');
  }
});

// @route   PUT /api/categories/:id
// @desc    Оновити категорію за ID
// @access  Private (Тільки для адміністратора)
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;
  const categoryFields = {};
  if (name) categoryFields.name = name;
  if (description) categoryFields.description = description;

  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: 'Категорію не знайдено' });
    }

    // Додаткова перевірка на унікальність імені при оновленні
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ msg: 'Категорія з такою назвою вже існує' });
      }
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: categoryFields },
      { new: true }
    );

    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Категорію не знайдено' });
    }
    res.status(500).send('Помилка сервера');
  }
});

// @route   DELETE /api/categories/:id
// @desc    Видалити категорію за ID
// @access  Private (Тільки для адміністратора)
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: 'Категорію не знайдено' });
    }

    // ДОДАТКОВО: Можливо, варто видаляти заклади, що належать цій категорії
    // або призначати їм null-категорію, в залежності від логіки.
    // Наразі ми просто видаляємо категорію, заклади з цією category_id залишаться, але без зв'язку.
    // await Establishment.deleteMany({ category: req.params.id });

    res.json({ msg: 'Категорію видалено успішно' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Категорію не знайдено' });
    }
    res.status(500).send('Помилка сервера');
  }
});

module.exports = router;