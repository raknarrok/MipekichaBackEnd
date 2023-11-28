import express from 'express'
import __dirname from '../utils.js'
import ProductManager from '../dao/mongoManager/ProductManager.js'
import productModel from '../dao/models/product.model.js'
import cartModel from '../dao/models/cart.model.js'
import passport from 'passport'

const productManager = new ProductManager('./products.txt')

// Aca vamos a crear las rutas que van a servir las vistas, estas al importarlas en app
// No van a estar precedidas por ningun sufijo
const router = express.Router()

router.get('/', async (req, res) => {

  try {
    // This is the name under Views > home.handlebars
    res.render('home', {
      isAdmin: false
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Error', error: 'An error occurred while getting products' })
  }
})

// PRODUCTS
router.get('/products', async (req, res) => {

  try {
    const limitQuery = getQueryParam(req.query.limit, 5)
    const pageQuery = getQueryParam(req.query.page, 1)
    const sort = req.query.sort || 'asc'
    const sortField = req.query.sortField || '_id'

    const allProducts = await productModel.paginate({}, {
      limit: limitQuery,
      page: pageQuery,
      sort: { [sortField]: sort },
      lean: true
    })

    const baseUrl = `&limit=${limitQuery}&sort=${sort}&sortField=${sortField}`
    const prevLink = allProducts.hasPrevPage ? `/products?page=${allProducts.prevPage}${baseUrl}` : null
    const nextLink = allProducts.hasNextPage ? `/products?page=${allProducts.nextPage}${baseUrl}` : null

    const toPayload = {
      status: allProducts.docs.length > 0 ? 'success' : 'error',
      payload: allProducts.docs,
      ...allProducts,
      prevLink: prevLink,
      nextLink: nextLink
    }

    delete toPayload.docs
    delete toPayload.limit
    delete toPayload.pagingCounter

    // This is the name under Views > home.handlebars
    res.render('products', {
      isAdmin: false,
      products: toPayload,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Error', error: 'An error occurred while getting products' })
  }
})

router.get('/live-products', async (req, res) => {

  try {
    const limitQuery = getQueryParam(req.query.limit, 5)
    const pageQuery = getQueryParam(req.query.page, 1)
    const sort = req.query.sort || 'asc'
    const sortField = req.query.sortField || '_id'

    const allProducts = await productModel.paginate({}, {
      limit: limitQuery,
      page: pageQuery,
      sort: { [sortField]: sort },
      lean: true
    })

    const baseUrl = `&limit=${limitQuery}&sort=${sort}&sortField=${sortField}`
    const prevLink = allProducts.hasPrevPage ? `/live-products?page=${allProducts.prevPage}${baseUrl}` : null
    const nextLink = allProducts.hasNextPage ? `/live-products?page=${allProducts.nextPage}${baseUrl}` : null

    const toPayload = {
      status: allProducts.docs.length > 0 ? 'success' : 'error',
      payload: allProducts.docs,
      ...allProducts,
      prevLink: prevLink,
      nextLink: nextLink
    }

    delete toPayload.docs
    delete toPayload.limit
    delete toPayload.pagingCounter

    res.render('realTimeProducts', {
      isAdmin: false,
      products: toPayload,
    })

  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Error', error: 'An error occurred while getting products' })
  }
})

// CHAT
router.get('/chat', async (req, res) => {
  res.render('chat', {
    isAdmin: false,
  })
})

// CARTS
router.get('/cart', async (req, res) => {

  try {
    const limitQuery = getQueryParam(req.query.limit, 5)
    const pageQuery = getQueryParam(req.query.page, 1)
    const sort = req.query.sort || 'asc'
    const sortField = req.query.sortField || '_id'

    const allCarts = await cartModel.paginate({}, {
      limit: limitQuery,
      page: pageQuery,
      sort: { [sortField]: sort },
      lean: true
    })

    const baseUrl = `&limit=${limitQuery}&sort=${sort}&sortField=${sortField}`
    const prevLink = allCarts.hasPrevPage ? `/cart?page=${allCarts.prevPage}${baseUrl}` : null
    const nextLink = allCarts.hasNextPage ? `/cart?page=${allCarts.nextPage}${baseUrl}` : null

    const toPayload = {
      status: allCarts.docs.length > 0 ? 'success' : 'error',
      payload: allCarts.docs,
      ...allCarts,
      prevLink: prevLink,
      nextLink: nextLink
    }

    delete toPayload.docs
    delete toPayload.limit
    delete toPayload.pagingCounter

    res.render('carts', {
      carts: toPayload,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Error', error: 'An error occurred while getting carts' })
  }
})

router.get('/cart/:cid', async (req, res) => {

  const cartId = req.params.cid
  const cartDetailPopulated = await cartModel.findOne({ _id: cartId }).populate('products.product').lean().exec()

  res.render('cartdetails', {
    cart: cartDetailPopulated,
  })
})

// Login & Logout
router.get('/login', (req, res) => {
  if (req.session?.user) {
    return res.redirect('/products')
  }

  res.render('login', {})
})

router.get('/singup', (req, res) => {
  if (req.session?.user) {
    return res.redirect('/profile')
  }
  res.render('register', {})
})

router.get('/profile', auth, (req, res) => {
  const user = req.session.user
  return res.render('profile', user)
})

router.get(
  '/login-github',
  passport.authenticate('github', { scope: ['profile', 'email'] }),
  async (req, res) => { }
)

router.get(
  '/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    console.log('Callback', req.user)
    req.session.user = req.user

    console.log(req.session)
    res.redirect('/')
  })

router.get('/logout', async (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send('Logout error')

    res.redirect('/login')
  })
})

function auth(req, res, next) {
  if (req.session.user) return next()
  res.status(401)
  return res.redirect('/login')
}

function getQueryParam(param, defaultValue) {
  return parseInt(param) || defaultValue
}

export default router