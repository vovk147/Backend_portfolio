const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const auth = require('../middleware/auth'); // Захист для адміна

// Ці роути працюють тільки для адмінки
router.get('/', auth, messageController.getMessages);
router.patch('/:id', auth, messageController.updateMessageStatus);
router.delete('/:id', auth, messageController.deleteMessage);

module.exports = router;