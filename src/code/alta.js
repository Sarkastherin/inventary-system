let form = document.querySelector('form');
let inputUser = document.getElementById('user');
let inputProveedores = document.getElementById('proveedor')
let nombre_producto = document.getElementById('nombre_producto');
let productos;
let nameColLotes;
let dataForm = new Object();
let id;
let loteValues;
let espesor;
let tbody = document.getElementById('top_ten')

async function loadedWindow() {
    inputProveedores.innerHTML = '<option selected disabled value=""></option>'
    tbody.innerHTML = '';
    try {
        productos = await loadedResourses(rangoProductos);
    } catch (e) {
        console.log(e)
    }
    try {
        let data = await loadedResourses(rangoLotes);
        nameColLotes = data.shift()
        //Definiendo id
        id = createdId(data)
        //Obteniedo una lista de los lotes
        loteValues = data.map(item => item[3])
        //Creando tabla que muestra los ultimos 10 lotes creados
        let lastLoteCreated = data.splice(data.length-10,data.length);
        for(lote of lastLoteCreated) {
            productos.map(item => {
                if(item[0] == lote[4]) {
                    lote.push(item[1])
                }
            })
        }
        lastLoteCreated.reverse().forEach(elem => {
            tbody.innerHTML += `
            <tr>
                <th>${elem[0]}</th>
                <td>${elem[3]}</td>
                <td>${elem[4]}</td>
                <td>${elem[14]}</td>
            </tr>
            `
          });
    } catch (e) {
        console.log(e)
        let code = e.result.error.code
        error_400(code)
    }
    try {
        let data = await loadedResourses(rangoProveedores);
        data.shift()
        data.map(item => {
            let node = document.createElement("option");
            let textnode = document.createTextNode(item[1]);
            node.setAttribute('value', item[2])
            inputProveedores.appendChild(node);
            node.appendChild(textnode)
        })

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
}
/* Cargar descripción del producto al ingresar el codigo*/
codigo.addEventListener('change', loadProductos)
async function loadProductos() {
    try {
        let data = await loadedResourses(rangoProductos);
        let producto = data.filter(item => {
            if (item.includes(codigo.value)) {
                return item
            }
        })
        producto = producto[0]
        if (producto != undefined) {
            nombre_producto.value = producto[1]
            espesor = producto[2]
        }
        else {
            nombre_producto.value = null
            modalShow('Requerimiento no completado ❌', 'Producto no encontrado, debe revisar los datos ingresados')
        }
    } catch (e) {
        let code = e.result.error.code
        error_400(code)
    }
}
/* Escucha del evento submit: valida el formulario, y ejecuta la función saveAlta() */
form.addEventListener('submit', event => {
    let valid = validated(event, formAlta);
    if(valid){
        let lote = saveAlta();
        if (lote === undefined) {
            modalShow('Requerimiento no completado ❌', 'No se han podido guardar los datos')
        }
        else {
            modalShow('Requerimiento completado ✅','¡Lote creado exitosamente! Se ha dado de lata el lote '+lote)
            reload()
        }
    }
    console.log(valid)
    event.preventDefault()
}, false);
/* Guarda la información en Tabla LOTES */
async function saveAlta() {
    /* Setea algunos campos predeterminados */
    dataForm = {
        id: id.toString(),
        fecha: getDate(),
        espesor: espesor,
        ancho_real: '-',
        largo_real: '-',
        estado: 'Alta'
    }
    /* ubica todos los input con la clase .save y guarda el valor y clave (id) en el objeto dataForm */
    let arr = form.querySelectorAll('.save');
    arr.forEach(elem => dataForm[elem.id]=elem.value);
    /* Busca el ultimo numero del lote para sumar 1 y agregar el alias del proveedor */
    let numberLote = lastNumberLote(dataForm.proveedor);
    dataForm['lote'] = dataForm.proveedor + (numberLote + 1);
    /* Convieret los datos del Obj. dataForm en u array con el orden de la tabla LOTES */
    transformData(dataForm, nameColLotes)
    /* Pedición POST */
    let responsePost = await postData(rangoLotes, nameColLotes);
    if (!responsePost) {
        badRequest();
    }
    else {
        return dataForm.lote 
    }
}
function lastNumberLote(alias){
    var data = loteValues.filter(item => {return item.startsWith(alias)})
    if(data.length<=0){
      var max = 0
    } 
    else{
      data = data.map(item =>{return Number(item.substring(2))})
      var max = Math.max(...data)
    }
    return max 
  }


