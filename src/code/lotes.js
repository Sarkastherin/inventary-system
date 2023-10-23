let tbody = document.getElementById('top_ten');
let allLotes = new Array();
let lotesPositivos = new Array()

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
}