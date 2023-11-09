import express from 'express'
import handlerbars from 'express-handlebars'
import __dirname from './utils.js'
import viewsRoutes from './routes/views.routes.js'
import productsRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import sessionRoutes from './routes/session.routes.js'
import ProductManager from './controllers/ProductManager.js'
import CartManager from './controllers/CartManager.js'
import MessageManager from './controllers/MessageManager.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import logger from 'morgan'
import { config } from 'dotenv'
import session from 'express-session'
import MongoStore from 'connect-mongo'
config()

const app = express()
const PORT = process.env.APP_PORT || 8080
const productManager = new ProductManager('./products.txt')
const cartManager = new CartManager('./cart.txt')
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

const mongoUrl = `mongodb+srv://${process.env.APP_MONGO_USER}:${process.env.APP_MONGO_PASSWORD}@${process.env.APP_CLUSTER}.sl91xow.mongodb.net/${process.env.APP_DNNAME}?retryWrites=true&w=majority`

// Session Configuration
app.use(session({
  store: MongoStore.create({
    mongoUrl,
    dbName: process.env.APP_DNNAME,
    ttl: 100
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Usamos las rutas importadas
app.use('/', viewsRoutes)
// app.use('/', viewsRoutes)
app.use('/products', viewsRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/session', sessionRoutes)

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

  socket.on('add-to-cart', data => {

    const requestBody = {
      products: [
        {
          quantity: data.quantity
        }
      ]
    }

    const newCart = cartManager.addProductToCart(data.cartId, data.productId, requestBody)
    io.emit('added-to-cart', newCart)
  })

  socket.on('new-message', message => {
    const newMessage = messageManager.addMessage(message)
    io.emit('message-received', newMessage)
  })

  socket.on('add-cart', () => {
    const newCart = cartManager.addCart()
    io.emit('cart-added', newCart)
  })

  socket.on('clear-cart', clearId => {
    cartManager.removeAllProducts(clearId)
    io.emit('cart-cleared', clearId)
  })

})

mongoose.connect(mongoUrl).then(() => {
  console.log('Conectado a la base de datos')
})
  .catch(error => {
    console.log('Error al conectarse a la base de datos', error)
  })
