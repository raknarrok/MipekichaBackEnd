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
        const cartId = document.getElementById('cartId')

        const productToAdd = {
            cartId: cartId.getAttribute('value'), // TODO: Find a beter way to get the cartId
            productId: productId,
            quantity: 1
        }

        socket.emit('add-to-cart', productToAdd)
        location.reload()
    })
})