const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserProject = sequelize.define('UserProject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'user_projects',
  timestamps: true
});

module.exports = UserProject;
