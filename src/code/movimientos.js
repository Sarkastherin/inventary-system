let tbody = document.getElementById('top_ten');
var filtro = {
    input_espesor: '',
    input_codigo: '',
    input_user: ''
}
let body = document.querySelector('body');
let headers = ['Codigo', 'Descripcion', 'Espesor', 'Cantidad'];
let data ;
const prevButton = document.getElementById('prevPage');
const nextButton = document.getElementById('nextPage');
const itemsPerPage = 13;
let currentPage = 0;
async function loadedWindow() {
    tbody.innerHTML = '';
    let productos;
    try {
        productos = await loadedResourses(rangoProductos);
    } catch (e) {
        console.log(e)
    }
    try {
        data = await loadedResourses(rangoMovimientos);
        data.shift();
        loadTablePage(currentPage, data)

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
            data = data.filter(item => {
                if (item[3].includes(filtro.input_codigo) && item[9].includes(filtro.input_user)) {
                    return item
                }
            })
            loadTablePage(currentPage, data);

        })
    })
})()
function loadTablePage(page, data) {
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    tbody.innerHTML = '';
    for (let i = start; i < end && i < data.length; i++) {
        tbody.innerHTML += `
                <tr>
                    <th>${data[i][3]}</th>
                    <th>Des</th>
                    <th>Esp</th>
                    <td>${data[i][4]}</td>
                    <td>${data[i][2]}</td>
                    <td>${data[i][6]}</td>
                    <td>${data[i][7]}</td>
                    <td>${data[i][8]}</td>
                    <td>${data[i][1]}</td>
                    <td>${data[i][9]}</td>
                </tr>`
    }
    if (page !== 0) {
        prevButton.removeAttribute('disabled', '')
    }
    else { 
        prevButton.setAttribute('disabled', '') 
    }
}

prevButton.addEventListener('click', async (data) => {
    if (currentPage > 0) {
        currentPage--;
        loadTablePage(currentPage, data);
    }
});

nextButton.addEventListener('click', async (data) => {
    if (currentPage < Math.ceil(data.length / itemsPerPage) - 1) {
        currentPage++;
        loadTablePage(currentPage, data);
    }
});
