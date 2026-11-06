const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { User, UserProject } = require('../models');

const createUser = async ({ name, email, password, role_id, admin_from_token }) => {
  if (!name || !email || !password) {
    const error = new Error('Nombre, correo y contraseña son obligatorios');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('El correo electrónico ya está en uso');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role_id: role_id || 2, // Por defecto rol 2 (USER)
    administrador_id: admin_from_token || null
  });

  const userJson = newUser.toJSON();
  delete userJson.password;
  return userJson;
};

const getAllUsersByAdminId = async ({ admin_from_token, email }) => {
  const whereClause = {};

  if (admin_from_token) {
    whereClause.administrador_id = admin_from_token;
  }

  if (email) {
    whereClause.email = { [Op.iLike]: `%${email}%` };
  }

  return await User.findAll({
    where: whereClause,
    attributes: { exclude: ['password'] }
  });
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const getAllUsersByRoleId = async (roleId, admin_from_token) => {
  const whereClause = {
    role_id: roleId
  };

  if (admin_from_token) {
    whereClause.administrador_id = admin_from_token;
  }

  return await User.findAll({
    where: whereClause,
    attributes: { exclude: ['password'] }
  });
};

const updateUser = async ({ id, name, email, role_id, admin_from_token }) => {
  const user = await User.findByPk(id);

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (user.administrador_id && user.administrador_id !== admin_from_token) {
    const error = new Error('No tiene autorización para actualizar este usuario');
    error.statusCode = 403;
    throw error;
  }

  if (email && email !== user.email) {
    const emailInUse = await User.findOne({ where: { email } });
    if (emailInUse) {
      const error = new Error('El correo electrónico ya se encuentra registrado por otro usuario');
      error.statusCode = 400;
      throw error;
    }
    user.email = email;
  }

  if (name !== undefined) user.name = name;
  if (role_id !== undefined) user.role_id = role_id;

  await user.save();

  return await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
};

const deleteUser = async (id, admin_from_token) => {
  const user = await User.findByPk(id);

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (user.administrador_id && user.administrador_id !== admin_from_token) {
    const error = new Error('No tiene autorización para eliminar este usuario');
    error.statusCode = 403;
    throw error;
  }

  // Desvincular de proyectos antes de eliminar el usuario
  await UserProject.destroy({ where: { user_id: id } });
  await user.destroy();

  return { message: 'Usuario eliminado exitosamente' };
};

module.exports = {
  createUser,
  getAllUsersByAdminId,
  getUserById,
  getAllUsersByRoleId,
  updateUser,
  deleteUser
};
