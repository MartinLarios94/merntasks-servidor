const Tarea = require('../models/Tareas')
const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator');

exports.crearTarea = async (req, res) => {

    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const {proyectoId} = req.body;   
        const existeProyecto = await Proyecto.findById(proyectoId);
        if(!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
         //Validar el usuario del proyecto
        if(existeProyecto.usuarioId.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'Este usuario no está autorizado.' })
        }

        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json(tarea);

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error de conexión con el servidor' })
    }

};

exports.obtenerTareas = async (req, res) => {
    try {

        const {proyectoId} = req.query;
        const existeProyecto = await Proyecto.findById(proyectoId);
        if(!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
         //Validar el usuario del proyecto
        if(existeProyecto.usuarioId.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'Este usuario no está autorizado.' })
        }

        //obtener tarea por Id de Proyecto
        const tareas = await Tarea.find({ proyectoId })
        res.json({tareas})

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error de conexión con el servidor' })
    }
}

exports.actualizarTarea = async (req, res) => {
    try {

        const { proyectoId, nombre, estado } = req.body;
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }

        //Extraer el proyecto
        const existeProyecto = await Proyecto.findById(proyectoId);

         //Validar el usuario del proyecto
        if(existeProyecto.usuarioId.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'Este usuario no está autorizado.' })
        }

        //Crear objeto con la nueva informacion
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //guardar la tarea actualizada
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true })
        res.json({tarea})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error de conexión con el servidor' })
    }
}

exports.eliminarTarea = async (req, res) => {
    try {

        const { proyectoId } = req.query;
        let tareaExiste = await Tarea.findById(req.params.id);

        if(!tareaExiste) {
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }

        //Extraer el proyecto
        const existeProyecto = await Proyecto.findById(proyectoId);

         //Validar el usuario del proyecto
        if(existeProyecto.usuarioId.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'Este usuario no está autorizado.' })
        }

        //Eliminar una tarea por Id
        await Tarea.findByIdAndRemove({ _id: req.params.id })
        res.json({ msg: 'Tarea eliminada correctamente' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error de conexión con el servidor' })
    }
}