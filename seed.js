const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Проверяем пути к моделям
const Project = require('./src/models/Project'); 
const Tag = require('./src/models/Tag');
const User = require('./src/models/User'); 

dotenv.config();

// Тестовый проект
const sampleProject = {
  translations: {
    en: { title: "Test Project Fix", description: "System operational." },
    uk: { title: "Тестовий Проект", description: "Система працює." },
    pl: { title: "Projekt Testowy", description: "System działa." }
  },
  techStack: ["React", "Node.js", "MongoDB"],
  
  // --- ИСПРАВЛЕНИЕ ТУТ ---
  // База требует картинку. Мы даем ей временную строку.
  // Это позволит создать проект без ошибок.
  mainImage: "uploads/placeholder.png", 
  
  isFeatured: true,
  order: 1,
  slug: "test-project-fix"
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 MongoDB Connected...');

    // 1. УДАЛЯЕМ ВСЕ СТАРОЕ
    await Project.deleteMany({});
    await Tag.deleteMany({});
    await User.deleteMany({}); 
    console.log('🗑️  All old data cleared.');

    // 2. СОЗДАЕМ АДМИНА
    const adminUser = await User.create({
       email: "vovk.zheka1@gmail.com",  // <-- Твій логін
        password: "Zheka@vovk147",   
    });
    console.log(`👤 Admin created: ${adminUser.email} / pass: admin`);

    // 3. СОЗДАЕМ ТЕГ
    const newTag = await Tag.create({ 
      name: "System", 
      color: "#00ff00" 
    });

    // 4. СОЗДАЕМ ПРОЕКТ
    const projectData = {
      ...sampleProject,
      tags: [newTag._id] 
    };

    await Project.create(projectData);
    console.log('✅ Test Project created!');

    console.log('🚀 DATABASE RESET. READY TO GO.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();