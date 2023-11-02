import mongoose from "mongoose"

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: Array,
})

const cartsModel = mongoose.model(cartCollection, cartSchema)

export default cartsModel
