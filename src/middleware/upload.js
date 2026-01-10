const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Налаштовуємо Cloudinary, використовуючи твої дані з .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_vovk', // Папка у твоєму кабінеті Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }] // Авто-ресайз для швидкості
  },
});

const upload = multer({ storage });

module.exports = upload;