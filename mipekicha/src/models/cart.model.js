import mongoose from "mongoose"

const cartCollection = 'carts'
const productInCartSchema = new mongoose.Schema({
    id: Number,
    quantity: Number,
})

const cartSchema = new mongoose.Schema({
    products: [productInCartSchema],
})

const cartsModel = mongoose.model(cartCollection, cartSchema)

export default cartsModel
