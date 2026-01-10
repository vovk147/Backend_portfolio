const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

// Захищені роути
// Тепер бекенд приймає 1 обкладинку та до 10 фото для слайдера
// Змінюємо upload.single на upload.fields
router.post('/', auth, upload.fields([
  { name: 'mainImage', maxCount: 1 }, 
  { name: 'gallery', maxCount: 10 }
]), projectController.createProject);
router.patch('/:id', auth, upload.single('mainImage'), projectController.updateProject);
router.patch('/:id/featured', auth, projectController.toggleFeatured); // <-- ДОДАНО
router.delete('/:id', auth, projectController.deleteProject);
upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'gallery', maxCount: 10 }])

module.exports = router; 