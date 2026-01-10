const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  token = req.cookies.jwt; // Ми беремо токен із кук, які створили при вході

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next(); // Пропускаємо далі до контролера
    } catch (error) {
      res.status(401).json({ message: 'Немає доступу, токен недійсний' });
    }
  } else {
    res.status(401).json({ message: 'Немає доступу, токен відсутній' });
  }
};

module.exports = { protect };