const express = require('express');
const router = express.Router();
const controller = require('../controllers/T_Incidencia.controller');

router
.get('/report-filter', controller.getFilteredIncidencias)
.get('/filter', controller.getByEstadoPrioridad)
.get('/search', controller.getByIdOrUsuario)
.get('/noassign', controller.getNoAssign)
.get('/ended', controller.getEnded)
.get('/assigned', controller.getAssignedByUser)
.get('/:id', controller.getById)
.get('/getid/:id', controller.getId)
.get('/', controller.get)
.post('/', controller.create )
.put('/:id', controller.update )
.delete('/:id', controller._delete );

module.exports = router;
