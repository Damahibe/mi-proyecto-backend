const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');
const ROLES = require('../utils/constants');
const errorHandler = require('../middleware/error.middleware');

// Rutas de proyectos
router.post('/projects', authenticateToken, checkRole([ROLES.ADMIN]), projectController.createProject);
router.get('/projects', authenticateToken, checkRole([ROLES.ADMIN, ROLES.USER]), projectController.getAllProjects);
router.get('/projects/:id', authenticateToken, checkRole([ROLES.ADMIN, ROLES.USER]), projectController.getProjectById);
router.get('/projects/user/:userId', authenticateToken, checkRole([ROLES.ADMIN, ROLES.USER]), projectController.getProjectsByUserId);
router.put('/projects/:id', authenticateToken, checkRole([ROLES.ADMIN]), projectController.updateProject);
router.delete('/projects/:id', authenticateToken, checkRole([ROLES.ADMIN]), projectController.deleteProject);

// Asociaciones de usuarios a proyectos
router.post('/projects/:id/assign', authenticateToken, checkRole([ROLES.ADMIN]), projectController.assignUserToProject);
router.delete('/projects/:id/users/:userId', authenticateToken, checkRole([ROLES.ADMIN]), projectController.removeUserFromProject);

// Middleware para manejar errores
router.use(errorHandler);

module.exports = router;
