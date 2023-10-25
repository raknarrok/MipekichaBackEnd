import express from 'express'
import ProductManager from '../controllers/ProductManager.js'
import __dirname from '../utils.js'
const productManager = new ProductManager('./products.txt')

// Aca vamos a crear las rutas que van a servir las vistas, estas al importarlas en app
// No van a estar precedidas por ningun sufijo
const router = express.Router()

router.get('/', (req, res) => {
  const allProducts = productManager.getAllProducts()

  // This is the name under Views > home.handlebars
  res.render('home', {
    isAdmin: false,
    products: allProducts,
  })
})

router.get('/live-products', (req, res) => {
  const allProducts = productManager.getAllProducts()

  res.render('realTimeProducts', {
    isAdmin: false,
    products: allProducts,
  })
})

export default router