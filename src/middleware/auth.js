const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('⚠️ Спроба доступу без токена');
      return res.status(401).json({ message: 'Авторизація відхилена' });
    }

    const token = authHeader.split(' ')[1];
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded.userId; 

    next();
  } catch (err) {
    console.error('❌ Помилка авторизації:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Сесія закінчилася, увійдіть знову' });
    }
    
    return res.status(401).json({ message: 'Токен недійсний' });
  }
};