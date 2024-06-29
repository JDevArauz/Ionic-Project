// Archivo: models/T_Rol_Usuario.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const ROL_USUARIO_TABLE = 'T_Roles_Usuarios';

class T_Rol_Usuario extends Model {
  static associate(models) {
    this.belongsTo(models.T_Rol, { foreignKey: 'CN_ID_Rol', as: 'rol' });
    this.belongsTo(models.T_Usuario, { foreignKey: 'CN_ID_Usuario', as: 'usuario' });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: ROL_USUARIO_TABLE,
      modelName: 'T_Rol_Usuario',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_Rol_UsuarioSchema = {
  CN_ID_Rol: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  CN_ID_Usuario: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER
  }
};


module.exports = { T_Rol_Usuario, T_Rol_UsuarioSchema};
