import mongoose from 'mongoose'
import cartModel from './cart.model.js'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
        type: String,
        enum: ['admin', 'premium', 'user'],
        default: 'user'
    },
    last_connection: {
        type: Date,
        default: Date.now
    }
})

userSchema.post('save', async function(doc, next) {
    if (!doc.cart) {
        const cart = await cartModel.create({ user: doc._id })
        await userModel.findOneAndUpdate({ _id: doc._id }, { cart: cart._id })
    }
    next()
})

const userModel = mongoose.model('User', userSchema)

export default userModel