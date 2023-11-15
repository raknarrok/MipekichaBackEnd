/*
Go to cd src
Run node app.js
*/
import cartModel from '../models/cart.model.js'

class CartManager {
  constructor() {
    this.carts = this.checkDb()
  }

  async addCart() {
    const fileContent = this.checkDb()

    // Create New Cart
    const cart = {
      products: []
    }

    await cartModel.create(cart)
  }

  async deleteCart(cartId) {
    // Ejecutamos desde mongo el metodo deleteOne, pasandole como parametro el ID del producto
    try {
      await cartModel.deleteOne({ _id: cartId }).exec()
    } catch (error) {
      console.error(error)
    }
  }

  async removeAllProducts(cartId) {
    // Ejecutamos desde mongo el metodo deleteOne, pasandole como parametro el ID del producto
    try {
      const resetCart = { products: [] }
      await cartModel.findByIdAndUpdate({ _id: cartId }, resetCart, { new: true })

    } catch (error) {
      console.error(error)
    }
  }

  // Add/Update Single Product to Cart
  async addProductToCart(cartId, productId, bodyRequest) {

    const cart = await cartModel.findById(cartId).lean().exec()

    if (!cart) {
      throw new Error(`The cart with id ${cartId} was not found.`)
    }

    // First Validate if we have all the required fields
    if (!bodyRequest.products || bodyRequest.products.length === 0) {
      throw new Error('BAD REQUEST: Bad Request: Hey!!! The request body must contain a valid "products" array with product objects.')
    }

    const stringProductId = productId.toString()

    // Verify if the product is already in the cart
    const isProductInCart = cart.products.some((products) => products.product.toString() === stringProductId)

    if (isProductInCart) {
      // If is in the cart, update the quantity
      await cartModel.updateOne({ _id: cartId, 'products.product': stringProductId }, { $inc: { 'products.$.quantity': bodyRequest.products[0].quantity } })

      return cart
    } else {
      await cartModel.updateOne({ _id: cartId }, { $push: { products: { product: productId, quantity: bodyRequest.products[0].quantity } } })
      return cart
    }
  }

  async getAllCarts() {
    return await this.checkDb()
  }

  async checkDb() {
    try {
      // Read the file and parse the content to an array
      const fileContent = await cartModel.find().lean().exec()
      // Verify if the file is empty.
      if (!fileContent) {
        return []
      }
      return fileContent || []
    } catch (error) {
      console.error(error)
      return []
    }
  }
}

export default CartManager
