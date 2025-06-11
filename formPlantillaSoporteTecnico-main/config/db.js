const path = require('path');
const Database = require('better-sqlite3');

// Ruta a la base de datos
const dbPath = path.resolve(process.cwd(), 'db/database.sqlite');

// Crear conexión
const db = new Database(dbPath, { verbose: console.log });

// Exportar para usar en otros archivos
module.exports = db;

