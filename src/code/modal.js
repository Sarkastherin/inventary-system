const modal = `
<div class="modal" tabindex="-1" id="myModalMessage">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" hidden></button>
        </div>
        <div class="modal-body">
          <p></p>
        </div>
      </div>
    </div>
  </div>`
  window.addEventListener('load', loadModal);
  function loadModal() {
    let form = document.querySelector('form')
    const container = document.createElement('div');
    container.innerHTML = modal;
    form.appendChild(container)
  }

  function modalShow(titulo,body){
    var myModalShow = new bootstrap.Modal(document.getElementById('myModalMessage'));
    var titleModal = document.querySelector(`#myModalMessage .modal-title`);
    titleModal.innerText = titulo
    var bodyModal = document.querySelector(`#myModalMessage .modal-body`);
    bodyModal.innerText = body
    myModalShow.show();
  }