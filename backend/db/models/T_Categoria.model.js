// Archivo: models/T_Categoria.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const CATEGORIA_TABLE = 'T_Categorias';

class T_Categoria extends Model {
  static associate(models) {
    this.belongsTo(models.T_Incidencia, { foreignKey: 'CN_ID_Categoria_Incidencia' });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: CATEGORIA_TABLE,
      modelName: 'T_Categoria',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_CategoriaSchema = {
  CN_ID_Categoria: {
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

module.exports = { T_Categoria, T_CategoriaSchema};
