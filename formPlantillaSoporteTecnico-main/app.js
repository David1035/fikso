#!/usr/bin/env node
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const path = require('path');

// Si aún necesitas conectar o inicializar la base de datos, hazlo en db.js con CREATE TABLE
require('./models/Form'); // Esto asegura que la tabla se cree al iniciar

const app = express();
const port = 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Si usarás frontend estático, descomenta esta línea:
// app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

app.use('/api', apiRoutes);
