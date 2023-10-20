let tbody = document.getElementById('top_ten');
let allLotes = new Array();
let lotesPositivos = new Array()
/* let inputLote = document.getElementById('lote')
let inputUser = document.getElementById('user')
let inpuCodigo = document.getElementById('codigo');
let inputNombreProducto = document.getElementById('nombre_producto');
let inputCantidadMano = document.getElementById('cantidad_mano');
let dataFormMov = new Object();
let id;
let headersOfMov;
 */

/* Carga datos y recursos necesarios para la inicialización
 - Todos los lotes como data list
 - Usuarios
 - id
 - Encabezados de la hoja Movimientos*/
async function loadedWindow() {
    tbody.innerHTML = '<option selected disabled value=""></option>';
    let data
    try {
        data = await loadedResourses(rangoMovimientos);
        let lotesAndQuantity = data.map(item => item[3]);
        lotesAndQuantity.shift();
        let loteUnique = [...new Set(lotesAndQuantity)];
        for (let lote of loteUnique) {
            let arr = data.filter(item => { return item[3] == lote });
            arr = arr.map(item => { return Number(item[4]) })
            let cantidadOfLote = sumarArray(arr);
            if (cantidadOfLote > 0) {
                lotesPositivos.push([lote, sumarArray(arr)])
            }
        }
        console.log(lotesPositivos)
    } catch (e) {
        console.log(e)
        let code = e.result.error.code
        error_400(code)
    }
    /*try {
        inputUser.innerHTML = '<option value="">Seleccione su nombre</option>'
        let data = await loadedResourses(rangoUsers);
        data.shift()
        data.map(item => {
            let node = document.createElement("option");
            let textnode = document.createTextNode(item[0]);
            node.setAttribute('value', item[1])
            inputUser.appendChild(node);
            node.appendChild(textnode)
        })
    } catch (e) {
        console.log(e)
        let code = e.result.error.code
        error_400(code)
    }
    try {
        let data = await loadedResourses(rangoMovimientos)
        headersOfMov = data.shift()
        id = createdId(data)
    } catch (e) {

    } */
}
/* Cargar las características del lote al ingresar el codigo*/
/* inputLote.addEventListener('change', loadProductos)
async function loadProductos() {
    let loteAConsumir = allLotes.filter(item => item[0] == inputLote.value);
    inputCantidadMano.value = loteAConsumir[0][1]
    try {
        let data = await loadedResourses(rangoLotes);
        let loteAConsumir = data.filter(item => item[3] == inputLote.value);
        inpuCodigo.value = loteAConsumir[0][4];
        inputNombreProducto.value = loteAConsumir[0][5];
    } catch (e) {
        console.log(e)
        let code = e.result.error.code
        error_400(code)
    }
} */
/* Escucha del evento submit: valida el formulario, y ejecuta la función saveConsumo() */
/* form.addEventListener('submit', async event => {
    let valid = validated(event, form);
    if (valid) {
        let lote = await saveConsumo();
        if (lote === undefined) {
            modalShow('Requerimiento no completado ❌', 'No se han podido guardar los datos')
        }
        else {
            modalShow('Requerimiento completado ✅', '¡Se ha descontado '+ 0 +' el lote ' + lote)
            reload()
        }
    }
    event.preventDefault()
}, false); */
/* Guarda la información en Tabla LOTES */
async function saveConsumo() {
    /* Setea algunos campos predeterminados */
    dataFormMov = {
        id: id.toString(),
        fecha: getDate(),
        tipo: 'Actualización',
        tipo_orden: 'Control de stock',
        id_orden: '0',
        maquina_corte: 'N/A'
    }
    /* ubica todos los input con la clase .save y guarda el valor y clave (id) en el objeto dataForm */
    let arr = form.querySelectorAll('.save');
    arr.forEach(elem => dataFormMov[elem.id] = elem.value);
    dataFormMov['cantidad'] = dataFormMov.cantidad - dataFormMov.cantidad_mano
    /* Convieret los datos del Obj. dataForm en u array con el orden de la tabla LOTES */
    transformData(dataFormMov, headersOfMov)
    /* Petición POST */
    let responsePost = await postData(rangoMovimientos, headersOfMov);
    if (!responsePost) {
        badRequest();
    }
    else {
        return dataFormMov.lote
    }
}


