const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const JWT = require('jsonwebtoken')

exports.autenticarUsuario = async (req, res) => {
    const errores = validationResult(req); 

    if( !errores.isEmpty() ) { // validamos que los datos enviados sea válidos
        return res.status(400).json({ errors: errores.array() })
    }

    try {
        
        const { email, password } = req.body; //Object destructuring para acceder a los valores del usuario
        
        let usuario = await Usuario.findOne({ email }); // Validamos si el email del usuario existe
        if(!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe'} );
        }

        //Validamos el password
        let passCorrecto = await bcrypt.compare(password, usuario.password);
        if(!passCorrecto) {
            return res.status(400).json({ msg: 'Password Incorrecto' })
        }

        //Creamos el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Firmamos el JWT
        JWT.sign(payload, process.env.JWT_SECRET, { 
            expiresIn: 3600
         }, (error, token) => {
            if(error) throw error;

            res.json({ token });
         });

    } catch (error) {
        console.log(error);
        
    }
}

exports.obtenerUsuario = async (req, res) => {
    try {

        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error interno del servidor' })
    }
}