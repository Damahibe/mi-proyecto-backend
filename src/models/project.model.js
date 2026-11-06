const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  administrador_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // Alias de compatibilidad
  name: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('nombre');
    },
    set(value) {
      this.setDataValue('nombre', value);
    }
  },
  description: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('descripcion');
    },
    set(value) {
      this.setDataValue('descripcion', value);
    }
  }
}, {
  tableName: 'projects',
  timestamps: true
});

module.exports = Project;
