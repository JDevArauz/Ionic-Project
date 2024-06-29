// Archivo: models/T_Sistema.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const SISTEMA_TABLE = 'T_Sistemas';

class T_Sistema extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: SISTEMA_TABLE,
      modelName: 'T_Sistema',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_SistemaSchema = {
  CN_ID_Sistema: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  CT_Nombre: {
    allowNull: false,
    type: DataTypes.STRING(100)
  },
  CN_Estado: {
    allowNull: false,
    type: DataTypes.ENUM('Activo', 'Inactivo')
  }
};


module.exports = { T_Sistema, T_SistemaSchema};
