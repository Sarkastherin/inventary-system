# Gestión de stock
## Características
### Alta
 - El campo proveedor se deplega una lista la cual es cargada desde la tabla "Proveedores". Funciona para asignar un número de lote a la chapa ingresada
 - Al ingresar el codigo del producto, lo busca en la  base, validando que el codigo existe y trae la descripción del producto, de esta manera tambien el operario puede controlar si el codigo ingresado pertenece al producto al que dará de alta.
 - El campo de "Nombre operario", tambíen es cargado desde la tabla "Operarios".
 - En la parte inferior, se carga una tabla que muestra los ultimos 10 lotes creados.
 ### Ingreso
 - En el desplegable en el campo "Lote" se muestran los que se hayan dado de alta (paso anterior) y aún no han sido ingresados.
 - Al seleccionar el lote, busca la información previamnete cargada en el "Alta" (código, nombre del producto, ancho y largo acordado), con estos datos el operario controla el material.
 - Al final de la app se carga una tabla que muestra los lotes por ingresar.
 ### Consumo
 - En el campo "Lote" se desplegan los lotes con cantidades positivas.
 - Al ingresar el lote se carga la cantidad en existencia (cant. a mano), el código y descripción del producto.
 ### Actualización
 - Muy parecido al "Consumo", pero en esta ocación se muestran TODOS los lotes alguna vez cargados, por medio de un datalist, con la intención que se pueda corregir/actualizar la cantidad de estock de cualquier lote.
 - Se muestra la cantidad que figura ene l sistema, y se debe cargar la cantidad real.
 ### Consultas
 - Hay dos formas de consultas, según la necesidad del proyecto, por lote y por codigo.
 - Tiene funciones de filtrado (por codigo, lote y espesor)
 - Cuenta con un boton para descargar en formato .csv la información.
