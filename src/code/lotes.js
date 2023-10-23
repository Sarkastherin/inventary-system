let tbody = document.getElementById('top_ten');
let stockByLote = new Object()

async function loadedWindow() {
    tbody.innerHTML = '<option selected disabled value=""></option>';
    let data
    try {
        data = await loadedResourses(rangoMovimientos);
        data.shift()
        for (let mov of data) {
            if(stockByLote.hasOwnProperty(mov[3])){
                stockByLote[mov[3]][4] = Number(mov[4])+Number(stockByLote[mov[3]][4])
            }
            else {
               stockByLote[mov[3]] = mov
            }
        }
        for (let lote in stockByLote) {
            if(stockByLote[lote][4]>0){
               tbody.innerHTML += `
                <tr>
                    <th>${lote}</th>
                    <td>${stockByLote[lote][5]}</td>
                    <td>${stockByLote[lote][6]}</td>
                    <td>${stockByLote[lote][4]}</td>
                </tr>
            ` 
            }
        }
        
        
    } catch (e) {
        console.log(e)
        let code = e.result.error.code
        error_400(code)
    }
}