const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tag.controller');
const auth = require('../middleware/auth'); // 👈 ДОДАЙ ЦЕ!

router.get('/', tagController.getAllTags); // Читати можуть всі
router.post('/', auth, tagController.createTag); // Створювати тільки адмін
router.put('/:id', auth, tagController.updateTag); // Оновлювати тільки адмін
router.delete('/:id', auth, tagController.deleteTag); // Видаляти тільки адмін

module.exports = router;