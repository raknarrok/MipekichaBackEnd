import Router from 'express'
import CartManager from '../controllers/CartManager.js'
import ProductManager from '../controllers/ProductManager.js'

const CartRoutes = Router()
const cartManager = new CartManager('./cart.txt')
const productManager = new ProductManager('./products.txt')

// GET
CartRoutes.get('/api/cart/:cartId', async (req, res) => {
  const cartId = parseInt(req.params.cartId)
  try {
    const cart = cartManager.getCartById(cartId)
    if (cart.length === 0) {
      res.status(404).json({ error: 'No existe el carro' })
    } else {
      res.status(200).json({ cart })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

CartRoutes.post('/api/cart', async (req, res) => {
  try {
    const cart = cartManager.addCart()
    res.json({ cart })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

CartRoutes.post('/api/cart/:cartId/product/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
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

CartRoutes.delete('/api/cart/:cartId', (req, res) => {
  try {
    const cart = cartManager.deleteCart(req.params.cartId)
    res.json({ cart })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

export default CartRoutes
