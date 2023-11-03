import express from 'express'
import ProductManager from '../controllers/ProductManager.js'
import __dirname from '../utils.js'
import productModel from '../models/product.model.js'
import cartModel from '../models/cart.model.js'

const productManager = new ProductManager('./products.txt')

// Aca vamos a crear las rutas que van a servir las vistas, estas al importarlas en app
// No van a estar precedidas por ningun sufijo
const router = express.Router()

router.get('/', async (req, res) => {

  // const allProducts = productManager.getAllProducts() // Esto lo usabamos antes de usar la base de datos
  const allProducts = await productModel.find().lean().exec()

  // This is the name under Views > home.handlebars
  res.render('home', {
    isAdmin: false,
    products: allProducts,
  })
})

router.get('/live-products', async (req, res) => {
  // const allProducts = productManager.getAllProducts() // Esto lo usabamos antes de usar la base de datos
  const allProducts = await productModel.find().lean().exec()

  res.render('realTimeProducts', {
    isAdmin: false,
    products: allProducts,
  })
})

router.get('/chat', async (req, res) => {
  res.render('chat', {
    isAdmin: false,
  })
})

router.get('/cart', async (req, res) => {
  const allCarts = await cartModel.find().lean().exec()
  console.log('CART to be render', allCarts)

  res.render('carts', {
    carts: allCarts,
  })
})

export default router
