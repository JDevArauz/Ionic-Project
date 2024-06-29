// Archivo: models/T_Estado.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const ESTADO_TABLE = 'T_Estado';

class T_Estado extends Model {
  static associate(models) {

    this.belongsTo(models.T_Incidencia, { foreignKey: 'CN_ID_Estado_Incidencia' });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: ESTADO_TABLE,
      modelName: 'T_Estado',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_EstadoSchema = {
  CN_ID_Estado: {
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

module.exports = { T_Estado, T_EstadoSchema};
