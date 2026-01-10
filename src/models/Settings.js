const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  email: { type: String, required: true },
  // Змінюємо String на [String], щоб зберігати масив номерів
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
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);