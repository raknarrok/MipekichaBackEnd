import express from 'express'
import handlerbars from 'express-handlebars'
import __dirname from './utils.js'
import viewsRoutes from './routes/views.routes.js'
import productsRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import ticketRoutes from './routes/ticket.routes.js'
import sessionRoutes from './routes/session.routes.js'
import ProductManager from './dao/mongoManager/ProductManager.js'
import CartManager from './dao/mongoManager/CartManager.js'
import MessageManager from './dao/mongoManager/MessageManager.js'
import { Server } from 'socket.io'
import logger from 'morgan'
import { config } from 'dotenv'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import MongoSingleton from './database/MongoSingleton.js'
import nodemailer from 'nodemailer'
import twilio from 'twilio'
config()

const app = express()
const PORT = process.env.APP_PORT || 8080
const productManager = new ProductManager()
const cartManager = new CartManager()
const messageManager = new MessageManager()
const mongoInstance = MongoSingleton.getInstance()

// TODO: Implement this in a better way
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const transport = nodemailer.createTransport({
  service: process.env.TWILIO_MAIL_SERVICE,
  port: 587,
  auth:{
    user: process.env.TWILIO_MAIL_ACCOUNT,
    pass: process.env.TWILIO_MAIL_PASSWORD
  }
})

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
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    ttl: 100
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = {...req.session.user}
  }
  next()
})

// Usamos las rutas importadas
app.use('/', viewsRoutes)
app.use('/products', viewsRoutes)
app.use('/api/products', productsRoutes) // DONE
app.use('/api/cart', cartRoutes) // DONE
app.use('/api/ticket', ticketRoutes) // DONE
app.use('/api/session', sessionRoutes)

// TODO: Implement this in a better way
app.get('/mail', async (req, res) => {
  const result = await transport.sendMail({
    from: process.env.TWILIO_MAIL_ACCOUNT,
    to: 'raknarrok@hotmail.com',
    subject: 'Prueba de mail',
    html:`
    <div>
      <h1>Prueba de mail</h1>
      <p>Esto es una prueba</p>
    </div>`,
    attachments: []
  })
  console.log(result)
  res.send('email sent my friend')
})

// TODO: Implement this in a better way
// NOT USED JUST EXAMPLE IMPLEMENTATION
app.get('/sms', async (req, res) => {
  const result = await client.messages.create({
    to: '+528112256837',
    from: process.env.TWILIO_SMS_NUMBER,
    body: 'Hola, esto es una prueba de SMS'
  })
  console.log(result)
  res.send('sms sent my friend')
})

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