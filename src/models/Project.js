const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true // Добавляем индекс для быстрого поиска
  },
  
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag' // Это имя модели, на которую мы ссылаемся
  }],
  // Твоя фирменная фишка: STAGE_1, STAGE_2, STAGE_3
  stage: {
    type: String,
    default: 'STAGE_1',
    enum: ['STAGE_1', 'STAGE_2', 'STAGE_3']
  },
  techStack: [{ type: String }],
  mainImage: { type: String, required: true },
  gallery: [{ type: String }],
  links: {
    github: { type: String, trim: true },
    live: { type: String, trim: true }
  },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0, min: 0 },
  translations: {
    uk: {
      title: { type: String, required: true },
      description: String,
      fullCaseStudy: String
    },
    en: {
      title: { type: String, required: true },
      description: String,
      fullCaseStudy: String
    },
    pl: {
      title: { type: String, required: true },
      description: String,
      fullCaseStudy: String
    }
  }
}, {
  timestamps: true,
  // Добавляем виртуальные поля, если понадобится вычислять что-то на лету
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Project', ProjectSchema);