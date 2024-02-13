import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnails: String,
    code: String,
    stock: Number,
    category: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    statusItem: Boolean,
})

productSchema.plugin(mongoosePaginate)

const productsModel = mongoose.model(productCollection, productSchema)

export default productsModel
