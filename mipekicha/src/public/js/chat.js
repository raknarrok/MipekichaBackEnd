const socket = io()

// Manejar el evento de conexión exitosa
socket.on('connect', () => {
    console.log('Connected to the server - Client')
})
// Manejar el evento de desconexión
socket.on('disconnect', () => {
    console.log('Disconnected from the server - Client')
})

const messageForm = document.getElementById('message-form')
const msgList = document.getElementById('mensaje-list')
const msgInput = document.getElementById('mensaje-input')
const msgButton = document.getElementById('mensaje-send')

const addMessage = (socketId, message) => {
    const listElement = document.createElement('li')
    listElement.textContent = `${socketId}: ${message}`
    msgList.appendChild(listElement)
}

msgButton.addEventListener('click', e => {
    e.preventDefault()
    const message = msgInput.value
    socket.emit('new-message', message)
    addMessage(socket.id, message)
    messageForm.reset()
})