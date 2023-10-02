/*
Go to cd mipekicha/src
Run node app.js
*/
const express = require('express')
const app = express()
const PORT = 8080
const ProductManager = require('./ProductManager')
const productManager = new ProductManager('./products.txt')

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await productManager.getProducts(req.query.limit)
    if (products.length === 0) {
      res.status(404).json({ error: 'No hay productos cargados' })
    } else {
      res.json({ products })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/products/:productId', async (req, res) => {
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

app.get('/api/products/code/:productCode', async (req, res) => {
  const productCode = req.params.productCode
  try {
    const products = await productManager.getProductByCode(productCode)
    if (products === 0) {
      res.status(404).json({ error: 'Item Not Found' })
    } else {
      res.json({ products })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/products', (req, res) => {
  try {
    const product = productManager.addProduct(req.body)
    res.json({ product })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/products/:productId', async (req, res) => {
  const productId = parseInt(req.params.productId)
  try {
    const product = await productManager.updateProductById(productId, req.body)
    res.json({ product })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/products/:productId', async (req, res) => {
  const productId = parseInt(req.params.productId)
  try {
    const product = productManager.removeProductById(productId)
    res.json({ product })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


server.on('error', (error) => {
  console.log(`Error: ${error}`)
})
