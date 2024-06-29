// Archivo: models/T_Prioridad.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const PRIORIDAD_TABLE = 'T_Prioridad';

class T_Prioridad extends Model {
  static associate(models) {
    this.belongsTo(models.T_Incidencia, { foreignKey: 'CN_ID_Prioridad_Incidencia' });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: PRIORIDAD_TABLE,
      modelName: 'T_Prioridad',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_PrioridadSchema = {
  CN_ID_Prioridad: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  CT_Descripcion: {
    allowNull: false,
    type: DataTypes.STRING(100)
  }
};


module.exports = { T_Prioridad, T_PrioridadSchema};
