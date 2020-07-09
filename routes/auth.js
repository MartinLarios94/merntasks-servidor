const express = require('express')
const router = express.Router();
const { check } = require('express-validator')
const authController = require('../controller/authController')
const auth = require('../middleware/auth')

// Autenticando Usuario
// api/auth
router.post('/', 
    authController.autenticarUsuario
);

router.get('/',
    auth,
    authController.obtenerUsuario
);

module.exports = router;