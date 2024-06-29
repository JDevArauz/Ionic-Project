// Archivo: models/T_Bitacora_Estado.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const BITACORA_ESTADO_TABLE = 'T_Bitacora_Estados';

class T_Bitacora_Estado extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: BITACORA_ESTADO_TABLE,
      modelName: 'T_Bitacora_Estado',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_Bitacora_EstadoSchema = {
  CN_ID_Bitacora_Estado: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  CN_ID_Incidente: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CN_ID_Usuario: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CN_Estado_Actual: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CN_Nuevo_Estado: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CF_Fecha_Hora: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
};


module.exports = { T_Bitacora_Estado, T_Bitacora_EstadoSchema};
