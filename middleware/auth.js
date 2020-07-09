const JWT = require('jsonwebtoken')

module.exports = function(req, res, next) {
    //Leer el header del token
    const token = req.header('x-auth-token');
    
    //Revisar si no hay token
    if(!token) {
        return res.status(401).json({ msg: 'El token no existe o ha expirado' });
    }

    //valida token
    try {
        
        const cifrado = JWT.verify(token, process.env.JWT_SECRET);
        req.usuario = cifrado.usuario;
        next();

    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' })
    }
}