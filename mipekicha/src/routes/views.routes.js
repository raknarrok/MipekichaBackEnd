import express from 'express'
import ProductManager from '../controllers/ProductManager.js'
import __dirname from '../utils.js'
import productModel from '../models/product.model.js'
import cartModel from '../models/cart.model.js'

const productManager = new ProductManager('./products.txt')

// Aca vamos a crear las rutas que van a servir las vistas, estas al importarlas en app
// No van a estar precedidas por ningun sufijo
const router = express.Router()


router.get('/', (req, res) => {
  if (res.session?.user) {
    return res.redirect('/profile')
  }

  res.render('login', {})
})

router.get('/login', (req, res) => {
  if(res.session?.user) {
    return res.redirect('/profile')
  }

  res.render('login', {})
})

router.get('/singup', (req, res) => {
  if(req.session?.user) {
    return res.redirect('/profile')
  }
  res.render('register', {})
})

router.get('/profile', auth, (req, res) => {
  const user = req.session.user

  res.render('profile', user)
})

function auth (req, res, next) {
  if(req.session.user) return next()
  res.redirect('/')
}

// router.get('/', async (req, res) => {
router.get('/products', async (req, res) => {

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

  // console.log(toPayload)
  // console.log(allProducts)

  allProducts.prevLink = allProducts.hasPrevPage ? `/?page=${allProducts.prevPage}${baseUrl}` : ''
  allProducts.nextLink = allProducts.hasNextPage ? `/?page=${allProducts.nextPage}${baseUrl}` : ''

  // const allProducts = productManager.getAllProducts() // Esto lo usabamos antes de usar la base de datos
  // const allProducts = await productModel.find().limit(limit).lean().exec()
  // const allProducts = await productModel.find().sort({ _id: sort }).skip(skip).limit(limit).lean().exec()

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
