// Archivo: models/T_Bitacora_General.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const BITACORA_GENERAL_TABLE = 'T_Bitacora_General';

class T_Bitacora_General extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: BITACORA_GENERAL_TABLE,
      modelName: 'T_Bitacora_General',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_Bitacora_GeneralSchema = {
  CN_ID_Bitacora_General: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  CN_ID_Usuario: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CN_ID_Pantalla: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CN_ID_Sistema: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CT_Referencia: {
    allowNull: true,
    type: DataTypes.STRING(250)
  }
};


module.exports = { T_Bitacora_General, T_Bitacora_GeneralSchema};
