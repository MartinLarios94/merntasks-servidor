const express = require('express');
const router = express.Router();
const proyectoController = require('../controller/proyectoController');
const auth = require('../middleware/auth')
const { check } = require('express-validator')

router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').notEmpty()
    ],
    proyectoController.crearProyecto
);

router.get('/',
    auth,
    proyectoController.obtenerProyectos
);

router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').notEmpty()
    ],
    proyectoController.actualizarProyectos
);

router.delete('/:id',
    auth,
    proyectoController.eliminarProyectos
);

module.exports = router;