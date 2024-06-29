// Archivo: models/T_Rol_Pantalla.js
const { Model, DataTypes } = require('sequelize');


const ROL_PANTALLA_TABLE = 'T_Roles_Pantallas';

class T_Rol_Pantalla extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: ROL_PANTALLA_TABLE,
      modelName: 'T_Rol_Pantalla',
      timestamps: false // Ajusta esto según tus necesidades
    }
  }
}

const T_Rol_PantallaSchema = {
  CN_ID_Rol: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  CN_ID_Pantalla: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  CF_Fecha_Asignacion: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
};


module.exports = { T_Rol_Pantalla, T_Rol_PantallaSchema};
