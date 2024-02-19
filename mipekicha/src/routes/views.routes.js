import express from 'express'
import __dirname from '../utils.js'
import { cartService, productService, ticketService } from '../services/index.js'
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

    const userOwner = req.session.user._id
    const userRole = req.session.user.role

    // TODO: Create a better way to handle this
    if (userRole !== 'user' && userRole !== 'premium') {
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
    console.log('payload product', toPayload)

    // This is the name under Views > home.handlebars
    res.render('products', {
      products: toPayload,
      owner: userOwner,
      cartId: user.cart,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Error', error: 'An error occurred while getting products' + error })
  }
})

router.get('/live-products', auth, async (req, res) => {

  try {
    const userOwner = req.session.user._id
    const userRole = req.session.user.role

    // TODO: Create a better way to handle this
    if (userRole !== 'admin' && userRole !== 'premium') {
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
      owner: userOwner,
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
    if (userRole !== 'user' && userRole !== 'premium') {
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
    let cartDetailPopulated = await cartService.retrieveCartById(cartId)

    if (cartDetailPopulated.products.length === 0) {
      return res.status(400).send({ status: 'Error', error: 'You cannot purchase an empty cart' })
    }

    // 1.- Verify stock availability
    let totalAmount = 0
    for (const product of cartDetailPopulated.products) {

      let productDetail = await productService.retrieveProductById(product.product)

      if (productDetail.stock < product.quantity) {
        continue
      }

      // 2.- Update the product stock
      const newStock = productDetail.stock - product.quantity
      await productService.updateProduct(product.product, { stock: newStock })
      totalAmount += productDetail.price * product.quantity

      await cartService.removeProduct(cartId, product.product)
    }

    if (totalAmount === 0) {
      return res.status(400).send({ status: 'Error', error: 'There is not enough stock to complete the purchase' })
    }

    cartDetailPopulated = await cartService.retrieveCartById(cartId)

    const ticketCreated = await ticketService.addTicket({
      email: req.session.user.email,
      total: totalAmount
    })

    const ticketDetails = await ticketService.retrieveTicketById(ticketCreated._id)

    res.render('purchase', {
      cart: cartDetailPopulated,
      ticket: ticketDetails
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

router.get('/restore-password', (req, res) => {

  if (req.session?.user) {
    return res.redirect('/profile')
  }

  res.render('restore-password', {})
})

router.get('/token', (req, res) => {
  res.render('token')
})

router.get('/update-password', (req, res) => {
  console.log('We are on views section')
  res.render('update-password')
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