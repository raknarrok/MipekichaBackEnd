import Router from 'express'
import CartManager from '../controllers/CartManager.js'
import ProductManager from '../controllers/ProductManager.js'

const route = Router()
const cartManager = new CartManager('./cart.txt')
const productManager = new ProductManager('./products.txt')

// GET
route.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts()
    if (carts.length === 0) {
      res.status(404).json({ error: error.message })
    } else {
      res.json({ carts })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.get('/:cartId', async (req, res) => {
  const cartId = parseInt(req.params.cartId)
  try {
    const cart = cartManager.getAllCarts(cartId)
    if (cart.length === 0) {
      res.status(404).json({ error: 'No existe el carro' })
    } else {
      res.status(200).json({ cart })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST
route.post('/', async (req, res) => {
  try {
    const cart = cartManager.addCart()
    res.json({ cart })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.post('/:cartId/product/:productId', async (req, res) => {
  try {
    const productId = req.params.productId
    const products = await productManager.getProductById(productId)
    if (products === 0) {
      return res.status(404).json({ error: 'Item Not Found' })
    }
    const cart = cartManager.addProductToCart(req.params.cartId, req.params.productId, req.body)
    res.json({ cart })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

// PUT
route.put('/:cartId', async (req, res) => {
  const bodyRequest = req.body
  const cartId = parseInt(req.params.cartId)
  const productId = parseInt(req.params.productId)
  try {
    const cart = cartManager.addProductToCart(cartId, productId, bodyRequest)
    res.json({ cart })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// DELETE
route.delete('/:cartId', (req, res) => {
  try {
    const cart = cartManager.removeAllProducts(req.params.cartId)
    res.json({ cart })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

route.delete('/:cartId/products/:producId', (req, res) => {
  try {
    const cart = cartManager.deleteCart(req.params.cartId)
    res.json({ cart })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

export default route
