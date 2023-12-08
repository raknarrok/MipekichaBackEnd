import CartModel from '../models/cart.model.js'

class Cart {

    createCart = async () => {
        const cart = {
            products: []
        }
        return await CartModel.create(cart)
    }

    // TODO: HOW TO IMPLEMENT THIS?
    addProductToCart = async (cid, pid, data) => {
        return await CartModel.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        )
    }

    deleteCart = async (cid) => {
        return await CartModel.deleteOne({ _id: cid })
    }

    deleteProduct = async (cid, pid) => {
        return await CartModel.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        )
    }

    deleteAllProducts = async (cid) => {
        const resetCart = { products: [] }
        return await CartModel.findByIdAndUpdate(
            { _id: cid }, resetCart, { new: true }
        )
    }

    getAllCarts = async () => {
        return await CartModel.find().lean().exec()
    }

    getCartById = async (cid) => {
        return await CartModel.findOne({ _id: cid }).populate('products.product').lean().exec()
    }
}

export default Cart