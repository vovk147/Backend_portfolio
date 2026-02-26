const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phones: [{ type: String }], 
  cvLink: { type: String }, 
  isLookingForWork: { type: Boolean, default: true },
  socials: {
    github: { type: String },
    discord: { type: String },
    telegram: { type: String },
    instagram: { type: String }
  },
  aboutMe: {
    uk: String,
    en: String,
    pl: String
  },
  // 👇 ДОДАЄМО СИСТЕМНУ НОТАТКУ СЮДИ
  systemNote: {
    text: { type: String, default: '' },
    status: { type: String, default: 'План розробки' }
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);