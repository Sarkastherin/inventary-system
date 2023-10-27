let form = document.querySelector('form');
let inputLote = document.getElementById('lote')
let inputUser = document.getElementById('user')
let inpuCodigo = document.getElementById('codigo');
let inputNombreProducto = document.getElementById('nombre_producto');
let inputCantidadMano = document.getElementById('cantidad_mano');
let dataFormMov = new Object();
let id;
let headersOfMov;
let lotesPositivos = new Array();
let productos;

/* Carga datos y recursos necesarios para la inicialización
 - Lotes para consumo (>0)
 - Usuarios
 - id
 - Encabezados de la hoja Movimientos*/
async function loadedWindow() {
    console.log('load')
}



