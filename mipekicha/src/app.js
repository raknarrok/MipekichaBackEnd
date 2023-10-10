import express from 'express'
import handlerbars from 'express-handlebars'
import __dirname from './utils.js'
import viewsRouter from './routes/views.router.js'
import ProductManager from './controllers/ProductManager.js'

const app = express()
const PORT = 8080
const productManager = new ProductManager('./products.txt')

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

app.get('/api/product/:productId', async (req,res)=>{
    // const prod = await productManager.getProductById()
    const productId = parseInt(req.params.productId)
    const product = await productManager.getProductById(productId)
    res.render('product', {
      products: product
    })
})

// app.use('/', )

const server = app.listen(PORT, ()=>{
    console.log('Servidor activo en puerto 8080')
})

server
