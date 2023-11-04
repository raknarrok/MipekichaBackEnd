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

  const limit = parseInt(req.query.limit) || 5
  const page = parseInt(req.query.page) || 1
  const sort = req.query.sort || 'asc'
  const skip = (page - 1) * limit

  // const allProducts = productManager.getAllProducts() // Esto lo usabamos antes de usar la base de datos
  // const allProducts = await productModel.find().limit(limit).lean().exec()
  const allProducts = await productModel.find().sort({ _id: sort }).skip(skip).limit(limit).lean().exec()

  // This is the name under Views > home.handlebars
  res.render('home', {
    isAdmin: false,
    products: allProducts,
  })
})

router.get('/live-products', async (req, res) => {
  // const allProducts = productManager.getAllProducts() // Esto lo usabamos antes de usar la base de datos
  // const allProducts = await productModel.find().limit(limitQuery).lean().exec() // Esto lo usabamos antes de usar paginacion
  const limitQuery = parseInt(req.query.limit) || 5
  const pageQuery = parseInt(req.query.page) || 1
  const allProducts = await productModel.paginate({}, {
    limit: limitQuery,
    page: pageQuery,
    lean: true
  })

  console.log(allProducts)

  allProducts.prevLink = allProducts.hasPrevPage ? `/live-products?page=${allProducts.prevPage}&limit=${limitQuery}` : ''
  allProducts.nextLink = allProducts.hasNextPage ? `/live-products?page=${allProducts.nextPage}&limit=${limitQuery}` : ''

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
  const limit = req.query.limit || 5
  const allCarts = await cartModel.find().limit(limit).lean().exec()
  console.log('CART to be render', allCarts)

  res.render('carts', {
    carts: allCarts,
  })
})

export default router
