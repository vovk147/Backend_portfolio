const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes')
const projectRoutes = require('./routes/project.routes');



// 1. Підключаємо базу даних
connectDB();

const app = express();

// 2. Налаштування (Middlewares)
app.use(express.json()); // Щоб сервер розумів JSON-дані
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));  // Щоб фронтенд міг робити запити
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes);
app.use('/api/settings', require('./routes/settings.routes')); 
app.use('/api/contact', require('./routes/contact.routes'));

// 3. Тестовий роут, щоб перевірити, чи все працює
app.get('/', (req, res) => {
    res.send('Сервер Євгена Вовка запущений! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер працює на порту ${PORT}`);
});