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

  app.get('/api/products/:pdi', async (req, res) => {
    const pdi = parseInt(req.params.pdi)
    try {
      const products = await productManager.getProductById(pdi)
      if (products === 0) {
        res.status(404).json({ error: 'Item Not Found' })
      } else {
        res.json({ products })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  server.on('error', (error) => {
    console.log(`Error: ${error}`)
  })
