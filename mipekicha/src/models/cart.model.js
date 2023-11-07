import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import { Schema } from "mongoose"

const cartCollection = 'carts'
const productInCartSchema = new mongoose.Schema({
    id: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
})

const cartSchema = new mongoose.Schema({
    products: [productInCartSchema],
})

cartSchema.plugin(mongoosePaginate)

const cartsModel = mongoose.model(cartCollection, cartSchema)

export default cartsModel
