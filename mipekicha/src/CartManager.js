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

  addProductToCart (cartId, productId, bodyRequest) {
    const cart = this.carts.find((cart) => cart.id === parseInt(cartId))
    if (!cart) {
      throw new Error(`The cart with id ${cartId} was not found.`)
    }

    // First Validate if we have all the required fields
    if (!bodyRequest.products || !Array.isArray(bodyRequest.products) || bodyRequest.products.length === 0) {
      throw new Error('BAD REQUEST: Bad Request: Hey!!! The request body must contain a valid "products" array with product objects.')
      // console.error('Hey!!! The request body must contain a valid "products" array with product objects.')
      return
    }

    // Read the file and parse the content to an array
    const fileContent = this.checkFile()

    // Verify if the file is empty.
    if (!fileContent) {
      throw new Error(`The cart with id ${cartId} was not found.`)
    }

    // Verify if the product is already in the cart
    const isProductInCart = cart.products.some((product) => product.prodId === parseInt(productId))
    if (isProductInCart) {
      // If is in the cart, update the quantity
      const product = cart.products.find((product) => product.prodId === parseInt(productId))
      const index = cart.products.indexOf(product)
      cart.products[index].quantity += bodyRequest.products[0].quantity
      this.saveFile()
      return cart
    } else {
      // If is not in the cart, add the product
      const product = bodyRequest.products[0]
      cart.products.push(product)
      this.saveFile()
      return cart
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
