const db = require('../config/db');

db.exec(`
  CREATE TABLE IF NOT EXISTS Form (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idLlamada TEXT,
    name TEXT,
    documentoIdentidad TEXT,
    observaciones TEXT,
    fecha TEXT,
    hora TEXT,
    tiempoPromedio REAL,
    tipoPlantilla TEXT
  )
`);

module.exports = db;
