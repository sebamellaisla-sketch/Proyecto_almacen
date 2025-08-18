// Importa el módulo ipcRenderer para la comunicación con el proceso principal
const { ipcRenderer } = require('electron');

// 1. Captura el formulario usando su ID
const productForm = document.getElementById('productForm');

// 2. Maneja el evento 'submit'
productForm.addEventListener('submit', (event) => {
    // 3. Previene el comportamiento por defecto del formulario
    event.preventDefault();

    // 4. Obtiene los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;

    // 5. Manda los datos al proceso principal (main.js) para que los guarde en la base de datos
    ipcRenderer.send('agregar-producto', { nombre, precio, stock });

    // Opcional: Limpia el formulario después de enviar los datos
    productForm.reset();
});

// 1. Pide a main.js que obtenga los productos de la base de datos
window.addEventListener('load', () => {
    ipcRenderer.send('obtener-productos');
});

// 2. Escucha la respuesta de main.js con la lista de productos
ipcRenderer.on('productos-cargados', (event, productos) => {
    const productsTableBody = document.querySelector('#productsTable tbody');
    productsTableBody.innerHTML = ''; // Limpia la tabla por si ya tiene contenido

    // 3. Itera sobre cada producto y crea una fila en la tabla
    productos.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>${producto.stock}</td>
        `;
        productsTableBody.appendChild(row);
    });
});