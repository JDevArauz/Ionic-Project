// Archivo: models/T_Riesgo.js
const { Model, DataTypes } = require('sequelize');


const RIESGO_TABLE = 'T_Riesgos';

class T_Riesgo extends Model {
  static associate(models) {
    this.belongsTo(models.T_Incidencia, { foreignKey: 'CN_ID_Riesgo_Incidencia' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: RIESGO_TABLE,
      modelName: 'T_Riesgo',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_RiesgoSchema = {
  CN_ID_Riesgo: {
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


module.exports = { T_Riesgo, T_RiesgoSchema};
