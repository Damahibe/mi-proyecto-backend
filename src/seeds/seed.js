require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Project, UserProject } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🔄 Sincronizando base de datos...');
    await sequelize.sync({ force: true });
    console.log('✅ Tablas recreadas limpiamente con nomenclatura snake_case.');

    console.log('🌱 Creando usuarios iniciales...');
    const hashedAdminPassword = await bcrypt.hash('admin1234', 10);
    const hashedUserPassword = await bcrypt.hash('user1234', 10);

    // 1. Administrador Principal (ID: 1)
    const admin = await User.create({
      id: 1,
      nombre: 'Juliana Gomez Admin',
      email: 'admin@ejemplo.com',
      password: hashedAdminPassword,
      rol_id: 1, // ADMIN
      administrador_id: null
    });

    // 2. Usuario Regular Estándar (ID: 2)
    const user2 = await User.create({
      id: 2,
      nombre: 'Carlos Gomez',
      email: 'carlos@ejemplo.com',
      password: hashedUserPassword,
      rol_id: 2, // USER
      administrador_id: admin.id
    });

    // 3. Usuario Regular para variables Postman (ID: 19)
    const user19 = await User.create({
      id: 19,
      nombre: 'Usuario Demo 19',
      email: 'user19@ejemplo.com',
      password: hashedUserPassword,
      rol_id: 2, // USER
      administrador_id: admin.id
    });

    // 4. Proyecto Base (ID: 1)
    const project1 = await Project.create({
      id: 1,
      nombre: 'Sistema de Gestión Académica',
      descripcion: 'Plataforma para control de evaluaciones y asignación de proyectos',
      administrador_id: admin.id
    });

    // 5. Proyecto Base para variables Postman (ID: 12)
    const project12 = await Project.create({
      id: 12,
      nombre: 'Proyecto Doce de Demostración',
      descripcion: 'Proyecto preconfigurado para pruebas de Postman con ID 12',
      administrador_id: admin.id
    });

    // 6. Asignaciones intermedias en UserProject
    await UserProject.create({
      proyecto_id: project1.id,
      usuario_id: user2.id
    });

    await UserProject.create({
      proyecto_id: project12.id,
      usuario_id: user19.id
    });

    // Ajustar secuencias de PostgreSQL para futuros autoincrementos
    try {
      await sequelize.query("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));");
      await sequelize.query("SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));");
      await sequelize.query("SELECT setval('user_projects_id_seq', (SELECT MAX(id) FROM user_projects));");
    } catch (e) {
      // Ignorar si el dialecto no requiere ajuste manual
    }

    console.log(`✅ Admin creado (ID: ${admin.id}, Email: ${admin.email}, Pass: admin1234)`);
    console.log(`✅ Usuario creado (ID: ${user2.id}, Email: ${user2.email}, Pass: user1234)`);
    console.log(`✅ Usuario creado (ID: ${user19.id}, Email: ${user19.email}, Pass: user1234)`);
    console.log(`✅ Proyecto creado (ID: ${project1.id}, Nombre: ${project1.nombre})`);
    console.log(`✅ Proyecto creado (ID: ${project12.id}, Nombre: ${project12.nombre})`);
    console.log('✅ Relaciones User-Project intermedias creadas.');

    console.log('\n🎉 ¡Semillero completado con éxito!');
    console.log('----------------------------------------------------');
    console.log('Credenciales de prueba:');
    console.log('  Admin: admin@ejemplo.com / admin1234 (rol_id: 1)');
    console.log('  User:  carlos@ejemplo.com / user1234 (rol_id: 2)');
    console.log('  User:  user19@ejemplo.com / user1234 (rol_id: 2)');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar el seed:', error);
    process.exit(1);
  }
};

seedDatabase();
