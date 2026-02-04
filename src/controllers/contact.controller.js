const Message = require('../models/Message');
const axios = require('axios');

exports.sendMessage = async (req, res) => {
  try {
    // 1. Получаем уже ПРОВЕРЕННЫЕ и ОЧИЩЕННЫЕ данные
    // express-validator уже сделал trim() и escape()
    const { name, email, phone, message } = req.body;

    // 2. Сохраняем в базу
    const newMessage = await Message.create({ name, email, phone, message });

    // 3. Формируем текст для Telegram
    // Важно: так как мы сделали escape(), символы типа < будут заменены на &lt;
    // Это хорошо для безопасности, но в Telegram может выглядеть некрасиво.
    // Если ты хочешь в Telegram чистый текст, можно использовать библиотеку 'he' для декодирования обратно,
    // НО безопаснее отправлять как есть или просто убрать HTML теги.
    
    const tgText = `
*Новое сообщение!*

👤 *Имя:* ${name}
📧 *Email:* ${email}
📞 *Тел:* ${phone || 'не указано'}
✉️ *Текст:* ${message}
    `;

    // 4. Отправляем в Telegram
    await axios.post(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
      chat_id: process.env.TG_CHAT_ID,
      text: tgText,
      parse_mode: 'Markdown', // Будь осторожен, если пользователь введет *, это может сломать разметку. 
      // Лучше использовать 'HTML' и экранировать данные, но для начала Markdown ок.
    });

    res.status(201).json({ success: true, data: newMessage });

  } catch (error) {
    console.error("Ошибка при отправке:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};