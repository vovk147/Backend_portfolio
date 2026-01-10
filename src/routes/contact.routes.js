const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/contact.controller');

// Публічний маршрут — будь-який відвідувач може надіслати повідомлення
router.post('/', sendMessage);

module.exports = router;