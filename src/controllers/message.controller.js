const Message = require('../models/Message');

// @desc    Отримати всі повідомлення
// @route   GET /api/messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Оновити статус повідомлення (на 'read')
// @route   PATCH /api/messages/:id
exports.updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );
    if (!message) return res.status(404).json({ success: false, message: 'Не знайдено' });
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Видалити повідомлення
// @route   DELETE /api/messages/:id
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Не знайдено' });
    res.status(200).json({ success: true, message: 'Видалено' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};