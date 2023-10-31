import express from 'express'
import handlerbars from 'express-handlebars'
import __dirname from './utils.js'
import viewsRoutes from './routes/views.routes.js'
import productsRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import ProductManager from './controllers/ProductManager.js'
import MessageManager from './controllers/MessageManager.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import logger from 'morgan'

const app = express()
const PORT = 8080
const productManager = new ProductManager('./products.txt')
const messageManager = new MessageManager()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Handlebars configuration
app.engine('handlebars', handlerbars.engine())
app.set('view engine', 'handlebars') // Extencion of these files
app.set('views', __dirname + '/views') // Indicate the folder where the files are

// Static files configuration
app.use(express.static(__dirname + '/public'))

// Usamos las rutas importadas
app.use('/', viewsRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/cart', cartRoutes)

const httpServer = app.listen(PORT, () => {
  console.log('Servidor activo en puerto ' + PORT)
})

//Socket
const io = new Server(httpServer)
io.on('connection', socket => {
  console.log('Cliente conectado')
  socket.on('disconnect', () => {
    console.log('Un usuario se desconectó')
  })

  // Aca capturamos el emit que hicimos en el frontend, algo asi como que
  // "escuchamos" ese evento
  socket.on('add-product', data => {
    // Agregamos el producto enviado desde el frontend
    const newProduct = productManager.addProduct(data)

    // Emitimos un evento, esta vez desde el backend y enviamos el producto nuevo que se creo
    io.emit('product-added', newProduct)
  })

  socket.on('delete-product', productCode => {
    productManager.removeProductByCode(productCode)
    io.emit('product-deleted', productCode)
  })

  socket.on('new-message', message => {

    messageManager.addMessage(message)

    io.emit('message-received', message)
  })
})

mongoose.connect('mongodb://localhost:27017/ecommerce', {}).then(() => {
  console.log('Conectado a la base de datos')
})
  .catch(error => {
    console.log('Error al conectarse a la base de datos', error)
  })