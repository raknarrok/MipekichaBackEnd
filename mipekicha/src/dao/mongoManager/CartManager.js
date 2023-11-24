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
    const documentContent = this.checkDb()

    // Create New Cart
    const cart = {
      products: []
    }

    await cartModel.create(cart)
  }

  async deleteCart(cartId) {
    // Ejecutamos desde mongo el metodo deleteOne, pasandole como parametro el ID del producto
    try {
      await cartModel.deleteOne({ _id: cartId })
      return 'Cart Deleted'
    } catch (error) {
      console.error(error)
    }
  }

  async removeProduct(cartId, productId) {
    try {
      await cartModel.findByIdAndUpdate(
        cartId,
        { $pull: { products: { product: productId } } },
        { new: true }
      )
    } catch (error) {
      console.error(error)
    }
  }

  async removeAllProducts(cartId) {
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
    } else {
      await cartModel.updateOne({ _id: cartId }, { $push: { products: { product: productId, quantity: bodyRequest.products[0].quantity } } })
    }
    return await cartModel.findById(cartId).lean().exec()
  }

  async getAllCarts() {
    return await this.checkDb()
  }

  async getCartById(cartId) {
    const cart = await cartModel.findOne({ _id: cartId }).populate('products.product').lean().exec()
    if (!cart) {
      return 0
    }
    return cart
  }

  async checkDb() {
    try {
      // Read the file and parse the content to an array
      const documentContent = await cartModel.find().lean().exec()
      // Verify if the file is empty.
      if (!documentContent) {
        return []
      }
      return documentContent || []
    } catch (error) {
      console.error(error)
      return []
    }
  }
}

export default CartManager
