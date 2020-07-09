const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { check } = require('express-validator')
const tareaController = require('../controller/tareaController')

router.post('/',
    auth,
    [
        check('nombre', 'El nombre de la tarea es requerida')
    ],
    tareaController.crearTarea
);

router.get('/',
    auth,
    tareaController.obtenerTareas
)

router.put('/:id',
    auth,
    tareaController.actualizarTarea
);

router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)


module.exports = router;