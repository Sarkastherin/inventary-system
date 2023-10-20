let form = document.querySelector('form');
let inputLote = document.getElementById('lote')
let inputUser = document.getElementById('user')
let inpuCodigo = document.getElementById('codigo');
let inputNombreProducto = document.getElementById('nombre_producto');
let inputAnchoAc = document.getElementById('ancho_ac')
let inputLargoAc = document.getElementById('largo_ac')
let inputAnchoReal = document.getElementById('ancho_real')
let inputLargoReal = document.getElementById('largo_real')
let dataFormMov = new Object();
let dataFormLote = new Object();
let id;
let headersOfMov;
let indexOfLote;
let lotesPositivos = new Array()

/* Carga datos y recursos necesarios para la inicialización
 - Datos de la tabla
 - Lotes por ingresar
 - Usuarios
 - Encabezados de la hoja Movimientos*/
async function loadedWindow() {
    inputLote.innerHTML = '<option selected disabled value=""></option>'
    try {
        let data = await loadedResourses(rangoMovimientos);
        let loteForConsume = data.map(item => item[3]);
        let loteUnique = [...new Set(loteForConsume)];
        for (lote of loteUnique){
            let arr = data.filter(item=>{return item[3]==lote});
            arr = arr.map(item=>{return Number(item[4])})
            let cantidadOfLote = sumarArray(arr);
            if(cantidadOfLote>0){
              lotesPositivos.push([lote,sumarArray(arr)])
            }
          }
          console.log(lotesPositivos)
        
    } catch (e) {
        console.log(e)
        let code = e.result.error.code
        error_400(code)
    }
    try {
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

    }
}
/* Cargar las características del lote al ingresar el codigo*/
inputLote.addEventListener('change', loadProductos)
async function loadProductos() {
    try {
        let data = await loadedResourses(rangoLotes);
        let loteAIngresar = data.filter(item => item[3] == inputLote.value);
        indexOfLote = data.indexOf(loteAIngresar[0]) + 1
        loteAIngresar = loteAIngresar[0]
        inpuCodigo.value = loteAIngresar[4];
        inputNombreProducto.value = loteAIngresar[5];
        inputAnchoAc.value = loteAIngresar[9];
        inputLargoAc.value = loteAIngresar[10];
    } catch (e) {
        let code = e.result.error.code
        error_400(code)
    }
}
/* Escucha del evento submit: valida el formulario, y ejecuta la función saveIngreso() */
form.addEventListener('submit', async event => {
    let valid = validated(event, form);
    if (valid) {
        let lote = await saveIngreso();
        if (lote === undefined) {
            modalShow('Requerimiento no completado ❌', 'No se han podido guardar los datos')
        }
        else {
            modalShow('Requerimiento completado ✅', '¡Lote ingresado exitosamente! Se ha ingresado el lote ' + lote)
            reload()
        }
    }
    event.preventDefault()
}, false);
/* Guarda la información en Tabla LOTES */
async function saveIngreso() {
    /* Setea algunos campos predeterminados */
    dataFormMov = {
        id: id.toString(),
        fecha: getDate(),
        tipo: 'Ingreso',
        tipo_orden: 'Recepción',
        id_orden: '0',
        maquina_corte: 'N/A'
    }
    /* ubica todos los input con la clase .save-in-mov y guarda el valor y clave (id) en el objeto dataForm */
    let arr = form.querySelectorAll('.save-in-mov');
    arr.forEach(elem => dataFormMov[elem.id] = elem.value);
    /* Convieret los datos del Obj. dataForm en u array con el orden de la tabla LOTES */
    transformData(dataFormMov, headersOfMov)
    /* Petición POST */
    let responsePost = await postData(rangoMovimientos, headersOfMov);
    if (!responsePost) {
        badRequest();
    }
    else {
        let arr2 = form.querySelectorAll('.save-in-lote');
        arr2.forEach(elem => dataFormLote[elem.id] = elem.value);
        dataFormLote['estado'] = 'Ingreso'
        let data = await createdData(dataFormLote, indexOfLote, hojaLote, rangoLotes);
        let responseUpdate = await updateData(data)
        if (!responseUpdate) {
            console
            badRequest()
        }
        else { return dataFormMov.lote }
    }
}


