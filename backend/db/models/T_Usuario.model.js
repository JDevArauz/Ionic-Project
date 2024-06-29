// Archivo: models/T_Usuario.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../libs/sequelize');

const USUARIO_TABLE = 'T_Usuarios';

class T_Usuario extends Model {
  static associate(models) {
    this.belongsTo(models.T_Departamento, { foreignKey: 'CN_ID_Departamento', as: 'departamento' });
    this.belongsTo(models.T_Rol, { foreignKey: 'CN_ID_Rol', as: 'rol' });
    this.hasMany(models.T_Rol_Usuario, { foreignKey: 'CN_ID_Usuario', as: 'roles' });
    this.hasMany(models.T_Asignacion_Incidencia, { foreignKey: 'CN_ID_Usuario', as: 'asignaciones' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USUARIO_TABLE,
      modelName: 'T_Usuario',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_UsuarioSchema = {
  CN_ID_Usuario: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  CN_ID_Departamento: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'CN_ID_Departamento'
  },
  CN_ID_Rol: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'CN_ID_Rol'
  },
  CT_Nombre: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field: 'CT_Nombre'
  },
  CT_Cedula: {
    allowNull: false,
    type: DataTypes.STRING(20),
    field: 'CT_Cedula'
  },
  CT_Contrasena: {
    allowNull: false,
    type: DataTypes.STRING(20),
    field: 'CT_Contrasena'
  },
  CT_Correo: {
    allowNull: false,
    type: DataTypes.STRING(20),
    field: 'CT_Correo'
  },
  CT_Puesto: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field: 'CT_Puesto'
  },
  CT_Celular: {
    allowNull: false,
    type: DataTypes.STRING(20),
    field: 'CT_Celular'
  }
};


module.exports = { T_Usuario, T_UsuarioSchema};
