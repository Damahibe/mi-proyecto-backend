require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1. Verificación de conexión a PostgreSQL
    await sequelize.authenticate();
    console.log('========================================================');
    console.log('✅ PostgreSQL conectado exitosamente');

    // 2. Sincronización de modelos de Sequelize
    await sequelize.sync();
    console.log('✅ Sequelize sincronizado con la base de datos');

    // 3. Puesta en marcha del servidor HTTP
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
      console.log(`📌 Base URL para Postman: http://localhost:${PORT}/api/v1/`);
      console.log('========================================================');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
