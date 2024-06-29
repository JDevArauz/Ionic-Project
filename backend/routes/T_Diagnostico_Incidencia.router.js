const express = require('express');
const router = express.Router();
const controller = require('../controllers/T_Diagnostico_Incidencia.controller');

router
    .get('/', controller.get )
    .get('/search', controller.getByIdOrUsuario)
    .get('/:id', controller.getById )
    .post('/', controller.create )
    .put('/:id', controller.update )
    .delete('/:id', controller._delete );

module.exports = router;
