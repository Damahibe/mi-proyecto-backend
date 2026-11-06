const projectService = require('../services/project.service');

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const admin_from_token = req.user.id;
    const project = await projectService.createProject({ name, description, admin_from_token });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const admin_from_token = req.user.id;
    const projects = await projectService.getProjects(admin_from_token);
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin_from_token = req.user.id;
    const project = await projectService.getProjectById(id, admin_from_token);
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

const getProjectsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const projects = await projectService.getProjectsByUserId(userId);
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const assignUserToProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const admin_from_token = req.user.id;
    const result = await projectService.assignUserToProject({
      project_id: id,
      user_id: userId,
      admin_from_token
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const removeUserFromProject = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    const admin_from_token = req.user.id;
    const result = await projectService.removeUserFromProject({
      project_id: id,
      user_id: userId,
      admin_from_token
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const admin_from_token = req.user.id;
    const updated = await projectService.updateProject({
      id,
      name,
      description,
      admin_from_token
    });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin_from_token = req.user.id;
    const result = await projectService.deleteProject(id, admin_from_token);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  getProjectsByUserId,
  assignUserToProject,
  removeUserFromProject,
  updateProject,
  deleteProject
};
