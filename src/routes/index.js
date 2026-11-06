const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const projectRoutes = require('./project.routes');

// Las rutas ya incluyen sus prefijos internos (/auth/..., /users/..., /projects/...)
router.use('/', authRoutes);
router.use('/', usersRoutes);
router.use('/', projectRoutes);

module.exports = router;
