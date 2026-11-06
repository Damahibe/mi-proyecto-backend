const sequelize = require('../config/database');
const User = require('./user.model');
const Project = require('./project.model');
const UserProject = require('./userProject.model');

// Relación Administrador (User) <-> Projects
User.hasMany(Project, {
  foreignKey: 'administrador_id',
  as: 'administeredProjects'
});

Project.belongsTo(User, {
  foreignKey: 'administrador_id',
  as: 'administrador'
});

// Relación N:M Users <-> Projects a través de UserProject (Nomenclatura docente: 'proyectos' y 'usuarios')
User.belongsToMany(Project, {
  through: UserProject,
  foreignKey: 'usuario_id',
  otherKey: 'proyecto_id',
  as: 'proyectos'
});

Project.belongsToMany(User, {
  through: UserProject,
  foreignKey: 'proyecto_id',
  otherKey: 'usuario_id',
  as: 'usuarios'
});

module.exports = {
  sequelize,
  User,
  Project,
  UserProject
};
