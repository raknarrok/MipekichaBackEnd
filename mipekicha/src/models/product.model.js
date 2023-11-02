import mongoose from "mongoose"

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnails: String,
    code: String,
    stock: Number,
    category: String,
    status: Boolean,
})

const productsModel = mongoose.model(productCollection, productSchema)

export default productsModel
