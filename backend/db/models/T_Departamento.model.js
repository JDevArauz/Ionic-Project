// Archivo: models/T_Departamento.js
const { Sequelize ,Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/config');

const DEPARTAMENTO_TABLE = 'T_Departamentos';

class T_Departamento extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: DEPARTAMENTO_TABLE,
      modelName: 'T_Departamento',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_DepartamentoSchema = {
  CN_ID_Departamento: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  CT_Descripcion: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field: 'CT_Descripcion'
  }
};


module.exports = { T_Departamento, T_DepartamentoSchema };
