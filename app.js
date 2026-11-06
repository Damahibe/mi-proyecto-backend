const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const projectRoutes = require('./src/routes/project.routes');
const errorHandler = require('./src/middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

// Normalizador para sanitizar dobles barras si baseUrl contiene barra final
app.use((req, res, next) => {
  if (req.url.includes('//')) {
    req.url = req.url.replace(/\/{2,}/g, '/');
  }
  next();
});

// Verificación de estado del servidor
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API Segundo Corte - Gestión de Usuarios y Proyectos',
    version: '1.0.0',
    prefix: '/api/v1',
    status: 'online'
  });
});

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Montaje bajo /api/v1
app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', projectRoutes);

// Compatibilidad adicional bajo /api
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', projectRoutes);

// Manejador centralizado de errores
app.use(errorHandler);

module.exports = app;
