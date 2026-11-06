require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Project, UserProject } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🔄 Sincronizando base de datos...');
    await sequelize.sync({ force: true });
    console.log('✅ Tablas recreadas limpiamente.');

    console.log('🌱 Creando usuarios iniciales...');
    const hashedAdminPassword = await bcrypt.hash('admin1234', 10);
    const hashedUserPassword = await bcrypt.hash('user1234', 10);

    const admin = await User.create({
      name: 'Juliana Gomez Admin',
      email: 'admin@ejemplo.com',
      password: hashedAdminPassword,
      role_id: 1, // ADMIN
      administrador_id: null
    });

    const user = await User.create({
      name: 'Carlos Gomez',
      email: 'carlos@ejemplo.com',
      password: hashedUserPassword,
      role_id: 2, // USER
      administrador_id: admin.id
    });

    console.log(`✅ Admin creado (ID: ${admin.id}, Email: ${admin.email}, Pass: admin1234)`);
    console.log(`✅ Usuario creado (ID: ${user.id}, Email: ${user.email}, Pass: user1234)`);

    console.log('🌱 Creando proyecto de prueba...');
    const project = await Project.create({
      name: 'Sistema de Gestión Académica',
      description: 'Plataforma para control de evaluaciones y asignación de proyectos',
      administrador_id: admin.id
    });
    console.log(`✅ Proyecto creado (ID: ${project.id}, Nombre: ${project.name})`);

    console.log('🌱 Asignando usuario al proyecto...');
    await UserProject.create({
      project_id: project.id,
      user_id: user.id
    });
    console.log('✅ Relación User-Project creada.');

    console.log('\n🎉 ¡Semillero completado con éxito!');
    console.log('----------------------------------------------------');
    console.log('Credenciales de prueba:');
    console.log('  Admin: admin@ejemplo.com / admin1234 (role_id: 1)');
    console.log('  User:  carlos@ejemplo.com / user1234 (role_id: 2)');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar el seed:', error);
    process.exit(1);
  }
};

seedDatabase();
