const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    const errores = validationResult(req); 

    if( !errores.isEmpty() ) { // validamos que los datos enviados sea válidos
        return res.status(400).json({ errors: errores.array() })
    }
    
    try {
        
        const proyecto = new Proyecto(req.body);

        //guardar el usuarioId del proyecto via JWT
        proyecto.usuarioId = req.usuario.id
         
        // Guardarmos el proyecto
        await proyecto.save();
        res.send(proyecto)

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error interno del servidor' })
        
    }

}

//Obtener todos los proyectos por usuario
exports.obtenerProyectos = async(req, res) => {
    try {
        
        const proyectos = await Proyecto.find({ usuarioId: req.usuario.id });
        res.json({ proyectos });

    } catch (error) {
        res.status(500).json({ msg: 'Error de conexión con el servidor' })
    }
}

//actualizar la info del proyecto
exports.actualizarProyectos = async(req, res) => {
    const errores = validationResult(req); 

    if( !errores.isEmpty() ) { // validamos que los datos enviados sea válidos
        return res.status(400).json({ errors: errores.array() })
    }

    //Object Destructuring para obtener la informacion del proyecto
    const {nombre} = req.body;
    const nuevoProyecto = {};

    if(nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        //revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        //Validar si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado.' });
        }
        //Validar el usuario del proyecto
        if(proyecto.usuarioId.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'Este usuario no está autorizado.' })
        }
        //actualizar la info
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });

        res.json({ proyecto });

    } catch (error) {
        console.log(error);
        res.status(500).jsno({msg: 'Error de conexion con el servidor'})
    }
}

//Eliminar proyecto por Id
exports.eliminarProyectos = async (req, res) => {
    try {
        
         //revisar el ID
         let proyecto = await Proyecto.findById(req.params.id);

         //Validar si el proyecto existe o no
         if(!proyecto){
             return res.status(404).json({ msg: 'Proyecto no encontrado.' });
         }
         //Validar el usuario del proyecto
         if(proyecto.usuarioId.toString() !== req.usuario.id) {
             return res.status(401).json({ msg: 'Este usuario no está autorizado.' })
         }

         //Eliminar el Proyecto
         await Proyecto.findOneAndDelete({ _id: req.params.id });
         res.json({ msg: 'Proyecto eliminado exitosamente' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error de conexión con el servidor'});
    }
}