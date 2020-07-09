const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const JWT = require('jsonwebtoken')

exports.crearUsuario = async (req, res) => {
    try {

        const errores = validationResult(req); 

        if( !errores.isEmpty() ) { // validamos que los datos enviados sea válidos
            return res.status(400).json({ errors: errores.array() })
        }

        const { email, password } = req.body; //Object destructuring para acceder a los valores del usuario
        
        let usuario = await Usuario.findOne({ email }); // Validamos si el email del usuario existe
        if(usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe'} );
        }

        usuario = new Usuario(req.body);
        let salt = await bcrypt.genSalt(10); // la cantidad de ciclos del hash
        usuario.password = await bcrypt.hash(password, salt); // hasheamos el password
        await usuario.save(); // Guardamos el usuario

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
        res.status(400).json({ msg: 'Hubo un error' })
    }
    
}