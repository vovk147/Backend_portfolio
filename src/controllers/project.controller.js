const Project = require('../models/Project');
const Tag = require('../models/Tag');
const slugify = require('slugify');

// --- HELPER 1: ОБРОБКА ТЕГІВ ---
const resolveTags = async (tagsInput) => {
    if (!tagsInput) return [];
    if (typeof tagsInput === 'string' && tagsInput.trim() === '') return [];

    try {
        const tagNames = Array.isArray(tagsInput) 
            ? tagsInput 
            : tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);

        if (tagNames.length === 0) return [];

        const tagIds = [];
        for (const name of tagNames) {
            const tag = await Tag.findOneAndUpdate(
                { name: name }, 
                { name: name }, 
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            tagIds.push(tag._id);
        }
        return tagIds;
    } catch (error) {
        console.error("Tag Resolution Error:", error);
        return [];
    }
};

// --- HELPER 2: PARSER (Для JSON і рядків) ---
const safeParse = (input, fallback = {}) => {
    if (typeof input === 'object' && input !== null) return input;
    try {
        return input ? JSON.parse(input) : fallback;
    } catch (e) {
        return fallback;
    }
};

// --- HELPER 3: ОБРОБКА TECH STACK (Виправлення твоєї помилки) ---
const parseTechStack = (input) => {
    if (!input) return [];
    if (Array.isArray(input)) return input; // <--- Якщо це вже масив, повертаємо його
    if (typeof input === 'string') return input.split(',').map(s => s.trim()); // <--- Якщо рядок - ріжемо
    return [];
};

// 1. GET ALL
exports.getAllProjects = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const featured = req.query.featured;
        let query = {};
        
        if (featured === 'true') query.isFeatured = true;
        if (req.query.tag && req.query.tag !== 'ALL') {
            const tagDoc = await Tag.findOne({ name: new RegExp(`^${req.query.tag}$`, 'i') });
            if (tagDoc) query.tags = tagDoc._id;
            else return res.json({ success: true, data: [], meta: { total: 0, page, limit, pages: 0 } });
        }

        const projects = await Project.find(query)
            .select('-gallery')
            .populate('tags', 'name color slug')
            .sort({ isFeatured: -1, order: 1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Project.countDocuments(query);
        res.json({ success: true, data: projects, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 2. GET BY SLUG
exports.getProjectBySlug = async (req, res) => {
    try {
        const project = await Project.findOne({ slug: req.params.slug }).populate('tags', 'name color slug');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. GET BY ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('tags', 'name color slug');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. CREATE PROJECT (ВИПРАВЛЕНО)
exports.createProject = async (req, res) => {
    try {
        const { techStack, tags, links, translations, isFeatured, order, stage } = req.body;

        const parsedTranslations = safeParse(translations, { en: { title: "Draft", description: "" } });
        const parsedLinks = safeParse(links, { github: '', live: '' });

        // Картинка: Файл або Текст
        let mainImage = '';
        if (req.files && req.files['mainImage']) mainImage = req.files['mainImage'][0].path;
        else if (req.body.mainImage) mainImage = req.body.mainImage;

        // Галерея
        let gallery = [];
        if (req.files && req.files['gallery']) gallery = req.files['gallery'].map(f => f.path);
        else if (req.body.gallery && Array.isArray(req.body.gallery)) gallery = req.body.gallery;

        const tagIds = await resolveTags(tags);
        
        // --- ОСЬ ТУТ БУЛА ПОМИЛКА, ТЕПЕР ВИПРАВЛЕНО ---
        const stackArray = parseTechStack(techStack);

        const project = new Project({
            mainImage,
            gallery,
            techStack: stackArray,
            tags: tagIds,
            links: parsedLinks,
            translations: parsedTranslations,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            order: Number(order) || 0,
            stage: stage || 'STAGE_1',
            slug: slugify(parsedTranslations.en?.title || 'untitled', { lower: true, strict: true }) + '-' + Date.now()
        });

        await project.save();
        const populatedProject = await project.populate('tags', 'name color');
        res.status(201).json(populatedProject);

    } catch (error) {
        console.error("Create Error:", error);
        res.status(400).json({ message: error.message });
    }
};

// 5. UPDATE PROJECT (ВИПРАВЛЕНО)
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};

        if (req.body.translations) updateData.translations = safeParse(req.body.translations);
        if (req.body.links) updateData.links = safeParse(req.body.links);
        
        // --- ВИПРАВЛЕННЯ ДЛЯ UPDATE ---
        if (req.body.techStack) {
            updateData.techStack = parseTechStack(req.body.techStack);
        }
        
        if (req.body.order !== undefined) updateData.order = Number(req.body.order);
        if (req.body.isFeatured !== undefined) updateData.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
        if (req.body.stage) updateData.stage = req.body.stage;

        if (req.file) updateData.mainImage = req.file.path;
        else if (req.body.mainImage) updateData.mainImage = req.body.mainImage;

        if (req.body.tags !== undefined) updateData.tags = await resolveTags(req.body.tags);

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('tags', 'name color slug');

        if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
        res.json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 6. DELETE, 7. TOGGLE
exports.deleteProject = async (req, res) => {
    try { await Project.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } 
    catch (e) { res.status(500).json({ message: e.message }); }
};
exports.toggleFeatured = async (req, res) => {
    try { 
        const p = await Project.findById(req.params.id); 
        p.isFeatured = !p.isFeatured; await p.save(); res.json(p); 
    } catch (e) { res.status(500).json({ message: e.message }); }
};