const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    // Шукаємо першу запис і оновлюємо її, або створюємо нову, якщо бази порожня
    const settings = await Settings.findOneAndUpdate(
      {}, 
      req.body, 
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};