const mongoose = require('mongoose')

const TareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: Boolean,
        default: false
    },
    proyectoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto'
    },
    fechaCreado: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Tareas', TareaSchema);