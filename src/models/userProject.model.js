const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserProject = sequelize.define('UserProject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  proyecto_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // Alias de compatibilidad
  project_id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('proyecto_id');
    },
    set(value) {
      this.setDataValue('proyecto_id', value);
    }
  },
  user_id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('usuario_id');
    },
    set(value) {
      this.setDataValue('usuario_id', value);
    }
  }
}, {
  tableName: 'user_projects',
  timestamps: true
});

module.exports = UserProject;
