const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  status: { type: String, default: 'new' } // Для адмінки: нове, прочитане тощо
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);