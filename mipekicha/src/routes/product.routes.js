import Router from 'express'
import ProductManager from '../controllers/ProductManager.js'

const ProductManagerRouter = Router()
const productManager = new ProductManager()

// GET
ProductManagerRouter.get('/api/products', async (req, res) => {
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

ProductManagerRouter.get('/api/products/:productId', async (req, res) => {
  const productId = parseInt(req.params.productId)
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

ProductManagerRouter.get('/api/products/code/:productCode', async (req, res) => {
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
ProductManagerRouter.post('/api/products', (req, res) => {
  try {
    const product = productManager.addProduct(req.body)
    res.status(200).json({ product })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// PUT
ProductManagerRouter.put('/api/products/:productId', async (req, res) => {
  const productId = parseInt(req.params.productId)
  try {
    const product = productManager.updateProductById(productId, req.body)
    res.status(200).json({ product })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// DELETE
ProductManagerRouter.delete('/api/products/:productId', async (req, res) => {
  const productId = parseInt(req.params.productId)
  try {
    const product = productManager.removeProductById(productId)
    res.status(200).json({ product })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})


export default ProductManagerRouter