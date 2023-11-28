const socket = io()

// Manejar el evento de conexión exitosa
socket.on('connect', () => {
    console.log('Connected to the server - Client')
})
// Manejar el evento de desconexión
socket.on('disconnect', () => {
    console.log('Disconnected from the server - Client')
})

const email = document.getElementById('email')
const captureEmail = document.getElementById('captureEmail')
const msgEmail = document.getElementById('mensaje-email')

captureEmail.addEventListener('click', e => {
    e.preventDefault()
    const emailProvided = email.value
    const updateEmail = document.getElementById('updateEmail')
    document.getElementById('form-email-catch').style.display = 'none'
    document.getElementById('chat-elements').style.display = 'block'
    updateEmail.innerText = emailProvided
    msgEmail.value = emailProvided
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

    const formInputs = Array.from(messageForm.elements)
    const formData = {}
    for (const element of formInputs) {
        formData[element.name] = element.value
    }

    socket.emit('new-message', formData)
    addMessage(socket.id, formData.message)
    msgInput.value = ''
})