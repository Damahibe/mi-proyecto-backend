const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2 // 1: ADMIN, 2: USER
  },
  administrador_id: {
    type: DataTypes.INTEGER,
    allowNull: true
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
  role_id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('rol_id');
    },
    set(value) {
      this.setDataValue('rol_id', value);
    }
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
