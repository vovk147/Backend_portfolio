const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// 1. Публичные роуты (Доступны всем)
router.get('/', projectController.getAllProjects);
router.get('/slug/:slug', projectController.getProjectBySlug);
router.get('/:id', projectController.getProjectById);

// 2. Защищенные роуты (Только админу)

// Создание (Тут все ок)
router.post('/', 
  auth, 
  upload.fields([
    { name: 'mainImage', maxCount: 1 }, 
    { name: 'gallery', maxCount: 10 }
  ]), 
  projectController.createProject
);

// Обновление (ИСПРАВЛЕННАЯ ВЕРСИЯ)
// Теперь можно обновлять и галерею тоже
router.patch('/:id', 
  auth, 
  upload.fields([
    { name: 'mainImage', maxCount: 1 }, 
    { name: 'gallery', maxCount: 10 }
  ]), 
  projectController.updateProject
);

router.patch('/:id/featured', auth, projectController.toggleFeatured);
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;