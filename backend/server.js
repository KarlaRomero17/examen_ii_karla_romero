const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/sistema-clinica', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Rutas
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`);
});
