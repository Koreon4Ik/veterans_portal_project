// backend/routes/establishmentRoutes.js
const express = require('express');
const router = express.Router(); // Ось тут було виправлення
const Establishment = require('../models/Establishment'); // Імпортуємо модель Establishment
const Category = require('../models/Category'); // Імпортуємо модель Category для валідації

// --- Маршрути для Закладів ---

// @route   GET /api/establishments
// @desc    Отримати всі заклади (можна фільтрувати за категорією)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.query; // Отримуємо categoryId з query-параметрів (наприклад, /api/establishments?categoryId=...)
    let query = {};

    if (categoryId) {
      // Перевіряємо, чи існує така категорія, щоб не шукати за неіснуючим ID
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return res.status(404).json({ msg: 'Категорію не знайдено за вказаним ID' });
      }
      query = { category: categoryId };
    }

    // populate('category') замінює category ID на повний об'єкт категорії,
    // вибираючи лише поле 'name' для зменшення обсягу даних
    const establishments = await Establishment.find(query).populate('category', 'name').sort({ name: 1 });
    res.json(establishments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка сервера');
  }
});

// @route   GET /api/establishments/:id
// @desc    Отримати заклад за ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const establishment = await Establishment.findById(req.params.id).populate('category', 'name');

    if (!establishment) {
      return res.status(404).json({ msg: 'Заклад не знайдено' });
    }
    res.json(establishment);
  } catch (err) {
    console.error(err.message);
    // Якщо ID має неправильний формат MongoDB ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Заклад не знайдено' });
    }
    res.status(500).send('Помилка сервера');
  }
});


// @route   POST /api/establishments
// @desc    Створити новий заклад
// @access  Private (Тільки для адміністратора - буде додано пізніше)
router.post('/', async (req, res) => {
  const { name, address, phone, website, description, category } = req.body;

  // Проста валідація вхідних даних
  if (!name || !address || !category) {
    return res.status(400).json({ msg: 'Будь ласка, введіть назву, адресу та ID категорії закладу' });
  }

  try {
    // Перевіряємо, чи існує вказана категорія за її ID
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ msg: 'Вказана категорія не існує' });
    }

    const newEstablishment = new Establishment({
      name,
      address,
      phone,
      website,
      description,
      category, // Зберігаємо ObjectId категорії, який ми отримали
    });

    const establishment = await newEstablishment.save();
    // Повертаємо створений заклад з "населеною" категорією (з назвою категорії)
    res.status(201).json(await establishment.populate('category', 'name'));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Помилка сервера');
  }
});

// @route   PUT /api/establishments/:id
// @desc    Оновити заклад за ID
// @access  Private (Тільки для адміністратора)
router.put('/:id', async (req, res) => {
  const { name, address, phone, website, description, category } = req.body;
  const establishmentFields = {}; // Об'єкт для зберігання полів, які потрібно оновити

  // Додаємо поля до об'єкта, якщо вони присутні у запиті
  if (name) establishmentFields.name = name;
  if (address) establishmentFields.address = address;
  if (phone) establishmentFields.phone = phone;
  if (website) establishmentFields.website = website;
  if (description) establishmentFields.description = description;

  if (category) {
    // Якщо категорію намагаються змінити, перевіряємо, чи існує нова категорія
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ msg: 'Вказана категорія не існує' });
    }
    establishmentFields.category = category;
  }

  try {
    let establishment = await Establishment.findById(req.params.id);

    if (!establishment) {
      return res.status(404).json({ msg: 'Заклад не знайдено' });
    }

    // Оновлюємо заклад за ID
    establishment = await Establishment.findByIdAndUpdate(
      req.params.id,
      { $set: establishmentFields }, // Встановлюємо лише ті поля, які були передані
      { new: true } // Повертаємо оновлений документ
    );

    // Повертаємо оновлений заклад з "населеною" категорією
    res.json(await establishment.populate('category', 'name'));
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Заклад не знайдено' });
    }
    res.status(500).send('Помилка сервера');
  }
});

// @route   DELETE /api/establishments/:id
// @desc    Видалити заклад за ID
// @access  Private (Тільки для адміністратора)
router.delete('/:id', async (req, res) => {
  try {
    const establishment = await Establishment.findByIdAndDelete(req.params.id);

    if (!establishment) {
      return res.status(404).json({ msg: 'Заклад не знайдено' });
    }

    res.json({ msg: 'Заклад видалено успішно' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Заклад не знайдено' });
    }
    res.status(500).send('Помилка сервера');
  }
});

module.exports = router;