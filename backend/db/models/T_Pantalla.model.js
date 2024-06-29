// Archivo: models/T_Pantalla.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const PANTALLA_TABLE = 'T_Pantallas';

class T_Pantalla extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: PANTALLA_TABLE,
      modelName: 'T_Pantalla',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_PantallaSchema = {
  CN_ID_Pantalla: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  CT_Codigo_Pantalla: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field: 'CT_Codigo_Pantalla'
  },
  CT_Titulo_Pantalla: {
    allowNull: false,
    type: DataTypes.STRING(255),
    field: 'CT_Titulo_Pantalla'
  }
};

module.exports = { T_Pantalla, T_PantallaSchema};
