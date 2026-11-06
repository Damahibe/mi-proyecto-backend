const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/checkRole.middleware');

const ROLES = {
  ADMIN: 1,
  USER: 2
};

router.use(authenticateToken);

// CRUD Proyectos (Solo Admin)
router.post('/projects', checkRole([ROLES.ADMIN]), projectController.createProject);
router.get('/projects', checkRole([ROLES.ADMIN, ROLES.USER]), projectController.getProjects);
router.get('/projects/:id', checkRole([ROLES.ADMIN, ROLES.USER]), projectController.getProjectById);
router.get('/projects/user/:userId', checkRole([ROLES.ADMIN, ROLES.USER]), projectController.getProjectsByUserId);
router.put('/projects/:id', checkRole([ROLES.ADMIN]), projectController.updateProject);
router.delete('/projects/:id', checkRole([ROLES.ADMIN]), projectController.deleteProject);

// Asignación de Usuarios a Proyectos
router.post('/projects/:id/assign', checkRole([ROLES.ADMIN]), projectController.assignUserToProject);
router.delete('/projects/:id/users/:userId', checkRole([ROLES.ADMIN]), projectController.removeUserFromProject);

module.exports = router;
