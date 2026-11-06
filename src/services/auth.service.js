const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Correo electrónico y contraseña requeridos');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      rol_id: user.rol_id,
      role_id: user.rol_id,
      administrador_id: user.administrador_id
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    message: 'Autenticación exitosa',
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol_id: user.rol_id,
      administrador_id: user.administrador_id
    }
  };
};

const register = async ({ nombre, name, email, password, rol_id, role_id }) => {
  const userName = nombre || name;
  const userRole = rol_id || role_id || 1;

  if (!userName || !email || !password) {
    const error = new Error('Nombre, correo y contraseña son obligatorios');
    error.statusCode = 400;
    throw error;
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const error = new Error('El correo electrónico ya está en uso');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    nombre: userName,
    email,
    password: hashedPassword,
    rol_id: userRole
  });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      rol_id: user.rol_id,
      role_id: user.rol_id,
      administrador_id: user.administrador_id
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    message: 'Usuario registrado exitosamente',
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol_id: user.rol_id
    }
  };
};

module.exports = {
  login,
  register
};
