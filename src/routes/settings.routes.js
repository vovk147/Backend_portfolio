const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settings.controller');
const auth = require('../middleware/auth'); // 👈 Імпортуємо твій захист

router.get('/', getSettings); 
router.post('/', auth, updateSettings); // 👈 Додали auth! Тепер хакери не пройдуть.

module.exports = router;