// Archivo: models/T_Imagenes_Incidencia.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const IMAGENES_INCIDENCIA_TABLE = 'T_Imagenes_Incidencias';

class T_Imagenes_Incidencia extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: IMAGENES_INCIDENCIA_TABLE,
      modelName: 'T_Imagenes_Incidencia',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_Imagenes_IncidenciaSchema = {
  CN_ID_Imagen: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  CN_ID_Incidente: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CN_ID_Diagnostico: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  CT_Descripcion: {
    allowNull: true,
    type: DataTypes.STRING(255)
  },
  CT_Tipo: {
    allowNull: true,
    type: DataTypes.STRING(50)
  },
  CN_Datos: {
    allowNull: true,
    type: DataTypes.BLOB('long')
  }
};


module.exports = { T_Imagenes_Incidencia, T_Imagenes_IncidenciaSchema};
