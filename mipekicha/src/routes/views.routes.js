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
    const prevLink = allProducts.hasPrevPage ? `/?page=${allProducts.prevPage}${baseUrl}` : null
    const nextLink = allProducts.hasNextPage ? `/?page=${allProducts.nextPage}${baseUrl}` : null

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

    console.log(toPayload)

    // This is the name under Views > home.handlebars
    res.render('home', {
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

    console.log(toPayload)

    res.render('realTimeProducts', {
      isAdmin: false,
      products: toPayload,
    })

  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Error', error: 'An error occurred while getting products' })
  }
})

router.get('/chat', async (req, res) => {
  res.render('chat', {
    isAdmin: false,
  })
})

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

    console.log(toPayload)

    res.render('carts', {
      carts: toPayload,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Error', error: 'An error occurred while getting carts' })
  }
})

router.get('/cart/:cartId', async (req, res) => {

  const cartId = req.params.cartId
  const cartDetailPopulated = await cartModel.findOne({ _id: cartId }).populate('products.product').lean().exec()

  res.render('cartdetails', {
    cart: cartDetailPopulated,
  })
})

function getQueryParam(param, defaultValue) {
  return parseInt(param) || defaultValue
}

export default router
