import Router from 'express'
import CartManager from '../dao/mongoManager/CartManager.js'
import ProductManager from '../dao/mongoManager/ProductManager.js'
import { getAll } from '../dao/controllers/cart.controller.js'

const route = Router()
const cartManager = new CartManager()
const productManager = new ProductManager()

// GET
// route.get('/', async (req, res) => {
//   try {
//     const carts = await cartManager.getAllCarts()
//     if (carts.length === 0) {
//       res.status(404).json({ error: error.message })
//     } else {
//       res.json({ carts })
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

route.get('/', getAll)

route.get('/:cid', async (req, res) => {
  const cartId = req.params.cid
  try {
    const cart = await cartManager.getCartById(cartId)
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
    const cart = await cartManager.addCart()
    res.json({ cart })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.post('/:cid/product/:pid', async (req, res) => {
  try {
    const productId = req.params.pid
    const products = await productManager.getProductById(productId)
    if (products === 0) {
      return res.status(404).json({ error: 'Item Not Found' })
    }
    const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid, req.body)
    res.json({ cart })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

// PUT TODO: Revisar Legacy Code
route.put('/:cid', async (req, res) => {
  try {
    const bodyRequest = req.body
    const cartId = parseInt(req.params.cid)
    const productId = parseInt(req.params.productId)
    const cart = cartManager.addProductToCart(cartId, productId, bodyRequest)
    res.json({ cart })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

route.put('/:cid/product/:pid', async (req, res) => {
  try {
    const productId = req.params.pid
    const products = await productManager.getProductById(productId)
    if (products === 0) {
      return res.status(404).json({ error: 'Item Not Found' })
    }
    const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid, req.body)
    res.json({ cart })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

// DELETE
route.delete('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.removeAllProducts(req.params.cid)
    res.json({ cart })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

route.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await cartManager.removeProduct(req.params.cid, req.params.pid)
    res.json({ cart })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

export default route