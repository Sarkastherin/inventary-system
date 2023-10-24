let tbody = document.getElementById('top_ten');
var filtro = {
    input_lote: '',
    input_espesor: '',
    input_codigo: ''
}
let body = document.querySelector('body');
let headers = ['Lote','Codigo', 'Descripcion', 'Espesor', 'Cantidad'];
async function loadedWindow() {
    let stockByLote = new Object();
    let array = new Array();
    tbody.innerHTML = '';
    let productos;
    try {
        productos = await loadedResourses(rangoProductos);
    } catch (e) {
        console.log(e)
    }
    let data
    try {
        data = await loadedResourses(rangoMovimientos);
        data.shift();
        for (let mov of data) {
            if (stockByLote.hasOwnProperty(mov[3])) {
                stockByLote[mov[3]][0] = Number(mov[4]) + Number(stockByLote[mov[3]][0])
            }
            else {
                stockByLote[mov[3]] = [mov[4], mov[5]];
                productos.map(item => {
                    if (item[0] == mov[5]) {
                        stockByLote[mov[3]].push(item[1], item[2])
                    }
                })
            }
        }
        for (let lote in stockByLote) {
            if (stockByLote[lote][0] > 0) {
                array.push([lote, stockByLote[lote][1], stockByLote[lote][2], stockByLote[lote][3], stockByLote[lote][0]]);
            }
        }
        array = array.filter(item => {
            if (item[0].includes(filtro.input_lote) && item[1].includes(filtro.input_codigo) && item[3].includes(filtro.input_espesor)) {
                 return item
             }
         });
         array.map(item => {
                tbody.innerHTML += `
                <tr>
                    <th>${item[0]}</th>
                    <td>${item[1]}</td>
                    <td>${item[2]}</td>
                    <td>${item[3]}</td>
                    <td>${item[4]}</td>
                </tr>`
        });
        createCSVfile(array, headers);
        if(!tbody.hasChildNodes()) {
            let node = `
            <div class="alert alert-info" role="alert">
                No se han encontrado coincidencias
            </div>`
            let container = document.createElement('div');
            container.setAttribute('class', 'container text-center alert')
            container.innerHTML = node;
            body.appendChild(container)
        }
        else {
            let alert = document.querySelector('.alert');
            if(alert!=null){
              body.removeChild(alert)  
            }
        }
    } catch (e) {
        console.log(e)
        let code = e.result.error.code
        error_400(code)
    }
}
(() => {
    const filterInput = document.querySelectorAll('.filter-input');
    Array.from(filterInput).forEach(input => {
        input.addEventListener('change', async event => {
            let value = event.target.value;
            let key = event.target.id;
            filtro[key] = value;
            await loadedWindow();
            
        })
    })
})()