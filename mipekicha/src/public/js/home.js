const socket = io()

// Manejar el evento de conexión exitosa
socket.on('connect', () => {
    console.log('Connected to the server - Client')
})
// Manejar el evento de desconexión
socket.on('disconnect', () => {
    console.log('Disconnected from the server - Client')
})

const productForm = document.getElementById('"product-add-form')

document.querySelectorAll('.add-button').forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault()

        const productId = e.target.value

        const productToAdd = {
            cartId: '6566aa7eb289c5923d922315', // TODO: Change this to the actual cartId
            productId: productId,
            quantity: 1
        }

        socket.emit('add-to-cart', productToAdd)
        location.reload()
    })
})