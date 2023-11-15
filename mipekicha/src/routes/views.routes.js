import express from 'express'
/* import ProductManager from '../controllers/ProductManager.js'*/
import ProductManager from '../dao/mongoManager/ProductManager.js'
import __dirname from '../utils.js'
import productModel from '../dao/models/product.model.js'
import cartModel from '../dao/models/cart.model.js'

const productManager = new ProductManager('./products.txt')

// Aca vamos a crear las rutas que van a servir las vistas, estas al importarlas en app
// No van a estar precedidas por ningun sufijo
const router = express.Router()

router.get('/', async (req, res) => {

  const limitQuery = parseInt(req.query.limit) || 5
  const pageQuery = parseInt(req.query.page) || 1
  const sort = req.query.sort || 'asc'
  const sortField = req.query.sortField || '_id'
  const allProducts = await productModel.paginate({}, {
    limit: limitQuery,
    page: pageQuery,
    sort: { [sortField]: sort },
    lean: true
  })

  const baseUrl = `&limit=${limitQuery}&sort=${sort}&sortField=${sortField}`
  const toPayload = {
    status: 'success',
    payload: allProducts.docs,
    ...allProducts,
    prevLink: allProducts.hasPrevPage ? `/?page=${allProducts.prevPage}${baseUrl}` : '',
    nextLink: allProducts.hasNextPage ? `/?page=${allProducts.nextPage}${baseUrl}` : '',
  }

  delete toPayload.docs

  allProducts.prevLink = allProducts.hasPrevPage ? `/?page=${allProducts.prevPage}${baseUrl}` : ''
  allProducts.nextLink = allProducts.hasNextPage ? `/?page=${allProducts.nextPage}${baseUrl}` : ''

  // This is the name under Views > home.handlebars
  res.render('home', {
    isAdmin: false,
    products: allProducts,
  })
})

router.get('/live-products', async (req, res) => {
  const limitQuery = parseInt(req.query.limit) || 5
  const pageQuery = parseInt(req.query.page) || 1
  const sort = req.query.sort || 'asc'
  const sortField = req.query.sortField || '_id'
  const allProducts = await productModel.paginate({}, {
    limit: limitQuery,
    page: pageQuery,
    sort: { [sortField]: sort },
    lean: true
  })

  const baseUrl = `&limit=${limitQuery}&sort=${sort}&sortField=${sortField}`
  const toPayload = {
    status: 'success',
    payload: allProducts.docs,
    ...allProducts,
    prevLink: allProducts.hasPrevPage ? `/live-products?page=${allProducts.prevPage}${baseUrl}` : '',
    nextLink: allProducts.hasNextPage ? `/live-products?page=${allProducts.nextPage}${baseUrl}` : '',
  }

  delete toPayload.docs

  allProducts.prevLink = allProducts.hasPrevPage ? `/live-products?page=${allProducts.prevPage}${baseUrl}` : ''
  allProducts.nextLink = allProducts.hasNextPage ? `/live-products?page=${allProducts.nextPage}${baseUrl}` : ''

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
  const limitQuery = parseInt(req.query.limit) || 5
  const pageQuery = parseInt(req.query.page) || 1
  const sort = req.query.sort || 'asc'
  const sortField = req.query.sortField || '_id'

  const baseUrl = `&limit=${limitQuery}&sort=${sort}&sortField=${sortField}`
  const allCarts = await cartModel.paginate({}, {
    limit: limitQuery,
    page: pageQuery,
    sort: { [sortField]: sort },
    lean: true
  })

  allCarts.prevLink = allCarts.hasPrevPage ? `/cart?page=${allCarts.prevPage}${baseUrl}` : ''
  allCarts.nextLink = allCarts.hasNextPage ? `/cart?page=${allCarts.nextPage}${baseUrl}` : ''

  res.render('carts', {
    carts: allCarts,
  })
})

router.get('/cart/:cartId', async (req, res) => {

  const cartId = req.params.cartId
  const cartDetailPopulated = await cartModel.findOne({ _id: cartId }).populate('products.product').lean().exec()

  res.render('cartdetails', {
    cart: cartDetailPopulated,
  })
})

export default router
