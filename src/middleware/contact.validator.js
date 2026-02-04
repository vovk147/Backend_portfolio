const { body, validationResult } = require('express-validator');

// Правила валидации и очистки
const contactValidationRules = [
  // 1. Проверка Имени
  body('name')
    .trim() // Удаляет пробелы по краям
    .notEmpty().withMessage('Имя обязательно') // Не должно быть пустым
    .isLength({ min: 2, max: 50 }).withMessage('Имя должно быть от 2 до 50 символов')
    .escape(), // Превращает <script> в &lt;script&gt; (защита от XSS)

  // 2. Проверка Email
  body('email')
    .trim()
    .notEmpty().withMessage('Email обязателен')
    .isEmail().withMessage('Введите корректный email адрес')
    .normalizeEmail(), // Приводит к стандартному виду (lowercase)

  // 3. Проверка Телефона (опционально, но если есть - проверяем)
  body('phone')
    .optional({ checkFalsy: true }) // Если поле пустое, пропускаем
    .trim()
    .isMobilePhone('any').withMessage('Некорректный номер телефона'), // Проверяет формат телефона

  // 4. Проверка Сообщения
  body('message')
    .trim()
    .notEmpty().withMessage('Сообщение не может быть пустым')
    .isLength({ min: 5, max: 1000 }).withMessage('Сообщение должно быть от 5 до 1000 символов')
    .escape(), // Защита от HTML инъекций
];

// Функция, которая проверяет результат валидации в контроллере
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // Ошибок нет, идем к контроллеру
  }
  
  // Если есть ошибки, возвращаем их клиенту и НЕ идем дальше
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    success: false,
    message: 'Ошибка валидации данных',
    errors: extractedErrors,
  });
};

module.exports = {
  contactValidationRules,
  validate,
};