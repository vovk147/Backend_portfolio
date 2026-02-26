const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Admin' }, // 👈 ДОБАВИЛИ ИМЯ
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Хешуємо пароль перед збереженням
// Хешуємо пароль перед збереженням
UserSchema.pre('save', async function () {
  // Якщо пароль не змінювався, просто виходимо (без next)
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // В кінці теж ніякого next()!
});

module.exports = mongoose.model('User', UserSchema);