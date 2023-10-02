/*
Go to cd src
Run node app.js
*/

const fs = require('fs')

class CartManager {
  constructor (filePath) {
    this.cartIdCounter = 1
    this.filePath = filePath
    this.carts = this.checkFile()
  }

  addCart (bodyRequest) {
    const { products } = bodyRequest
    console.log(bodyRequest)

    if (!products || !Array.isArray(products) || products.length === 0) {
      console.error('Hey!!! The request body must contain a valid "products" array with product objects.')
      return
    }

    const maxId = this.carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0)
    this.cartIdCounter = maxId + 1
    const fileContent = this.checkFile()
    console.log(fileContent)

    if (fileContent) {
      const existingCart = this.carts.find((cart) => cart.id === this.cartIdCounter)
      if (existingCart) {
        // Add The product to existing cart
        existingCart.products.push(...products)
      } else {
        // Create New Cart
        const cart = {
          id: this.cartIdCounter,
          products
        }
        this.carts.push(cart)
        this.cartIdCounter++
      }
      this.saveFile()
    } else {
      const cart = {
        id: this.cartIdCounter,
        products
      }
      console.log(cart)
      this.carts.push(cart)
      this.cartIdCounter++
      this.saveFile()
    }
  }

  getCartById (cartId) {
    const cart = this.carts.find((cart) => cart.id === parseInt(cartId))
    if (!cart) {
      throw new Error(`The cart with id ${cartId} was not found.`)
    }
    return cart
  }

  checkFile () {
    try {
      // Read the file and parse the content to an array
      const fileContent = fs.readFileSync(this.filePath, 'utf8')
      // Verify if the file is empty.
      if (!fileContent) {
        return []
      }
      return JSON.parse(fileContent) || []
    } catch (error) {
      console.error(error)
      return []
    }
  }

  saveFile () {
    fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2))
  }
}

module.exports = CartManager
