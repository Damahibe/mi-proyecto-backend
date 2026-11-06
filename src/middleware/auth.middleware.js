const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token no válido o expirado.' });
    }
    req.user = user;
    next();
  });
};

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const rol_id = req.user && (req.user.rol_id || req.user.role_id);

    if (!rol_id || !allowedRoles.includes(rol_id)) {
      return res.status(403).json({ message: 'Acceso denegado. Permisos insuficientes.' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  checkRole
};
