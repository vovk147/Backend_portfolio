const Project = require('../models/Project');
const slugify = require('slugify');

// 1. Отримати всі проекти (Сортування: спочатку ТОП, потім нові)
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ isFeatured: -1, createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Отримати один проект за ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Створити проект
exports.createProject = async (req, res) => {
    try {
        const { techStack, links, translations, isFeatured } = req.body;
        const parsedTranslations = JSON.parse(translations);

        const slug = slugify(parsedTranslations.en.title, { lower: true, strict: true }) + '-' + Date.now();

        const project = new Project({
            slug,
            mainImage: req.file ? req.file.path : '',
            techStack: techStack ? techStack.split(',').map(s => s.trim()) : [],
            links: links ? JSON.parse(links) : { github: '', live: '' },
            translations: parsedTranslations,
            isFeatured: isFeatured === 'true'
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 4. Оновити проект
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};

        // 1. Обробка перекладів
        if (req.body.translations) {
            updateData.translations = JSON.parse(req.body.translations);
        }

        // 2. Обробка посилань
        if (req.body.links) {
            updateData.links = JSON.parse(req.body.links);
        }

        // 3. Обробка техстеку
        if (req.body.techStack) {
            updateData.techStack = req.body.techStack.split(',').map(s => s.trim());
        }

        // 4. ГОРЯЧЕ ВИПРАВЛЕННЯ: Зберігаємо ПОРЯДОК (order)
        // Перевіряємо, чи прийшло поле order, і конвертуємо в число
        if (req.body.order !== undefined) {
            updateData.order = Number(req.body.order);
        }

        // 5. Зберігаємо статус зірочки (isFeatured)
        if (req.body.isFeatured !== undefined) {
            updateData.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
        }

        // 6. Обробка фото
        if (req.file) {
            updateData.mainImage = req.file.path;
        }

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.json(updatedProject);
    } catch (error) {
        console.error("Update error:", error);
        res.status(400).json({ message: error.message });
    }
};

// 5. Видалити проект
exports.deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Швидке перемикання зірки (TOP)
// ВИПРАВЛЕНО: Прибрано типи TypeScript і додано req, res
exports.toggleFeatured = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        project.isFeatured = !project.isFeatured;
        await project.save();

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.createProject = async (req, res) => {
  try {
    const { techStack, links, translations, isFeatured, order } = req.body;
    
    // Дістаємо шляхи до фото
    const mainImage = req.files['mainImage'] ? req.files['mainImage'][0].path : '';
    const gallery = req.files['gallery'] ? req.files['gallery'].map(file => file.path) : [];

    const project = new Project({
      mainImage,
      gallery, // Масив фото для слайдера
      techStack: techStack.split(',').map(s => s.trim()),
      links: JSON.parse(links),
      translations: JSON.parse(translations),
      isFeatured: isFeatured === 'true',
      order: Number(order) || 0,
      slug: slugify(JSON.parse(translations).en.title, { lower: true }) + '-' + Date.now()
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};