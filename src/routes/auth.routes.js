const express = require('express');
const router = express.Router();
const { loginUser, logoutUser, registerUser } = require('../controllers/auth.controller');

// 1. Імпортуємо БЕЗ фігурних дужок
const auth = require('../middleware/auth'); 

router.post('/login', loginUser);
router.post('/logout', logoutUser);

// 2. Ставимо auth БЕЗ круглих дужок перед registerUser
router.post('/register', auth, registerUser); 

module.exports = router;