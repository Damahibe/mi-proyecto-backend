const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/checkRole.middleware');

const ROLES = { ADMIN: 1, USER: 2 };

router.use(authenticateToken);

// Rutas exactas del Segundo Corte
router.post('/users/create', checkRole([ROLES.ADMIN]), userController.createUser);
router.put('/users/update/:id', checkRole([ROLES.ADMIN]), userController.updateUser);
router.get('/users', checkRole([ROLES.ADMIN]), userController.getAllUsersByAdministradorId);
router.delete('/users/delete/:id', checkRole([ROLES.ADMIN]), userController.deleteUser);
router.get('/users/role/:id', checkRole([ROLES.ADMIN]), userController.getAllUsersByRolId);

// Aliases REST para máxima compatibilidad
router.post('/users', checkRole([ROLES.ADMIN]), userController.createUser);
router.put('/users/:id', checkRole([ROLES.ADMIN]), userController.updateUser);
router.delete('/users/:id', checkRole([ROLES.ADMIN]), userController.deleteUser);

module.exports = router;
