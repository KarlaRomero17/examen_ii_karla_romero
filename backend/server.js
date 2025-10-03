const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

//configuraciones a servidor http
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/movies')
.then(() => console.log('Conexion a MOngoDB exitosa')) 
.catch( err => console.error('Error al conectar a MongoDB: ', err));

// Rutas
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`);
});
