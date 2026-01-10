const Message = require('../models/Message'); // Переконайся, що створив модель Message
const axios = require('axios');

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // 1. Зберігаємо повідомлення в базу
    const newMessage = await Message.create({ name, email, phone, message });

    // 2. Формуємо текст для Telegram
    const tgText = `
📩 *Нове повідомлення!*
──────────────────
👤 *Від:* ${name}
📧 *Email:* ${email}
📞 *Тел:* ${phone || 'не вказано'}
📝 *Текст:* ${message}
──────────────────
    `;

    // 3. Надсилаємо в Telegram за допомогою твоїх токенів з .env
    await axios.post(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
      chat_id: process.env.TG_CHAT_ID,
      text: tgText,
      parse_mode: 'Markdown'
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};