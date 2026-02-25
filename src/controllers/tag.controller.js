const Tag = require('../models/Tag');
const Project = require('../models/Project'); // Импортируем Проект, чтобы чистить связи при удалении

// 1. GET ALL (Получить все теги для списка)
exports.getAllTags = async (req, res) => {
    try {
        // Сортируем по алфавиту (A-Z)
        const tags = await Tag.find().sort({ name: 1 });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. CREATE (Создать тег вручную - для вкладки и кнопки "+")
exports.createTag = async (req, res) => {
    try {
        const { name, color } = req.body;

        // Проверка: такой тег уже есть?
        const existingTag = await Tag.findOne({ name });
        if (existingTag) {
            return res.status(400).json({ message: 'Tag with this name already exists' });
        }

        const newTag = new Tag({
            name,
            color: color || '#333333' // Если цвет не передали, будет серый
        });

        await newTag.save();
        res.status(201).json(newTag);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3. UPDATE (Изменить имя или цвет тега)
exports.updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;

        // Находим и обновляем
        const updatedTag = await Tag.findByIdAndUpdate(
            id,
            { name, color }, // Mongoose сам перегенерирует slug, если имя изменилось
            { new: true, runValidators: true } // new: true возвращает обновленную версию
        );

        if (!updatedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.json(updatedTag);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 4. DELETE (Удалить тег и почистить его из проектов)
exports.deleteTag = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Удаляем сам тег
        const deletedTag = await Tag.findByIdAndDelete(id);
        
        if (!deletedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        // 2. ПРОФЕССИОНАЛЬНАЯ ЧИСТКА:
        // Ищем ВСЕ проекты, где был этот тег, и убираем его ID из массива tags
        await Project.updateMany(
            { tags: id },      // Найти проекты, где есть этот тег
            { $pull: { tags: id } } // "Выдернуть" (pull) этот ID из массива
        );

        res.json({ message: 'Tag deleted and removed from all projects' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};