const { Project, User, UserProject } = require('../models');

const createProject = async ({ name, description, admin_from_token }) => {
  return await Project.create({
    name,
    description,
    administrador_id: admin_from_token
  });
};

const getProjects = async (admin_from_token) => {
  return await Project.findAll({
    where: { administrador_id: admin_from_token },
    include: [{
      model: User,
      as: 'users',
      attributes: { exclude: ['password'] },
      through: { attributes: [] }
    }]
  });
};

const getProjectById = async (id, admin_from_token) => {
  const project = await Project.findByPk(id, {
    include: [{
      model: User,
      as: 'users',
      attributes: { exclude: ['password'] },
      through: { attributes: [] }
    }]
  });

  if (!project) {
    const error = new Error('Proyecto no encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (project.administrador_id !== admin_from_token) {
    const error = new Error('Acceso denegado a este proyecto');
    error.statusCode = 403;
    throw error;
  }

  return project;
};

const getProjectsByUserId = async (user_id) => {
  const user = await User.findByPk(user_id, {
    attributes: { exclude: ['password'] },
    include: [{
      model: Project,
      as: 'projects',
      through: { attributes: [] }
    }]
  });

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return user.projects;
};

const assignUserToProject = async ({ project_id, user_id, admin_from_token }) => {
  const project = await Project.findByPk(project_id);
  if (!project) {
    const error = new Error('Proyecto no encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (project.administrador_id !== admin_from_token) {
    const error = new Error('No tiene permisos sobre este proyecto');
    error.statusCode = 403;
    throw error;
  }

  const user = await User.findByPk(user_id);
  if (!user) {
    const error = new Error('Usuario a asignar no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const existingAssignment = await UserProject.findOne({
    where: { project_id, user_id }
  });

  if (existingAssignment) {
    const error = new Error('El usuario ya se encuentra asignado a este proyecto');
    error.statusCode = 400;
    throw error;
  }

  await UserProject.create({ project_id, user_id });
  return { message: 'Usuario asignado exitosamente al proyecto' };
};

const removeUserFromProject = async ({ project_id, user_id, admin_from_token }) => {
  const project = await Project.findByPk(project_id);
  if (!project) {
    const error = new Error('Proyecto no encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (project.administrador_id !== admin_from_token) {
    const error = new Error('No tiene permisos sobre este proyecto');
    error.statusCode = 403;
    throw error;
  }

  const assignment = await UserProject.findOne({
    where: { project_id, user_id }
  });

  if (!assignment) {
    const error = new Error('La relación entre el usuario y el proyecto no existe');
    error.statusCode = 404;
    throw error;
  }

  await assignment.destroy();
  return { message: 'Usuario removido exitosamente del proyecto' };
};

const updateProject = async ({ id, name, description, admin_from_token }) => {
  const project = await Project.findByPk(id);
  if (!project) {
    const error = new Error('Proyecto no encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (project.administrador_id !== admin_from_token) {
    const error = new Error('No tiene autorización para actualizar este proyecto');
    error.statusCode = 403;
    throw error;
  }

  project.name = name !== undefined ? name : project.name;
  project.description = description !== undefined ? description : project.description;
  await project.save();

  return project;
};

const deleteProject = async (id, admin_from_token) => {
  const project = await Project.findByPk(id);
  if (!project) {
    const error = new Error('Proyecto no encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (project.administrador_id !== admin_from_token) {
    const error = new Error('No tiene autorización para eliminar este proyecto');
    error.statusCode = 403;
    throw error;
  }

  await UserProject.destroy({ where: { project_id: id } });
  await project.destroy();

  return { message: 'Proyecto eliminado exitosamente' };
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
