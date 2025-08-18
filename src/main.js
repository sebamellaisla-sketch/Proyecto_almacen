// src/main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./database');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile(path.join(__dirname, '../public/index.html'));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Escucha el evento 'agregar-producto' que viene de renderer.js
ipcMain.on('agregar-producto', (event, producto) => {
    const { nombre, precio, stock } = producto;

    const sql = `INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)`;
    db.run(sql, [nombre, precio, stock], function(err) {
        if (err) {
            console.error('Error al insertar el producto:', err.message);
        } else {
            console.log(`Producto agregado con ID: ${this.lastID}`);
        }
    });
});

// Escucha el evento 'obtener-productos' que viene de renderer.js
ipcMain.on('obtener-productos', (event) => {
    // 1. Lógica para obtener todos los productos de la base de datos
    const sql = `SELECT * FROM productos ORDER BY nombre`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener los productos:', err.message);
            // Podrías enviar un mensaje de error a la ventana de la interfaz
        } else {
            // 2. Envía la lista de productos de vuelta a la ventana del navegador
            event.reply('productos-cargados', rows);
        }
    });
});