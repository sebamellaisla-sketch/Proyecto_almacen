<<<<<<< HEAD
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath);

// Crea tablas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio REAL NOT NULL,
      stock INTEGER NOT NULL
    )
  `);
});

=======
// src/database.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crea la conexión a la base de datos
const dbPath = path.resolve(__dirname, 'almacen.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a la base de datos.');
        // Llama a la función para crear las tablas
        createTables();
    }
});

// Función para crear las tablas si no existen
function createTables() {
    db.serialize(() => {
        // Tabla para los productos
        db.run(`CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            precio REAL NOT NULL,
            stock INTEGER NOT NULL
        )`);

        // Tabla para las ventas
        db.run(`CREATE TABLE IF NOT EXISTS ventas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            producto_id INTEGER NOT NULL,
            cantidad INTEGER NOT NULL,
            fecha TEXT NOT NULL,
            FOREIGN KEY(producto_id) REFERENCES productos(id)
        )`);

        console.log('Tablas creadas o ya existentes.');
    });
}

// Exporta el objeto de la base de datos para usarlo en otras partes de la aplicación
>>>>>>> c396743fd50a9bf31a328765323cc96c05ee10d8
module.exports = db;