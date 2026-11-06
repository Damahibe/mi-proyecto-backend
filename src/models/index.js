const sequelize = require('../config/database');
const User = require('./user.model');
const Project = require('./project.model');
const UserProject = require('./userProject.model');

// Relación Administrador (User) <-> Projects creados
User.hasMany(Project, {
  foreignKey: 'administrador_id',
  as: 'administeredProjects'
});

Project.belongsTo(User, {
  foreignKey: 'administrador_id',
  as: 'administrador'
});

// Relación N:M Users <-> Projects a través de UserProject
User.belongsToMany(Project, {
  through: UserProject,
  foreignKey: 'user_id',
  otherKey: 'project_id',
  as: 'projects'
});

Project.belongsToMany(User, {
  through: UserProject,
  foreignKey: 'project_id',
  otherKey: 'user_id',
  as: 'users'
});

module.exports = {
  sequelize,
  User,
  Project,
  UserProject
};
