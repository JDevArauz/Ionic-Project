const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const INCIDENCIA_TABLE = 'T_Incidencias';

class T_Incidencia extends Model {

  static associate(models) {
    this.hasMany(models.T_Diagnostico_Incidencia, { foreignKey: 'CN_ID_Incidente' });
    this.hasOne(models.T_Asignacion_Incidencia, { foreignKey: 'CN_ID_Incidente', as: 'T_Asignacion_Incidencia' });
    this.belongsTo(models.T_Estado, { foreignKey: 'CN_ID_Estado_Incidencia', as: 'T_Estado' });
    this.belongsTo(models.T_Usuario, { foreignKey: 'CN_ID_Usuario', as: 'T_Usuario' });
    this.belongsTo(models.T_Prioridad, { foreignKey: 'CN_ID_Prioridad_Incidencia', as: 'T_Prioridad' });
    this.belongsTo(models.T_Riesgo, { foreignKey: 'CN_ID_Riesgo_Incidencia', as: 'T_Riesgo' });
    this.belongsTo(models.T_Afectacion, { foreignKey: 'CN_ID_Afectacion_Incidencia', as: 'T_Afectacion' });
    this.belongsTo(models.T_Categoria, { foreignKey: 'CN_ID_Categoria_Incidencia', as: 'T_Categoria' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: INCIDENCIA_TABLE,
      modelName: 'T_Incidencia',
      timestamps: false // Ajusta esto según tus necesidades
    };
  }
}

const T_IncidenciaSchema = {
  CN_ID_Incidente: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  CF_Fecha_Hora_Registro: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  CN_ID_Usuario: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CT_Titulo_Incidencia: {
    allowNull: false,
    type: DataTypes.STRING(255)
  },
  CT_Descripcion_Incidencia: {
    allowNull: false,
    type: DataTypes.STRING(255)
  },
  CT_Lugar_Incidencia: {
    allowNull: false,
    type: DataTypes.STRING(100)
  },
  CN_ID_Estado_Incidencia: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CT_Justificacion_Estado: {
    allowNull: true,
    type: DataTypes.STRING(255)
  },
  CN_ID_Prioridad_Incidencia: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CN_ID_Riesgo_Incidencia: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CN_ID_Afectacion_Incidencia: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CN_ID_Categoria_Incidencia: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CD_Costos_Incidencia: {
    allowNull: true,
    type: DataTypes.DECIMAL(10, 2)
  },
  CN_Duracion_Gestion_Incidencia: {
    allowNull: true,
    type: DataTypes.INTEGER
  }
};

module.exports = { T_Incidencia, T_IncidenciaSchema };
