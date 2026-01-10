const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Налаштування доступу
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Налаштування сховища для проектів
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_projects', // Папка в твоєму Cloudinary
    allowed_formats: ['jpg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Оптимізація розміру
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
