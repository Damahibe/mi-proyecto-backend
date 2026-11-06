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
      role_id: user.role_id,
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
      name: user.name,
      email: user.email,
      role_id: user.role_id
    }
  };
};

const register = async ({ name, email, password, role_id }) => {
  if (!name || !email || !password) {
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
    name,
    email,
    password: hashedPassword,
    role_id: role_id || 1 // Primer usuario o registro público puede ser admin o según parámetro
  });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
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
      name: user.name,
      email: user.email,
      role_id: user.role_id
    }
  };
};

module.exports = {
  login,
  register
};
