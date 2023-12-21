import express from 'express'
import __dirname from '../utils.js'
import { cartService } from '../services/index.js'
import productModel from '../dao/mongo/models/product.model.js'
import cartModel from '../dao/mongo/models/cart.model.js'
import passport from 'passport'

// Aca vamos a crear las rutas que van a servir las vistas, estas al importarlas en app
// No van a estar precedidas por ningun sufijo
const router = express.Router()

router.get('/', async (req, res) => {

  try {
    // This is the name under Views > home.handlebars
    res.render('home', {
      isAdmin: false,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Error', error: 'An error occurred while getting server response' })
  }
})

// PRODUCTS
router.get('/products', auth, async (req, res) => {

  try {

    const userRole = req.session.user.role

    // TODO: Create a better way to handle this
    if (userRole !== 'user') {
      return res.status(403).send({ status: 'Error', error: 'You are not allowed to access this resource' })
    }
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

    const user = req.session.user

    // This is the name under Views > home.handlebars
    res.render('products', {
      products: toPayload,
      cartId: user.cart,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Error', error: 'An error occurred while getting products' + error })
  }
})

router.get('/live-products', auth, async (req, res) => {

  try {
    const userRole = req.session.user.role

    // TODO: Create a better way to handle this
    if (userRole !== 'admin') {
      return res.status(403).send({ status: 'Error', error: 'You are not allowed to access this resource' })
    }
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
      isAdmin: userRole === 'admin' ? true : false,
      products: toPayload,
    })

  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Error', error: 'An error occurred while getting products' })
  }
})

// CHAT
router.get('/chat', async (req, res) => {
  const userRole = req.session.user.role

  // TODO: Create a better way to handle this
  // TODO: Add try catch
  if (userRole !== 'user') {
    return res.status(403).send({ status: 'Error', error: 'You are not allowed to access this resource' })
  }
  res.render('chat', {
  })
})

// CARTS
router.get('/cart', auth, async (req, res) => {

  try {
    const userRole = req.session.user.role

    // TODO: Create a better way to handle this
    if (userRole !== 'user') {
      return res.status(403).send({ status: 'Error', error: 'You are not allowed to access this resource' })
    }
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

router.get('/cart/:cid', auth, async (req, res) => {

  try {
    const userRole = req.session.user.role

    // TODO: Create a better way to handle this
    if (userRole !== 'user') {
      return res.status(403).send({ status: 'Error', error: 'You are not allowed to access this resource' })
    }
    const cartId = req.params.cid
    const cartDetailPopulated = await cartService.retrieveCartById(cartId)

    res.render('cartdetails', {
      cart: cartDetailPopulated
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Error', error: 'An error occurred while getting carts' })
  }
})

router.get('/cart/:cid/purchase', auth, async (req, res) => {

  try {
    const userRole = req.session.user.role

    if (userRole !== 'user') {
      return res.status(403).send({ status: 'Error', error: 'You are not allowed to access this resource' })
    }

    const cartId = req.params.cid
    const cartDetailPopulated = await cartService.retrieveCartById(cartId)

    // TODO: Proceed with purchase logic

    res.render('purchase', {
      cart: cartDetailPopulated
    })

  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Error', error: 'An error occurred while getting details from ticket/carts' })
  }
})

// Login & Logout
router.get('/login', (req, res) => {
  // TODO: Add try catch
  if (req.session?.user) {
    return res.redirect('/')
  }

  res.render('login', {})
})

router.get('/singup', (req, res) => {
  // TODO: Add try catch
  if (req.session?.user) {
    return res.redirect('/profile')
  }
  res.render('register', {})
})

router.get('/profile', auth, (req, res) => {
  // TODO: Add try catch
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
    // TODO: Add try catch
    console.log('Callback', req.user)
    req.session.user = req.user

    console.log(req.session)
    res.redirect('/')
  })

router.get('/logout', async (req, res) => {
  // TODO: Add try catch
  req.session.destroy(err => {
    if (err) return res.send('Logout error')

    res.redirect('/login')
  })
})

function auth(req, res, next) {
  // TODO: Add try catch
  if (req.session.user) return next()
  res.status(401)
  return res.redirect('/login')
}

function getQueryParam(param, defaultValue) {
  // TODO: Add try catch
  return parseInt(param) || defaultValue
}

export default router