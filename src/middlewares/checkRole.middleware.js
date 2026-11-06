const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const roleId = req.user && req.user.role_id;

    if (!roleId || !allowedRoles.includes(roleId)) {
      return res.status(403).json({ message: 'Acceso denegado. Permisos insuficientes.' });
    }
    next();
  };
};

module.exports = checkRole;
