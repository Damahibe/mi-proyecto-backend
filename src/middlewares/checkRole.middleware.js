const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const rol_id = req.user && (req.user.rol_id || req.user.role_id);

    if (!rol_id || !allowedRoles.includes(rol_id)) {
      return res.status(403).json({ message: 'Acceso denegado. Permisos insuficientes.' });
    }
    next();
  };
};

module.exports = checkRole;
