const Project = require('../models/Project');
const slugify = require('slugify');

// 1. Отримати всі проекти (Сортування: спочатку ТОП, потім за порядком)
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ isFeatured: -1, order: 1, createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Отримати проект за SLUG (для Next.js)
exports.getProjectBySlug = async (req, res) => {
    try {
        const project = await Project.findOne({ slug: req.params.slug });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Отримати проект за ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Створити проект (з підтримкою GALLERY та MAINIMAGE)
exports.createProject = async (req, res) => {
    try {
        const { techStack, links, translations, isFeatured, order } = req.body;
        
        const parsedTranslations = JSON.parse(translations);
        
        // Дістаємо шляхи до фото через req.files (якщо використовуєш upload.fields)
        const mainImage = req.files && req.files['mainImage'] ? req.files['mainImage'][0].path : '';
        const gallery = req.files && req.files['gallery'] ? req.files['gallery'].map(file => file.path) : [];

        const project = new Project({
            mainImage,
            gallery,
            techStack: techStack ? techStack.split(',').map(s => s.trim()) : [],
            links: links ? JSON.parse(links) : { github: '', live: '' },
            translations: parsedTranslations,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            order: Number(order) || 0,
            slug: slugify(parsedTranslations.en.title, { lower: true, strict: true }) + '-' + Date.now()
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 5. Оновити проект
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};

        if (req.body.translations) updateData.translations = JSON.parse(req.body.translations);
        if (req.body.links) updateData.links = JSON.parse(req.body.links);
        if (req.body.techStack) updateData.techStack = req.body.techStack.split(',').map(s => s.trim());
        if (req.body.order !== undefined) updateData.order = Number(req.body.order);
        if (req.body.isFeatured !== undefined) updateData.isFeatured = req.body.isFeatured === 'true';
        
        // Оновлення головного фото
        if (req.file) updateData.mainImage = req.file.path;

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 6. Видалити проект
exports.deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 7. Перемикач ТОП
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