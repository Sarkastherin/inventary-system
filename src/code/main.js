/* Constantes de la Hoja de Cálculo */
const navbar = document.querySelector('.navbar')
const module = document.getElementsByTagName('body')
const nameIdModule = module[0].attributes.id.nodeValue
const rangoLotes = "LOTES!A:O";
const rangoUsers = "OPERARIOS!A:C";
const rangoProveedores = "PROVEEDORES!A:C";
const rangoProductos = "PRODUCTOS!A:E";
const rangoMovimientos = "MOVIMIENTOS!A:L";
const hojaLote = "LOTES"
window.addEventListener('load', loadNavbar);
function loadNavbar() {
  navbar.innerHTML = `
    <div class="me-auto p-2">
      <a class="navbar-brand text-light" id="link_inicio" href="./index.html">
      <img class="img-brand" src="./assets/icons/logo.png" alt="Logo" class="d-inline-block align-text-center">
      Inventary System</a>
    </div>
    <div class="p-2">
      <button class="navbar-toggler text-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"><i class="bi bi-list"></i></span>
      </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <div class="d-flex">
              <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link" aria-current="page" id="link_alta" href="./alta.html">Alta</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" aria-current="page" id="link_ingreso" href="./ingreso.html">Ingreso</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" aria-current="page" id="link_consumo" href="./consumo.html">Consumo</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" aria-current="page" id="link_actualizacion" href="./actualizacion.html">Actualización</a>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" role="button" id="link_consultas" data-bs-toggle="dropdown" aria-expanded="false">Consultas</a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" id="link_lotes" href="#">Lotes</a></li>
                    <li><a class="dropdown-item" id="link_movimientos" href="#" target="_blank">Movimientos</a></li>
                    <li><a class="dropdown-item" id="link_stock_lote" href="./lotes.html">Stock por lote</a></li>
                    <li><a class="dropdown-item" id="link_stock_codigo" href="./codigo.html">Stock por código</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>` ;
  let linkActive = document.getElementById(`link_${nameIdModule}`);
  linkActive.classList.add('active')
}
async function loadedResourses(range) {
  let response;
  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });
    let data = response.result.values
    return data
  } catch (e) {
    let code = e.result.error.code
    error_400(code)
  }
}
function validated(event, form) {
  if (form.checkValidity()) {
    event.preventDefault()
  }
  form.classList.add('was-validated')
  return form.checkValidity()
}
function getDate() {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear()
  let today = `${day}/${month}/${year}`;
  return today
}
async function postData(range, data) {
  let response;
  try {
    response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: range,
      includeValuesInResponse: true,
      insertDataOption: "INSERT_ROWS",
      responseDateTimeRenderOption: "FORMATTED_STRING",
      responseValueRenderOption: "FORMATTED_VALUE",
      valueInputOption: "USER_ENTERED",
      resource: {
        majorDimension: "ROWS",
        range: "",
        values: [
          data
        ]
      }
    })
    console.log(response)
    if (response.status == 200) {
      return true
    }
    else { return false }
  } catch (e) {
    console.log(e)
    let code = e.result.error.code
    error_400(code)
  }
}
function error_400(code) {
  if (code.toString().startsWith('4')) {
    alert('Tenemos problemas con la App ❌, Comunicate con el desarrollador')
  }
}
function createdId(data) {
  let id = data.map(item => Number(item[0]));
  id = Math.max(...id) + 1;
  return id
}
function desabledForm(form) {
  var elements = form.elements;
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = true;
  }
}
async function createdData(obj, row, sheet, range) {
  let response = await loadedResourses(range);
  let headers = response.shift();
  for (item in obj) {
    obj[item] = [obj[item], `${sheet}!R${row}C${headers.indexOf(item) + 1}`]
  }
  let data = new Array();
  for (item in obj) {
    data.push({
      majorDimension: "ROWS",
      range: obj[item][1],
      values: [[obj[item][0]]]
    })
  }
  return data
}
async function updateData(data) {
  try {
    let response = await gapi.client.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: {
        data: data,
        includeValuesInResponse: false,
        responseDateTimeRenderOption: "FORMATTED_STRING",
        responseValueRenderOption: "FORMATTED_VALUE",
        valueInputOption: "USER_ENTERED"
      }
    })
    console.log(response)
    if (response.status == 200) {
      return true
    }
    else { return false }
  } catch (e) {
    console.log(e)
  }
}
function reload() {
  setTimeout(() => { location.reload() }, "2000");
}
function badRequest() {
  alert('bad request')
}
function transformData(obj, arr) {
  for (item in obj) {
    if (arr.includes(item)) {
      arr[arr.indexOf(item)] = obj[item]
    }
  }
  return arr
}
function sumarArray(array) {
  return array.reduce((acumulador, elemento) => acumulador + elemento, 0);
}
function convertirMayusculas(event) {
  var texto = event.target.value;
  event.target.value = texto.toUpperCase();
}
function createCSVfile(data,headers) {
data.unshift(headers)
const csvContent = data.map(row => row.join(",")).join("\n");
// Crea un objeto Blob
const blob = new Blob([csvContent], { type: "text/csv" });
// Crea una URL para el Blob
const url = URL.createObjectURL(blob);
// Crea un enlace de descarga
let a = document.querySelector('.link_csv');
a.href = url;

}