import express from 'express'
import handlerbars from 'express-handlebars'
import __dirname from './utils.js'
import viewsRouter from './routes/views.router.js'
import productRouter from './routes/product.routes.js'
import ProductManager from './controllers/ProductManager.js'
import { Server } from 'socket.io'
import logger from 'morgan'

const app = express()
const PORT = 8080
const productManager = new ProductManager('./products.txt')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended:true }))

// Handlebars configuration
app.engine('handlebars', handlerbars.engine())
app.set('view engine','handlebars') // Extencion of these files
app.set('views', __dirname+'/views') // Indicate the folder where the files are

// Static files configuration
app.use(express.static(__dirname+'public'))

app.get('/', async (req,res)=>{
    const allProducts = await productManager.getAllProducts()
    res.render('home', {
      products: allProducts
    })
})

app.get('/chat', (req,res)=>{
  res.render('chat')
})

app.get('/realTimeProducts', async (req,res)=>{
  const allProducts = await productManager.getAllProducts()
  res.render('realTimeProducts',
  {
    products: allProducts
  })
})

app.post('/products', async (req,res)=>{
  const newProduct = req.body
  productManager.addProduct(newProduct)
  res.redirect('/')
})

app.get('/api/product/:productId', async (req,res)=>{
    // const prod = await productManager.getProductById()
    const productId = parseInt(req.params.productId)
    const product = await productManager.getProductById(productId)
    res.render('product', {
      products: product
    })
})

const httpServer = app.listen(PORT, ()=>{
    console.log(`Servidor activo en puerto ${PORT }`)
})

// Sent Http Server to Socket.io
const io = new Server(httpServer)

io.on('connection', (socket) => {
  console.log('new client - Server')
  const messagesText = []

  if (messagesText.length > 0) {
    socket.emit('newMessage', messagesText)
  }
  // socket.emit('newMessage', messagesText)

  socket.on('newMessage', (txtMessage) => {
    messagesText.push(txtMessage)
    io.sockets.emit('newMessage', messagesText)
  })

  socket.on('newProduct', (product) => {
    io.sockets.emit('newProduct', product)
    productManager.addProduct(product)
    console.log('newProduct its -> ', product)
  })

  socket.on('enviarMensaje', (data) => {
    console.log('Enviar Mensaje', data)
  })

  socket.on('disconnect', () => {
    console.log('client disconnected - Server')
  })
})
