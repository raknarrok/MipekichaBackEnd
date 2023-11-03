const socket = io()

// Manejar el evento de conexión exitosa
socket.on('connect', () => {
    console.log('Connected to the server - Client')
})
// Manejar el evento de desconexión
socket.on('disconnect', () => {
    console.log('Disconnected from the server - Client')
})

const cartForm = document.getElementById('cart-form')

// Crear un Carrito
cartForm.addEventListener('submit', e => {
    e.preventDefault()

    socket.emit('add-cart')
    cartForm.reset()
    location.reload()
})

document.querySelectorAll('.clear-button').forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault()

        const clearId = e.target.value

        socket.emit('clear-cart', clearId)
        location.reload()
    })
})