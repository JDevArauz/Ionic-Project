const express = require('express');
const nodemailer = require('nodemailer');
const auth = require('../services/Auth.validation');
const token = require('../services/Auth.token');
const email = require('../controllers/Email.controller');
const authenticateToken = require('../middleware/jwt');

const usersRouter = require('./T_Usuario.router');
const rolesRouter = require('./T_Rol.router');
const systemsRouter = require('./T_Sistema.router');
const screensRouter = require('./T_Pantalla.router');
const asignationRouter = require('./T_Asignacion_Incidencia.router');
const bitacoraERouter = require('./T_Bitacora_Estado.router');
const bitacoraGRouter = require('./T_Bitacora_General.router');
const diagnosticRouter = require('./T_Diagnostico_Incidencia.router');
const incidentRouter = require('./T_Incidencia.router');
const imagesRouter = require('./T_Imagenes_Incidencia.router');
const priorityRouter = require('./T_Prioridad.router');
const stateRouter = require('./T_Estado.router');
const afectationRouter = require('./T_Afectacion.router');
const categoriesRouter = require('./T_Categoria.router');
const departmentsRouter = require('./T_Departamento.router');
const riskRouter = require('./T_Riesgo.router');
const screenRoleRouter = require('./T_Rol_Pantalla.router');
const userRoleRouter = require('./T_Rol_Usuario.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api', router);

  // Ruta pública para login
  router.use('/login', auth);

  // Aplicar el middleware de autenticación a las rutas que necesitan protección
  router.post('/send-email', email.sendEmail);
  router.use('/users', authenticateToken, usersRouter);
  router.use('/roles', authenticateToken, rolesRouter);
  router.use('/systems', authenticateToken, systemsRouter);
  router.use('/screens', authenticateToken, screensRouter);
  router.use('/asignations',authenticateToken, asignationRouter);
  router.use('/logsE', authenticateToken, bitacoraERouter);
  router.use('/logsG', authenticateToken, bitacoraGRouter);
  router.use('/diagnostics', authenticateToken, diagnosticRouter);
  router.use('/incidents', incidentRouter);
  router.use('/images',authenticateToken, imagesRouter);
  router.use('/priorities', authenticateToken, priorityRouter);
  router.use('/states', authenticateToken, stateRouter);
  router.use('/afectations', authenticateToken, afectationRouter);
  router.use('/categories', categoriesRouter);
  router.use('/departments', authenticateToken, departmentsRouter);
  router.use('/risks', authenticateToken, riskRouter);
  router.use('/screenRoles', authenticateToken, screenRoleRouter);
  router.use('/userRoles', authenticateToken, userRoleRouter);
  router.post('/token', authenticateToken, token);
}

module.exports = routerApi;
