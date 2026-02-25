const mongoose = require('mongoose');
const slugify = require('slugify');

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  color: {
    type: String,
    default: '#333' // Серый по умолчанию
  },
  slug: {
    type: String,
    unique: true,
    index: true
  }
});

// --- ИСПРАВЛЕНИЕ ОШИБКИ ТУТ ---
// Мы используем async/await, поэтому 'next' нам больше не нужен.
// Mongoose сам поймет, когда функция закончится.
TagSchema.pre('save', async function() {
  // Если имя не менялось, ничего не делаем
  if (!this.isModified('name')) return;

  // Генерируем slug (например: "React JS" -> "react-js")
  this.slug = slugify(this.name, { lower: true, strict: true });
});

module.exports = mongoose.model('Tag', TagSchema);