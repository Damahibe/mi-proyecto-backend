const userService = require('../services/user.service');

exports.createUser = async (req, res, next) => {
  try {
    const { nombre, email, password, rol_id } = req.body;
    const administrador_id = req.body.administrador_id || (req.user ? (req.user.id || req.user.administrador_id) : null);
    const user = await userService.createUser(nombre, email, password, rol_id, administrador_id);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol_id, administrador_id } = req.body;
    const admin_from_token = req.user.id || req.user.administrador_id;
    const updated = await userService.updateUser(id, nombre, email, rol_id, administrador_id, admin_from_token);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

exports.getAllUsersByAdministradorId = async (req, res, next) => {
  try {
    const admin_from_token = req.user.id || req.user.administrador_id;
    const { email } = req.query;
    const users = await userService.getAllUsersByAdministradorId(admin_from_token, email);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin_from_token = req.user.id || req.user.administrador_id;
    const result = await userService.deleteUser(id, admin_from_token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getAllUsersByRolId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const users = await userService.getAllUsersByRolId(id);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
