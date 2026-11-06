const projectService = require('../services/project.service');

exports.createProject = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    const admin_from_token = req.user.id || req.user.administrador_id;
    const project = await projectService.createProject(nombre, descripcion, admin_from_token);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

exports.getAllProjects = async (req, res, next) => {
  try {
    const admin_from_token = req.user.id || req.user.administrador_id;
    const projects = await projectService.getAllProjectsByAdministradorId(admin_from_token);
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin_from_token = req.user.id || req.user.administrador_id;
    const project = await projectService.getProjectById(id, admin_from_token);
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

exports.getProjectsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const projects = await projectService.getProjectsByUserId(userId);
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

exports.assignUserToProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const admin_from_token = req.user.id || req.user.administrador_id;
    const result = await projectService.assignUserToProject(id, userId, admin_from_token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.removeUserFromProject = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    const admin_from_token = req.user.id || req.user.administrador_id;
    const result = await projectService.removeUserFromProject(id, userId, admin_from_token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const admin_from_token = req.user.id || req.user.administrador_id;
    const updated = await projectService.updateProject(id, nombre, descripcion, admin_from_token);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin_from_token = req.user.id || req.user.administrador_id;
    const result = await projectService.deleteProject(id, admin_from_token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
