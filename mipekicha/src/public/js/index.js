const socket = io()

// Manejar el evento de conexión exitosa
socket.on('connect', () => {
  console.log('Connected to the server - Client')
})
// Manejar el evento de desconexión
socket.on('disconnect', () => {
  console.log('Disconnected from the server - Client')
})

// Capturamos los elementos del HTML
const productForm = document.getElementById('product-form')
const productsTable = document.getElementById('live-products-table')

// Agregamos un evento al formulario, especificamente cuando hacemos submit
productForm.addEventListener('submit', e => {
  // Previene el comportamiento por default del formulario, es decir no queremos que haga un POST
  // A la ruta ni al metodo configurado en el HTML
  e.preventDefault()

  // Extraemos los elementos del formulario, recorremos estos y creamos un objeto
  // El cual vamos a enviar a traves del socket
  const formInputs = Array.from(productForm.elements)
  const formData = {}
  for (const element of formInputs) {
    formData[element.name] = element.value
  }

  socket.emit('add-product', formData)
  productForm.reset()
  location.reload()
})

// "Escuchamos" el evento que se emite cuando se crea correctamente el nuevo producto
socket.on('product-added', product => {
  // Agregamos una nueva row a la tabla en la ultima posicion, indice negativo
  let row = productsTable.insertRow(-1)

  // Creamos un array a partir del objeto enviado desde el backend
  // Insertamos en la tabla el nuevo elemento
  Object.values(product).forEach((value, index) => {
    let cell = row.insertCell(index)
    cell.innerText = value
  })
})

document.querySelectorAll('.delete-button').forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault()

    const deleteCode = e.target.value

    socket.emit('delete-product', deleteCode)
    location.reload()
  })
})
