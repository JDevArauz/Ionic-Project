const express = require('express');
const router = express.Router();
const controller = require('../controllers/T_Categoria.controller');

router
    .get('/', controller.get )
    .get('/most-popular', controller.getMostPopular )
    .get('/:id', controller.getById )
    .post('/', controller.create )
    .put('/:id', controller.update )
    .delete('/:id', controller._delete );

module.exports = router;
