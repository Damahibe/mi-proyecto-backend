const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/checkRole.middleware');

const ROLES = {
  ADMIN: 1,
  USER: 2
};

// Todas las rutas de usuarios requieren autenticación previa
router.use(authenticateToken);

// Creación de Usuario (Solo Admin) - Soporta ambas rutas /users/create y /users
router.post('/users/create', checkRole([ROLES.ADMIN]), usersController.createUser);
router.post('/users', checkRole([ROLES.ADMIN]), usersController.createUser);

// Listado de Usuarios (Admin y User)
router.get('/users', checkRole([ROLES.ADMIN, ROLES.USER]), usersController.getAllUsers);

// Filtro de usuarios por rol (Admin y User)
router.get('/users/role/:id', checkRole([ROLES.ADMIN, ROLES.USER]), usersController.getAllUsersByRoleId);

// Obtener usuario por ID (Admin y User)
router.get('/users/:id', checkRole([ROLES.ADMIN, ROLES.USER]), usersController.getUserById);

// Actualización de Usuario (Solo Admin) - Soporta /users/update/:id y /users/:id
router.put('/users/update/:id', checkRole([ROLES.ADMIN]), usersController.updateUser);
router.put('/users/:id', checkRole([ROLES.ADMIN]), usersController.updateUser);

// Eliminación de Usuario (Solo Admin)
router.delete('/users/:id', checkRole([ROLES.ADMIN]), usersController.deleteUser);

module.exports = router;
