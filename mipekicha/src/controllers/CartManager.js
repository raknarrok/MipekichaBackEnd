/*
Go to cd src
Run node app.js
*/
import fs from 'fs'
import cartModel from '../models/cart.model.js'

class CartManager {
  constructor(filePath) {
    this.cartIdCounter = 1
    this.filePath = filePath
    this.carts = this.checkFile()
  }

  addCartFS() {
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

  async addCart() {
    const fileContent = this.checkFile()
    console.log(fileContent)

    // Create New Cart
    const cart = {
      products: []
    }

    await cartModel.create(cart)
  }

  deleteCartSF(cartId) {
    const cart = this.carts.find((cart) => cart.id === parseInt(cartId))
    if (!cart) {
      throw new Error(`The cart with id ${cartId} was not found.`)
    }
    const index = this.carts.indexOf(cart)
    this.carts.splice(index, 1)
    this.saveFile()
  }

  deleteCart(cartId) {
    // Ejecutamos desde mongo el metodo deleteOne, pasandole como parametro el ID del producto
    try {
      cartModel.deleteOne({ _id: cartId }).exec()
    } catch (error) {
      console.error(error)
    }
  }

  async removeAllProducts(cartId) {
    // Ejecutamos desde mongo el metodo deleteOne, pasandole como parametro el ID del producto
    try {
      const resetCart = { products: [] }
      await cartModel.findByIdAndUpdate({ _id: cartId }, resetCart, { new: true })
      console.log("1 document updated")
    } catch (error) {
      console.error(error)
    }
  }

  // Add/Update Single Product to Cart
  async addProductToCart(cartId, productId, bodyRequest) {
    const cart = await cartModel.findById(cartId).lean().exec()
    console.log('Cart Information', cart)

    if (!cart) {
      throw new Error(`The cart with id ${cartId} was not found.`)
    }

    // First Validate if we have all the required fields
    if (!bodyRequest.products || bodyRequest.products.length === 0) {
      throw new Error('BAD REQUEST: Bad Request: Hey!!! The request body must contain a valid "products" array with product objects.')
    }

    const stringProductId = productId.toString()

    // Verify if the product is already in the cart
    const isProductInCart = cart.products.some((product) => product.id.toString() === stringProductId)

    if (isProductInCart) {
      // If is in the cart, update the quantity
      await cartModel.updateOne({ _id: cartId, 'products.id': stringProductId }, { $inc: { 'products.$.quantity': bodyRequest.products[0].quantity } })

      return cart
    } else {
      await cartModel.updateOne({ _id: cartId }, { $push: { products: { id: productId, quantity: bodyRequest.products[0].quantity } } })
      return cart
    }
  }

  getAllCarts() {
    return this.checkFile()
  }

  getCartById(cartId) {
    const cart = this.carts.find((cart) => cart.id === parseInt(cartId))
    if (!cart) {
      throw new Error(`The cart with id ${cartId} was not found.`)
    }
    return cart
  }

  async checkFile() {
    try {
      // Read the file and parse the content to an array
      // const fileContent = fs.readFileSync(this.filePath, 'utf8')
      const fileContent = cartModel.find().lean().exec()
      // Verify if the file is empty.
      if (!fileContent) {
        return []
      }
      // return JSON.parse(fileContent) || []
      return fileContent || []
    } catch (error) {
      console.error(error)
      return []
    }
  }

  saveFile() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2))
  }
}

export default CartManager
