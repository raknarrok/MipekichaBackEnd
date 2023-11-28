/*
Go to cd src
Run node app.js
*/
import fs from 'fs'

class CartManagerFileSystem {
  constructor (filePath) {
    this.cartIdCounter = 1
    this.filePath = filePath
    this.carts = this.checkFile()
  }

  addCart () {
    const maxId = this.carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0)
    this.cartIdCounter = maxId + 1
    const fileContent = this.checkFile()
    console.log(fileContent)

    // Create New Cart
    const cart = {
      id: this.cartIdCounter,
      products: []
    }
    this.carts.push(cart)
    this.cartIdCounter++
    this.saveFile()
  }

  deleteCart (cartId) {
    const cart = this.carts.find((cart) => cart.id === parseInt(cartId))
    if (!cart) {
      throw new Error(`The cart with id ${cartId} was not found.`)
    }
    const index = this.carts.indexOf(cart)
    this.carts.splice(index, 1)
    this.saveFile()
  }

  addProductToCart (cartId, productId, bodyRequest) {
    const cart = this.carts.find((cart) => cart.id === parseInt(cartId))
    if (!cart) {
      throw new Error(`The cart with id ${cartId} was not found.`)
    }

    // First Validate if we have all the required fields
    if (!bodyRequest.products || bodyRequest.products.length === 0) {
      throw new Error('BAD REQUEST: Bad Request: Hey!!! The request body must contain a valid "products" array with product objects.')
    }

    // Read the file and parse the content to an array
    const fileContent = this.checkFile()

    // Verify if the file is empty.
    if (!fileContent) {
      throw new Error(`The cart with id ${cartId} was not found.`)
    }

    // Verify if the product is already in the cart
    const isProductInCart = cart.products.some((product) => product.id === parseInt(productId))
    if (isProductInCart) {
      // If is in the cart, update the quantity
      const product = cart.products.find((product) => product.id === parseInt(productId))
      const index = cart.products.indexOf(product)
      cart.products[index].quantity += bodyRequest.products[0].quantity
      this.saveFile()
      return cart
    } else {
      // If is not in the cart, add the product
      const id = { id: parseInt(productId) }
      const product = bodyRequest.products[0]
      const mergeElements = { ...id, ...product }
      cart.products.push(mergeElements)
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

export default CartManagerFileSystem