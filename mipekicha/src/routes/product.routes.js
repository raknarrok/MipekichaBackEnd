import { Router } from 'express'
import ProductManager from '../dao/mongoManager/ProductManager.js'

const route = Router()
const productManager = new ProductManager('./products.txt')

// ESTAS RUTAS VAN A ESTAR PRECEDIDAS POR /api/products
// ESTO LO DEFINIMOS EN APP EN LA LINEA 26
// app.use('/api/products', productsRoutes)

// GET
route.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts(req.query.limit)
    if (products.length === 0) {
      res.status(404).json({ error: error.message })
    } else {
      res.json({ products })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.get('/:pid', async (req, res) => {
  const productId = req.params.pid
  try {
    const products = await productManager.getProductById(productId)
    if (products === 0) {
      res.status(404).json({ error: 'Item Not Found' })
    } else {
      res.json({ products })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

route.get('/code/:productCode', async (req, res) => {
  const productCode = req.params.productCode
  try {
    const products = await productManager.getProductByCode(productCode)
    if (products === 0) {
      res.status(404).json({ error: 'Item Not Found' })
    } else {
      res.json({ products })
    }
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

// POST
route.post('/', async (req, res) => {
  try {
    const product = await productManager.addProduct(req.body)
    res.status(200).json({ product })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// PUT
route.put('/:pid', async (req, res) => {
  const productId = req.params.pid
  console.log('Product ID: ', productId)
  try {
    const product = await productManager.updateProductById(productId, req.body)
    res.status(200).json({ product })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// DELETE
route.delete('/:pid', async (req, res) => {
  const productId = req.params.pid
  try {
    const product = await productManager.removeProductById(productId)
    res.status(200).json({ product })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default route