const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Публичные роуты (для твоего сайта на React)
router.get('/', projectController.getAllProjects);
router.get('/slug/:slug', projectController.getProjectBySlug); // Для красивых ссылок
router.get('/:id', projectController.getProjectById);

// Защищенные роуты (только для тебя, через Postman или админку)
router.post('/', 
  auth, 
  upload.fields([
    { name: 'mainImage', maxCount: 1 }, 
    { name: 'gallery', maxCount: 10 }
  ]), 
  projectController.createProject
);

router.patch('/:id', 
  auth, 
  upload.single('mainImage'), 
  projectController.updateProject
);

router.patch('/:id/featured', auth, projectController.toggleFeatured);
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;