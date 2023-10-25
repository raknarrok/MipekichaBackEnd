import express from 'express'
import handlerbars from 'express-handlebars'
import __dirname from './utils.js'
import viewsRoutes from './routes/views.routes.js'
import productsRoutes from './routes/product.routes.js'
import ProductManager from './controllers/ProductManager.js'
import { Server } from 'socket.io'

const app = express()
const PORT = 8080
const productManager = new ProductManager('./products.txt')

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

    socket.on('delete-product', productId => {
        productManager.deleteProduct(productId)
        io.emit('product-deleted', productId)
    })
})
