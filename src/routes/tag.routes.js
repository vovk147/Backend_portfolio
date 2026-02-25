const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tag.controller');

// Читать все
router.get('/', tagController.getAllTags);

// Создать новый
router.post('/', tagController.createTag);

// Обновить (по ID)
router.put('/:id', tagController.updateTag);

// Удалить (по ID)
router.delete('/:id', tagController.deleteTag);

module.exports = router;