const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/contact.controller');
const { contactValidationRules, validate } = require('../middleware/contact.validator');
const rateLimit = require('express-rate-limit');

// Настройка лимитера: Максимум 5 заявок с одного IP за 1 час
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 5, // Лимит запросов
  message: {
    success: false,
    message: "Слишком много заявок с вашего IP, попробуйте позже."
  },
  standardHeaders: true, // Возвращает инфо о лимитах в заголовках
  legacyHeaders: false,
});

// Публичный маршрут
// Сначала лимитер -> Потом правила валидации -> Потом проверка ошибок -> Потом контроллер
router.post(
  '/', 
  contactLimiter, 
  contactValidationRules, 
  validate, 
  sendMessage
);

module.exports = router;