const { T_Departamento, T_DepartamentoSchema } = require('./T_Departamento.model');
const { T_Rol, T_RolSchema } = require('./T_Rol.model');
const { T_Sistema, T_SistemaSchema } = require('./T_Sistema.model');
const { T_Usuario, T_UsuarioSchema } = require('./T_Usuario.model');
const { T_Estado, T_EstadoSchema } = require('./T_Estado.model');
const { T_Pantalla, T_PantallaSchema } = require('./T_Pantalla.model');
const { T_Rol_Pantalla, T_Rol_PantallaSchema } = require('./T_Rol_Pantalla.model');
const { T_Rol_Usuario, T_Rol_UsuarioSchema } = require('./T_Rol_Usuario.model');
const { T_Riesgo, T_RiesgoSchema } = require('./T_Riesgo.model');
const { T_Prioridad, T_PrioridadSchema } = require('./T_Prioridad.model');
const { T_Afectacion, T_AfectacionSchema } = require('./T_Afectacion.model');
const { T_Categoria, T_CategoriaSchema } = require('./T_Categoria.model');
const { T_Bitacora_General, T_Bitacora_GeneralSchema } = require('./T_Bitacora_General.model');
const { T_Bitacora_Estado, T_Bitacora_EstadoSchema } = require('./T_Bitacora_Estado.model');
const { T_Diagnostico_Incidencia, T_Diagnostico_IncidenciaSchema } = require('./T_Diagnostico_Incidencia.model');
const { T_Asignacion_Incidencia, T_Asignacion_IncidenciaSchema } = require('./T_Asignacion_Incidencia.model');
const { T_Imagenes_Incidencia, T_Imagenes_IncidenciaSchema } = require('./T_Imagenes_Incidencia.model');
const { T_Incidencia, T_IncidenciaSchema } = require('./T_Incidencia.model');


function setupModels(sequelize) {
    T_Departamento.init(T_DepartamentoSchema, T_Departamento.config(sequelize));
    T_Rol.init(T_RolSchema, T_Rol.config(sequelize));
    T_Sistema.init(T_SistemaSchema, T_Sistema.config(sequelize));
    T_Usuario.init(T_UsuarioSchema, T_Usuario.config(sequelize));
    T_Estado.init(T_EstadoSchema, T_Estado.config(sequelize));
    T_Pantalla.init(T_PantallaSchema, T_Pantalla.config(sequelize));
    T_Rol_Pantalla.init(T_Rol_PantallaSchema, T_Rol_Pantalla.config(sequelize));
    T_Rol_Usuario.init(T_Rol_UsuarioSchema, T_Rol_Usuario.config(sequelize));
    T_Riesgo.init(T_RiesgoSchema, T_Riesgo.config(sequelize));
    T_Prioridad.init(T_PrioridadSchema, T_Prioridad.config(sequelize));
    T_Afectacion.init(T_AfectacionSchema, T_Afectacion.config(sequelize));
    T_Categoria.init(T_CategoriaSchema, T_Categoria.config(sequelize));
    T_Bitacora_General.init(T_Bitacora_GeneralSchema, T_Bitacora_General.config(sequelize));
    T_Bitacora_Estado.init(T_Bitacora_EstadoSchema, T_Bitacora_Estado.config(sequelize));
    T_Diagnostico_Incidencia.init(T_Diagnostico_IncidenciaSchema, T_Diagnostico_Incidencia.config(sequelize));
    T_Asignacion_Incidencia.init(T_Asignacion_IncidenciaSchema, T_Asignacion_Incidencia.config(sequelize));
    T_Imagenes_Incidencia.init(T_Imagenes_IncidenciaSchema, T_Imagenes_Incidencia.config(sequelize));
    T_Incidencia.init(T_IncidenciaSchema, T_Incidencia.config(sequelize));
    // Definición de asociaciones
    T_Incidencia.hasMany(T_Diagnostico_Incidencia, { foreignKey: 'CN_ID_Incidente' });
    T_Incidencia.hasOne(T_Asignacion_Incidencia, { foreignKey: 'CN_ID_Incidente' });
    T_Diagnostico_Incidencia.belongsTo(T_Incidencia, { foreignKey: 'CN_ID_Incidente' });
    T_Asignacion_Incidencia.belongsTo(T_Incidencia, { as: 'T_Incidencia', foreignKey: 'CN_ID_Incidente' });
    T_Asignacion_Incidencia.belongsTo(T_Usuario, { foreignKey: 'CN_ID_Usuario' });
    T_Incidencia.hasMany(T_Imagenes_Incidencia, { foreignKey: 'CN_ID_Incidente' });
    T_Imagenes_Incidencia.belongsTo(T_Incidencia, { foreignKey: 'CN_ID_Incidente' });
    T_Incidencia.belongsTo(T_Estado, { as: 'T_Estado', foreignKey: 'CN_ID_Estado_Incidencia' });
    T_Incidencia.belongsTo(T_Usuario, { as: 'T_Usuario', foreignKey: 'CN_ID_Usuario' });
    T_Incidencia.belongsTo(T_Prioridad, { as: 'T_Prioridad', foreignKey: 'CN_ID_Prioridad_Incidencia' });
    T_Incidencia.belongsTo(T_Riesgo, { as: 'T_Riesgo', foreignKey: 'CN_ID_Riesgo_Incidencia' });
    T_Incidencia.belongsTo(T_Afectacion, { as: 'T_Afectacion', foreignKey: 'CN_ID_Afectacion_Incidencia' });
    T_Incidencia.belongsTo(T_Categoria, { as: 'T_Categoria', foreignKey: 'CN_ID_Categoria_Incidencia' });
    T_Rol_Usuario.belongsTo(T_Rol, { as: 'T_Rol', foreignKey: 'CN_ID_Rol' });
    T_Rol_Usuario.belongsTo(T_Usuario, { as: 'T_Usuario', foreignKey: 'CN_ID_Usuario' });
    T_Asignacion_Incidencia.belongsTo(T_Rol_Usuario, { as: 'roles', foreignKey: 'CN_ID_Usuario' });
    T_Usuario.hasMany(T_Asignacion_Incidencia, { as: 'asignaciones', foreignKey: 'CN_ID_Usuario' });
    T_Usuario.hasMany(T_Rol_Usuario, { as: 'roles', foreignKey: 'CN_ID_Rol' });


}

module.exports = setupModels;
