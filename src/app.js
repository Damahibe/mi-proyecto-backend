const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Verificación de estado del servidor
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API Segundo Corte - Gestión de Usuarios y Proyectos',
    version: '1.0.0',
    status: 'online'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Enrutador de la API (soporta baseUrl http://localhost:3000/api)
app.use('/api', apiRoutes);

// Middleware global de manejo de errores
app.use(errorHandler);

module.exports = app;
