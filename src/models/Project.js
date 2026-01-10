const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  techStack: [{ type: String }],
  mainImage: { type: String, required: true },
  gallery: [{ type: String }],
  links: {
    github: String,
    live: String
  },
  isFeatured: { type: Boolean, default: false },
  // Поле для ручного сортування
  order: { type: Number, default: 0, min: 0 }, 
  translations: {
    uk: { title: String, description: String, fullCaseStudy: String },
    en: { title: String, description: String, fullCaseStudy: String },
    pl: { title: String, description: String, fullCaseStudy: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);