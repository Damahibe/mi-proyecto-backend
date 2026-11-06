const usersService = require('../services/users.service');

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role_id } = req.body;
    const admin_from_token = req.user ? req.user.id : null;
    const user = await usersService.createUser({
      name,
      email,
      password,
      role_id,
      admin_from_token
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const admin_from_token = req.user ? req.user.id : null;
    const { email } = req.query;
    const users = await usersService.getAllUsersByAdminId({
      admin_from_token,
      email
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await usersService.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const getAllUsersByRoleId = async (req, res, next) => {
  try {
    const roleId = req.params.id || req.params.roleId;
    const admin_from_token = req.user ? req.user.id : null;
    const users = await usersService.getAllUsersByRoleId(roleId, admin_from_token);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role_id } = req.body;
    const admin_from_token = req.user ? req.user.id : null;
    const updated = await usersService.updateUser({
      id,
      name,
      email,
      role_id,
      admin_from_token
    });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin_from_token = req.user ? req.user.id : null;
    const result = await usersService.deleteUser(id, admin_from_token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getAllUsersByRoleId,
  updateUser,
  deleteUser
};
