const authService = require('../services/auth.service');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role_id } = req.body;
    const result = await authService.register({ name, email, password, role_id });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register
};
