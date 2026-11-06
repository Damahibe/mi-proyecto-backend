const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const projectRoutes = require('./project.routes');

router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/', projectRoutes);

module.exports = router;
