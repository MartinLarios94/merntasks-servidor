//importar express
const express = require('express')
const conectarBD = require('./config/db')
const cors = require('cors')

// crear el servidor
const app = express();

// conectar con la BD
conectarBD();

//Habilitamos los CORS
app.use(cors());

//Habilitar express.json
app.use( express.json({ extend: true }));

// puerto de la app
const port = process.env.port || 4000;

// Importar Rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/proyectos', require('./routes/proyectos'))
app.use('/api/tareas', require('./routes/tareas'))

// arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
    
})


