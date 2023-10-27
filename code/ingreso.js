let form = document.querySelector('form');
let inputLote = document.getElementById('lote')
let inputUser = document.getElementById('user')
let tbody = document.getElementById('top_ten')
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
let productos;

/* Carga datos y recursos necesarios para la inicialización
 - Datos de la tabla
 - Lotes por ingresar
 - Usuarios
 - Encabezados de la hoja Movimientos*/
async function loadedWindow() {
    inputLote.innerHTML = '<option selected disabled value=""></option>'
    tbody.innerHTML = '';
    try {
        productos = await loadedResourses(rangoProductos);
    } catch (e) {
        console.log(e)
    }
    try {
        let data = await loadedResourses(rangoLotes);
        let loteInAlta = data.filter(item => item[13] == 'Alta');
        if (loteInAlta.length == 0) {
            form.innerHTML = `
            <div class="alert alert-warning" role="alert">
                <h2 class="text-center">No hay lotes para ingresar</h2>
            </div>`
        }
        else {
            for (lote of loteInAlta) {
                productos.map(item => {
                    if(item[0] == lote[4]) {
                        lote.push(item[1])
                    }
                })
            }
            loteInAlta.reverse().forEach(elem => {
                tbody.innerHTML += `
            <tr>
                <th>${elem[0]}</th>
                <td>${elem[3]}</td>
                <td>${elem[4]}</td>
                <td>${elem[14]}</td>
            </tr>
            `
            })
            loteInAlta.map(item => {
                let node = document.createElement("option");
                let textnode = document.createTextNode(item[3]);
                node.setAttribute('value', item[3])
                inputLote.appendChild(node);
                node.appendChild(textnode)
            })
        }
    } catch (e) {
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
        let descripcion = productos.filter(item => {return item[0]==loteAIngresar[4]})
        inputNombreProducto.value = descripcion[0][1];
        inputAnchoAc.value = loteAIngresar[8];
        inputLargoAc.value = loteAIngresar[9];
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


