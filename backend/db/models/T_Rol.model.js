// Archivo: models/T_Rol.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const ROL_TABLE = 'T_Roles';

class T_Rol extends Model {
  static associate(models) {
    this.hasMany(models.T_Rol_Usuario, { foreignKey: 'CN_ID_Rol', as: 'roles' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ROL_TABLE,
      modelName: 'T_Rol',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_RolSchema = {
  CN_ID_Rol: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  CT_Descripcion: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field: 'CT_Descripcion'
  },
  CN_ID_Sistema: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'CN_ID_Sistema'
  }
};


module.exports = { T_Rol, T_RolSchema};
