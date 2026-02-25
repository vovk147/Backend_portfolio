const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// --- ЗАЩИТА (SECURITY PACKAGES) ---
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
// const xss = require('xss-clean'); <--- ВИДАЛИЛИ, ВОНА ЛАМАЛА СЕРВЕР

// Импорт роутов
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const tagRoutes = require('./routes/tag.routes'); 

// 1. Підключаємо базу даних
connectDB();

const app = express();

// --- НАСТРОЙКА ЗАЩИТЫ (MIDDLEWARES) ---

// 1. Set Security Headers
app.use(helmet());

// 2. Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100,
  message: 'Слишком много запросов с этого IP, попробуйте позже.'
});
app.use('/api', limiter);

// 3. CORS
app.use(cors({ 
    origin: 'http://localhost:3000', 
    credentials: true 
}));

// 4. Body Parser
app.use(express.json({ limit: '10kb' }));

// 5. РУЧНАЯ ЗАЩИТА (Sanitization)
// Заменяет глючные библиотеки express-mongo-sanitize и xss-clean
app.use((req, res, next) => {
    const sanitize = (obj) => {
        if (obj instanceof Object) {
            for (const key in obj) {
                // 1. Защита от Mongo Injection (убираем $)
                if (/^\$/.test(key)) {
                    delete obj[key];
                    continue;
                }
                // 2. Простая защита от XSS (превращаем <script> в текст)
                if (typeof obj[key] === 'string') {
                    obj[key] = obj[key]
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;");
                }
                // Рекурсия
                sanitize(obj[key]);
            }
        }
    };

    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);

    next();
});

// 6. Prevent Parameter Pollution
app.use(hpp());

// Доступ к папке с картинками
app.use('/uploads', express.static('uploads'));

// --- РОУТЫ ---
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/contact', require('./routes/contact.routes'));

// Тестовий роут
app.get('/', (req, res) => {
    res.send('Сервер Євгена Вовка працює стабільно! 🛡️');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🛡️  Сервер працює на порту ${PORT}`);
});