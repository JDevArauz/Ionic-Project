// Archivo: models/T_Diagnostico_Incidencia.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const DIAGNOSTICO_INCIDENCIA_TABLE = 'T_Diagnostico_Incidencias';

class T_Diagnostico_Incidencia extends Model {
  static associate(models) {

    this.belongsTo(models.T_Incidencia, { foreignKey: 'CN_ID_Incidente' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: DIAGNOSTICO_INCIDENCIA_TABLE,
      modelName: 'T_Diagnostico_Incidencia',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_Diagnostico_IncidenciaSchema = {
  CN_ID_Diagnostico: {
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
  CF_Fecha_Hora: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  CT_Diagnostico: {
    allowNull: false,
    type: DataTypes.STRING(255)
  },
  CN_Requiere_Compra: {
    allowNull: true,
    type: DataTypes.ENUM('Si', 'No')
  },
  CN_Tiempo_Solucion_Estimado: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CT_Observaciones: {
    allowNull: true,
    type: DataTypes.STRING(255)
  }
};


module.exports = { T_Diagnostico_Incidencia, T_Diagnostico_IncidenciaSchema};
