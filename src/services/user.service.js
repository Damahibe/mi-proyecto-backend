const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// 1. Crear Usuario
exports.createUser = async (nombre, email, password, rol_id, administrador_id) => {
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      const error = new Error('El email ya está en uso');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol_id: rol_id || 2,
      administrador_id
    });

    const userResponse = newUser.toJSON();
    delete userResponse.password;
    return userResponse;
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    throw err;
  }
};

// 2. Actualizar Usuario
exports.updateUser = async (id, nombre, email, rol_id, administrador_id, admin_from_token) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (user.administrador_id && user.administrador_id !== admin_from_token) {
      const error = new Error('Acceso denegado, este usuario no esta bajo su administración');
      error.statusCode = 403;
      throw error;
    }

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        const error = new Error('El email ya está en uso');
        error.statusCode = 400;
        throw error;
      }
    }

    await user.update({
      nombre: nombre !== undefined ? nombre : user.nombre,
      email: email !== undefined ? email : user.email,
      rol_id: rol_id !== undefined ? rol_id : user.rol_id,
      administrador_id: administrador_id !== undefined ? administrador_id : user.administrador_id
    });

    const userResponse = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    return userResponse;
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    throw err;
  }
};

// 3. Obtener Usuarios por Administrador ID (con filtro opcional por email)
exports.getAllUsersByAdministradorId = async (administrador_id, email) => {
  try {
    const whereClause = {};
    if (administrador_id) {
      whereClause.administrador_id = administrador_id;
    }
    if (email) {
      whereClause.email = email;
    }

    return await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] }
    });
  } catch (err) {
    throw new Error(`Error al consultar usuarios: ${err.message}`);
  }
};

// 4. Eliminar Usuario
exports.deleteUser = async (id, admin_from_token) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (user.administrador_id && user.administrador_id !== admin_from_token) {
      const error = new Error('Acceso denegado, este usuario no esta bajo su administración');
      error.statusCode = 403;
      throw error;
    }

    await user.destroy();
    return { message: 'Usuario eliminado exitosamente' };
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400;
    throw err;
  }
};

// 5. Obtener Usuarios por Rol ID
exports.getAllUsersByRolId = async (rol_id) => {
  try {
    return await User.findAll({
      where: { rol_id },
      attributes: { exclude: ['password'] }
    });
  } catch (err) {
    throw new Error(`Error al consultar usuarios por rol: ${err.message}`);
  }
};
