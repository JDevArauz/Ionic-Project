// Archivo: models/T_Afectacion.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const AFECTACION_TABLE = 'T_Afectacion';

class T_Afectacion extends Model {
  static associate(models) {
    this.belongsTo(models.T_Incidencia, { foreignKey: 'CN_ID_Afectacion_Incidencia' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: AFECTACION_TABLE,
      modelName: 'T_Afectacion',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_AfectacionSchema = {
  CN_ID_Afectacion: {
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


module.exports = {T_Afectacion, T_AfectacionSchema};
