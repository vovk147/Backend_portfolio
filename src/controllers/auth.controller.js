const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Вхід адміністратора
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Перевіряємо пароль
    if (user && (await bcrypt.compare(password, user.password))) {
      
      // 1. Геруємо токен (він і в куки запишеться, і повернеться нам у змінну)
      const token = generateToken(res, user._id);

      // 2. Відправляємо JSON разом із токеном
      res.json({
        _id: user._id,
        email: user.email,
        token: token, // <--- ЦЕЙ РЯДОК ВИРІШУЄ ВСЕ
      });
      
    } else {
      res.status(401).json({ message: 'Невірний email або пароль' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Вихід
// @route   POST /api/auth/logout
exports.logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Вихід успішний' });
};

// @desc    Реєстрація (якщо треба створити нового адміна)
exports.registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Користувач вже існує' });

    const user = await User.create({ email, password });

    if (user) {
      const token = generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        email: user.email,
        token: token, // <--- ТУТ ТАКОЖ ДОДАЄМО
        message: "Адміністратора створено успішно!"
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};