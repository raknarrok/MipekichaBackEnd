import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const cartCollection = 'carts'
const productInCartSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    quantity: Number,
})

const cartSchema = new mongoose.Schema({
    products: [productInCartSchema],
})

cartSchema.plugin(mongoosePaginate)

const cartsModel = mongoose.model(cartCollection, cartSchema)

export default cartsModel
