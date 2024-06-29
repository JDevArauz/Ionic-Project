const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const ASIGNACION_INCIDENCIA_TABLE = 'T_Asignacion_Incidencias';

class T_Asignacion_Incidencia extends Model {

  static associate(models) {
    this.belongsTo(models.T_Usuario, { foreignKey: 'CN_ID_Usuario', as: 'T_Usuario' });
    this.belongsTo(models.T_Incidencia, { foreignKey: 'CN_ID_Incidente', as: 'T_Incidencia' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ASIGNACION_INCIDENCIA_TABLE,
      modelName: 'T_Asignacion_Incidencia',
      timestamps: false // Ajusta esto según tus necesidades
    };
  }
}

const T_Asignacion_IncidenciaSchema = {
  CN_ID_Asignacion: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  CN_ID_Usuario: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CN_ID_Incidente: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CF_Fecha_Asignacion: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
};

module.exports = { T_Asignacion_Incidencia, T_Asignacion_IncidenciaSchema };
